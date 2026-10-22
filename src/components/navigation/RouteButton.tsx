import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface RouteButtonProps {
  onFindRoute: () => void;
  onResetRoute: () => void;
  isSearching: boolean;
}

export const RouteButton: React.FC<RouteButtonProps> = ({
  onFindRoute,
  onResetRoute,
  isSearching,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onFindRoute}
        disabled={isSearching}
        className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 border border-blue-400/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-cyan-300" />
        <span>{isSearching ? 'Searching...' : 'Find Walkable Route'}</span>
      </button>

      <button
        onClick={onResetRoute}
        disabled={isSearching}
        className="py-3 px-3.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        title="Reset Route and Clear Visualization"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RouteButton;
