import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Playlist } from './components/Playlist';
import { Player } from './components/Player';
import { Toast } from './components/Toast';
import { DUAS } from './constants';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { LoopMode } from './types';

function App() {
  // --- State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loopMode, setLoopMode] = useState<LoopMode>('all');
  
  // Audio settings
  const [rate, setRate] = useState(1.0);
  
  // UI
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Refs to track state inside callbacks ---
  const currentIndexRef = useRef(currentIndex);
  const loopModeRef = useRef(loopMode);
  
  // Ref for the triggerPlay function
  const triggerPlayRef = useRef<(index: number) => void>(() => {});

  // Keep refs updated
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { loopModeRef.current = loopMode; }, [loopMode]);

  // --- Logic for Playback Flow ---
  const handleTrackEnd = useCallback(() => {
    const current = currentIndexRef.current;
    const loop = loopModeRef.current;

    if (loop === 'track') {
      // Re-trigger play for same index
      triggerPlayRef.current(current);
    } else {
      // Next track
      const nextIndex = current + 1;
      if (nextIndex < DUAS.length) {
        setCurrentIndex(nextIndex);
        triggerPlayRef.current(nextIndex);
      } else if (loop === 'all') {
        setCurrentIndex(0);
        triggerPlayRef.current(0);
      }
    }
  }, []);

  const handleTrackError = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // --- Audio Hook ---
  const { 
    isPlaying, isPaused, play, pause, resume, setRate: setPlayerRate 
  } = useAudioPlayer({
    onEnd: handleTrackEnd,
    onError: handleTrackError
  });

  // --- Helpers ---
  const triggerPlay = useCallback((index: number) => {
    const dua = DUAS[index];
    play(dua.audioUrl, rate);
  }, [play, rate]);

  // Keep triggerPlayRef updated
  useEffect(() => {
    triggerPlayRef.current = triggerPlay;
  }, [triggerPlay]);

  // --- Handlers ---

  const togglePlay = () => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      triggerPlay(currentIndex);
    }
  };

  const nextTrack = () => {
    const next = (currentIndex + 1) % DUAS.length;
    setCurrentIndex(next);
    triggerPlay(next);
  };

  const prevTrack = () => {
    const prev = (currentIndex - 1 + DUAS.length) % DUAS.length;
    setCurrentIndex(prev);
    triggerPlay(prev);
  };

  const toggleLoop = () => {
    setLoopMode(prev => {
      const modes: LoopMode[] = ['off', 'track', 'all'];
      const idx = modes.indexOf(prev);
      const next = modes[(idx + 1) % modes.length];
      setToastMessage(
        next === 'track' ? "Loop Track an" : 
        next === 'all' ? "Loop All an" : "Loop aus"
      );
      return next;
    });
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setPlayerRate(newRate);
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
    triggerPlay(index);
  };

  const handleInstall = () => {
    setToastMessage("Browser-Menü → „Zum Startbildschirm“");
  };

  // --- PWA Manifest injection (Simulated) ---
  useEffect(() => {
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#7c5cff"/>
            <stop offset="1" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="110" fill="url(#g)"/>
        <g fill="none" stroke="white" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">
          <path d="M8 180v152l140-76z"></path>
          <path d="M260 180h120"></path>
          <path d="M260 256h160"></path>
          <path d="M260 332h120"></path>
        </g>
      </svg>`;
    const iconSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgIcon.trim());

    // Update Favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconSrc;

    // Create manifest blob url
    const manifest = {
      name: "Duʿāʾ Player",
      short_name: "Duʿāʾ",
      start_url: ".",
      display: "standalone",
      background_color: "#070a12",
      theme_color: "#0b0f1a",
      icons: [{ src: iconSrc, sizes: "512x512", type: "image/svg+xml" }]
    };
    const blob = new Blob([JSON.stringify(manifest)], {type:"application/manifest+json"});
    const manifestUrl = URL.createObjectURL(blob);
    
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if(!manifestLink){
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestUrl;

    return () => URL.revokeObjectURL(manifestUrl);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header onInstall={handleInstall} />

      <main className="flex-1 w-full max-w-[1120px] mx-auto px-4 py-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-4 items-start">
          
          <div className="h-[500px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-24">
            <Playlist 
              items={DUAS} 
              currentIndex={currentIndex} 
              onSelect={handleSelect} 
            />
          </div>

          <div>
             <Player 
               currentDua={DUAS[currentIndex]}
               isPlaying={isPlaying}
               isPaused={isPaused}
               loopMode={loopMode}
               onTogglePlay={togglePlay}
               onNext={nextTrack}
               onPrev={prevTrack}
               onToggleLoopMode={toggleLoop}
               onRateChange={handleRateChange}
             />
          </div>

        </div>
      </main>

      <Toast message={toastMessage} onClear={() => setToastMessage(null)} />
    </div>
  );
}

export default App;