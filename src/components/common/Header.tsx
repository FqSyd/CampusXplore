import React from 'react';
import { Compass, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenAlgorithmModal: () => void;
  campusName?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAlgorithmModal }) => {
  return (
    <header className="glass-panel border-b border-slate-700/60 px-5 py-3 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white m-0">
            CAMPUSXPLORE
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAlgorithmModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Learn how A* works"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Algorithm Explained</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
