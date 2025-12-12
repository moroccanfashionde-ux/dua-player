import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Repeat, Repeat1
} from 'lucide-react';
import { Dua, TextTab, LoopMode } from '../types';

interface PlayerProps {
  currentDua: Dua;
  isPlaying: boolean;
  isPaused: boolean;
  loopMode: LoopMode;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLoopMode: () => void;
  onRateChange: (val: number) => void;
}

const btnBaseClass = "inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-[14px] border border-white/10 bg-white/[0.06] text-white text-sm font-medium cursor-pointer transition-all duration-[120ms] ease-out select-none hover:-translate-y-px hover:bg-white/[0.085] active:translate-y-0 active:scale-[0.99]";

export const Player: React.FC<PlayerProps> = ({
  currentDua, isPlaying, isPaused, loopMode,
  onTogglePlay, onNext, onPrev, onToggleLoopMode,
  onRateChange
}) => {
  const [activeTab, setActiveTab] = useState<TextTab>('roman');
  const [rate, setRate] = useState(1.0);

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setRate(v);
    onRateChange(v);
  };
  
  const getStatusText = () => {
    if (isPlaying && !isPaused) return 'spielt…';
    if (isPaused) return 'pausiert';
    return 'bereit';
  };

  return (
    <section className="rounded-[26px] bg-gradient-to-b from-white/5 to-white/[0.05] border border-white/10 shadow-xl overflow-hidden h-full">
      <div className="p-4">
        {/* Now Playing Header */}
        <div className="flex gap-3 items-center justify-between rounded-[22px] bg-white/5 border border-white/10 p-3.5 mb-3">
          <div className="flex gap-3 items-center min-w-0">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-brand-purple/30 to-brand-blue/20 border border-white/15 grid place-items-center shadow-lg shrink-0">
              <Play className="w-6 h-6 text-white/90" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <h2 className="m-0 text-[15px] font-semibold truncate text-white">{currentDua.title}</h2>
              <p className="mt-1.5 text-xs text-muted leading-snug truncate">
                {currentDua.tag} · Audio
              </p>
            </div>
          </div>
          <div className="hidden sm:inline-flex shrink-0 items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/10 bg-panel text-xs text-white/85">
            <span className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_0_4px_rgba(56,189,248,0.14)]"></span>
            {getStatusText()}
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex gap-2.5 flex-wrap justify-center sm:justify-start mb-3">
          <button onClick={onPrev} className={btnBaseClass}>
            <SkipBack className="w-[18px] h-[18px]" />
            <span className="hidden xs:inline">Zurück</span>
          </button>
          
          <button 
            onClick={onTogglePlay} 
            className={`${btnBaseClass} bg-gradient-to-br from-brand-green/20 to-brand-blue/15 hover:from-brand-green/30 hover:to-brand-blue/25 border-white/15`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-[18px] h-[18px]" fill="currentColor" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-[18px] h-[18px]" fill="currentColor" />
                <span>Play</span>
              </>
            )}
          </button>
          
          <button onClick={onNext} className={btnBaseClass}>
            <SkipForward className="w-[18px] h-[18px]" />
            <span className="hidden xs:inline">Weiter</span>
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex gap-2.5 flex-wrap justify-center sm:justify-start mb-3">
          <button 
            onClick={onToggleLoopMode}
            className={`${btnBaseClass} ${loopMode !== 'off' ? 'bg-gradient-to-br from-brand-blue/20 to-brand-purple/15 border-brand-blue/30 text-white' : ''}`}
            title={loopMode === 'track' ? 'Track wiederholen' : loopMode === 'all' ? 'Playlist wiederholen' : 'Kein Loop'}
          >
            {loopMode === 'track' ? <Repeat1 className="w-[18px] h-[18px]" /> : <Repeat className="w-[18px] h-[18px]" />}
            <span className="hidden sm:inline">{loopMode === 'track' ? 'Loop Track' : loopMode === 'all' ? 'Loop All' : 'No Loop'}</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="mb-3">
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-3">
            <label className="flex justify-between items-center text-xs text-white/85 mb-2">
              <span>Tempo</span>
              <small className="text-muted2">{rate.toFixed(2)}x</small>
            </label>
            <input 
              type="range" min="0.7" max="1.5" step="0.05" 
              value={rate} onChange={handleRate}
              className="w-full"
            />
          </div>
        </div>

        {/* Text Panel */}
        <div className="rounded-[22px] border border-white/10 bg-white/5 overflow-hidden">
          <div className="flex gap-2 p-3 border-b border-white/10 flex-wrap">
            {(['roman', 'arabic', 'de'] as TextTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all
                  ${activeTab === tab 
                    ? 'bg-brand-blue/10 border-brand-blue/30 text-white' 
                    : 'bg-panel border-white/10 text-white/70 hover:bg-panelHover'
                  }
                `}
              >
                {tab === 'roman' ? 'Römisch' : tab === 'arabic' ? 'Arabisch' : 'Deutsch'}
              </button>
            ))}
          </div>
          <div className={`p-4 min-h-[120px] text-sm leading-relaxed text-white/90 whitespace-pre-wrap ${activeTab === 'arabic' ? 'font-arabic text-xl text-right' : ''}`}>
            {activeTab === 'roman' ? currentDua.roman : activeTab === 'arabic' ? currentDua.arabic : currentDua.de}
          </div>
        </div>

        <div className="mt-3 text-[11px] text-muted2 leading-relaxed">
           Hinweis: Dies ist eine echte Audio-Rezitation (MP3). Die Wiedergabegeschwindigkeit kann angepasst werden.
        </div>
      </div>
    </section>
  );
};