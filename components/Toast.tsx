import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClear: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        // Allow animation to finish before clearing state completely
        setTimeout(onClear, 300);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [message, onClear]);

  if (!message && !show) return null;

  return (
    <div 
      className={`
        fixed left-1/2 bottom-[90px] -translate-x-1/2 z-50
        max-w-[92vw] px-4 py-2.5 rounded-full
        bg-[#0a0e1a]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur
        flex items-center gap-3 text-sm font-medium text-white
        transition-all duration-300 transform
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
      `}
    >
      <Info className="w-4 h-4 text-brand-blue" />
      <span>{message}</span>
    </div>
  );
};