import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioPlayerProps {
  onEnd?: () => void;
  onError?: (msg: string) => void;
}

export const useAudioPlayer = ({ onEnd, onError }: UseAudioPlayerProps = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for callbacks to access latest closures in event listeners
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);

  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    
    const handleEnded = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onEndRef.current?.();
    };

    const handleError = (e: Event) => {
      // Access the actual error from the audio element
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      
      console.error("Audio error details:", error);
      
      let errorMsg = "Audio konnte nicht geladen werden.";
      if (error) {
        if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
          errorMsg = "Format nicht unterstützt oder Quelle nicht gefunden.";
        } else if (error.code === MediaError.MEDIA_ERR_NETWORK) {
          errorMsg = "Netzwerkfehler beim Laden.";
        } else if (error.code === MediaError.MEDIA_ERR_DECODE) {
          errorMsg = "Fehler beim Dekodieren.";
        }
      }

      setIsPlaying(false);
      setIsPaused(false);
      onErrorRef.current?.(errorMsg);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.src = '';
    };
  }, []);

  const play = useCallback((url: string, rate: number = 1.0) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // If different URL, load new. If same, just ensure we play (or restart if ended)
    if (audio.src !== url) {
      audio.src = url;
      audio.load();
    }
    
    audio.playbackRate = rate;
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsPaused(false);
        })
        .catch(e => {
          // Ignore abort errors (usually from skipping tracks quickly)
          if (e.name === 'AbortError') return;
          
          console.error("Play failed:", e);
          setIsPlaying(false);
          setIsPaused(false);
          
          if (e.name === 'NotSupportedError') {
             onErrorRef.current?.("Audio-Quelle nicht unterstützt.");
          } else {
             onErrorRef.current?.("Wiedergabe fehlgeschlagen.");
          }
        });
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused && audioRef.current.src) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsPaused(false);
          })
          .catch(e => {
             if (e.name === 'AbortError') return;
             console.error("Resume failed", e);
          });
    }
  }, []);
  
  const setRate = useCallback((rate: number) => {
      if (audioRef.current) {
          audioRef.current.playbackRate = rate;
      }
  }, []);

  return {
    isPlaying,
    isPaused,
    play,
    pause,
    resume,
    setRate
  };
};