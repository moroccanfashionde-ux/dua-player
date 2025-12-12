import React, { useMemo, useState } from 'react';
import { Search, Info } from 'lucide-react';
import { Dua } from '../types';

interface PlaylistProps {
  items: Dua[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const Playlist: React.FC<PlaylistProps> = ({ items, currentIndex, onSelect }) => {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.roman.toLowerCase().includes(q) ||
      item.de.toLowerCase().includes(q)
    );
  }, [items, query]);

  const getDotColor = (color: Dua['color']) => {
    switch (color) {
      case 'blue': return 'bg-brand-blue shadow-[0_0_0_4px_rgba(56,189,248,0.14)]';
      case 'purple': return 'bg-brand-purple shadow-[0_0_0_4px_rgba(124,92,255,0.14)]';
      case 'orange': return 'bg-brand-orange shadow-[0_0_0_4px_rgba(245,158,11,0.14)]';
      case 'green': 
      default: return 'bg-brand-green shadow-[0_0_0_4px_rgba(34,197,94,0.14)]';
    }
  };

  return (
    <section className="rounded-[26px] bg-gradient-to-b from-white/5 to-white/[0.05] border border-white/10 shadow-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        <div className="flex gap-2.5 items-center rounded-full px-3 py-2.5 bg-panel border border-white/10 mb-3 shrink-0 focus-within:border-white/20 transition-colors">
          <Search className="w-[18px] h-[18px] text-muted" />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche: Heilung, Augen, Schutz…" 
            className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-muted2 text-sm"
          />
        </div>
        
        <div className="text-[12px] text-muted mb-3 shrink-0">
          Tipp: Echte arabische Rezitation für beste Wirkung.
        </div>

        <div className="flex flex-col gap-2.5 overflow-y-auto scrollbar-hide flex-1">
          {filteredItems.length === 0 ? (
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-3 flex gap-3 items-start justify-between cursor-default">
              <div>
                <h3 className="m-0 text-sm tracking-wide font-medium">Keine Treffer</h3>
                <p className="mt-1.5 text-xs leading-snug text-muted">Andere Suche oder Tippfehler prüfen.</p>
              </div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/10 bg-panel text-xs text-white/90">
                <span className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_0_4px_rgba(56,189,248,0.14)]"></span>
                Info
              </div>
            </div>
          ) : (
            filteredItems.map((dua) => {
              // Find the original index to keep playback consistent even when filtering
              const originalIndex = items.findIndex(i => i.id === dua.id);
              const isActive = originalIndex === currentIndex;
              
              return (
                <div 
                  key={dua.id}
                  onClick={() => onSelect(originalIndex)}
                  className={`
                    group rounded-[18px] border p-3 flex gap-3 items-start justify-between cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'bg-brand-blue/10 border-brand-blue/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-px'
                    }
                  `}
                >
                  <div>
                    <h3 className="m-0 text-sm tracking-wide font-medium text-white">{dua.title}</h3>
                    <p className="mt-1.5 text-xs leading-snug text-muted group-hover:text-muted/80 transition-colors">
                      {dua.tag} · Tippe zum Abspielen
                    </p>
                  </div>
                  <div className="shrink-0 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/10 bg-panel text-xs text-white/85">
                    <span className={`w-2 h-2 rounded-full ${getDotColor(dua.color)}`}></span>
                    {dua.tag}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};