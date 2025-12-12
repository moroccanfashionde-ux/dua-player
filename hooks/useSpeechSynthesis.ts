import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeakMode } from '../types';

export interface Voice {
  name: string;
  lang: string;
  isLocalService: boolean;
  voiceURI: string;
  default: boolean;
}

interface UseSpeechSynthesisProps {
  onEnd?: () => void;
  onError?: () => void;
}

export const useSpeechSynthesis = ({ onEnd, onError }: UseSpeechSynthesisProps = {}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const vs = window.speechSynthesis.getVoices();
      setVoices(vs);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string, voiceName: string | null, rate: number, pitch: number) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;

    if (voiceName) {
      const selectedVoice = voices.find(v => v.name === voiceName);
      if (selectedVoice) u.voice = selectedVoice;
    }

    u.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onEnd?.();
    };

    u.onerror = (e) => {
      // Ignore interruptions caused by switching tracks or cancelling
      if (e.error === 'interrupted' || e.error === 'canceled') {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }
      
      console.error("Speech error", e.error);
      setIsPlaying(false);
      setIsPaused(false);
      onError?.();
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [voices, onEnd, onError]);

  const pause = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false); // UI state
    }
  }, []);

  const resume = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Helper to suggest a voice based on language and keywords (like "Siri" or "Enhanced")
  const getBestVoice = useCallback((mode: SpeakMode) => {
    if (voices.length === 0) return null;
    const wantLang = mode === 'arabic' ? 'ar' : 'de';
    
    // Scoring system
    const score = (v: SpeechSynthesisVoice) => {
      let s = 0;
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      
      if (lang.startsWith(wantLang)) s += 10;
      // Prefer Siri or Premium voices usually found on Apple/Google devices for better quality
      if (name.includes('siri')) s += 5;
      if (name.includes('premium') || name.includes('enhanced')) s += 3;
      return s;
    };

    const sorted = [...voices].sort((a, b) => score(b) - score(a));
    return sorted[0] || voices[0];
  }, [voices]);

  return {
    voices,
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
    getBestVoice
  };
};