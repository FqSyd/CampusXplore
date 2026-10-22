import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface AlgorithmControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speedMs?: number;
  onSpeedChange?: (speedMs: number) => void;
  className?: string;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  speedMs = 150,
  onSpeedChange,
  className = '',
}) => {
  return (
    <div className={`bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 backdrop-blur-md flex flex-col gap-2.5 shadow-xl ${className}`}>
      {/* Header and Step Counter */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">A* Step Controller</span>
        <span className="font-mono text-cyan-400 font-bold bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded">
          {totalSteps > 0 ? `${currentStepIndex + 1} / ${totalSteps}` : '0 / 0'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-cyan-500 h-full transition-all duration-150"
          style={{
            width: totalSteps > 0 ? `${((currentStepIndex + 1) / totalSteps) * 100}%` : '0%',
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onPrev}
          disabled={currentStepIndex <= 0}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Previous Step"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Auto Step</span>
            </>
          )}
        </button>

        <button
          onClick={onNext}
          disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Next Step"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Slider */}
      {onSpeedChange && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
          <span>Speed:</span>
          <input
            type="range"
            min="50"
            max="600"
            step="50"
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="flex-1 accent-cyan-500 cursor-pointer h-1"
          />
          <span className="font-mono text-slate-300 w-10 text-right">{speedMs}ms</span>
        </div>
      )}
    </div>
  );
};

export default AlgorithmControls;
