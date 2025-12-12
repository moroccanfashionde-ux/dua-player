import React from 'react';
import { Play, Download } from 'lucide-react';

interface HeaderProps {
  onInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onInstall }) => {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/80 border-b border-stroke">
      <div className="max-w-[1120px] mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-[42px] h-[42px] rounded-2xl bg-gradient-to-br from-brand-purple/90 to-brand-blue/85 border border-white/10 shadow-[0_14px_35px_rgba(124,92,255,0.25)] grid place-items-center">
            <Play className="w-[18px] h-[18px] text-white ml-0.5" fill="currentColor" />
          </div>
          <div>
            <h1 className="m-0 text-[15px] tracking-wide leading-none font-semibold text-white">
              Duʿāʾ Player
            </h1>
            <small className="block text-[12px] text-muted font-medium mt-0.5">
              Loop · Stimme · Playlist
            </small>
          </div>
        </div>

        <button 
          onClick={onInstall}
          className="inline-flex gap-2 items-center px-3 py-2 rounded-full bg-panel border border-white/10 hover:bg-panelHover active:scale-95 transition-all text-sm font-medium text-white/90"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Installieren</span>
        </button>
      </div>
    </header>
  );
};