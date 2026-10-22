import React from 'react';

export interface ScoreDisplayProps {
  gn?: number;
  hn?: number;
  fn?: number;
  nodeName?: string;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  gn,
  hn,
  fn,
  nodeName,
  className = '',
}) => {
  return (
    <div className={`bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          A* Evaluation Scores
        </span>
        {nodeName && (
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
            {nodeName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {/* g(n) */}
        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-lg p-2">
          <div className="text-[10px] uppercase font-semibold text-emerald-400">
            g(n) Exact
          </div>
          <div className="text-sm font-bold font-mono text-emerald-300">
            {gn !== undefined ? gn.toFixed(1) : '--'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Start to Node</div>
        </div>

        {/* h(n) */}
        <div className="bg-slate-950/60 border border-cyan-500/30 rounded-lg p-2">
          <div className="text-[10px] uppercase font-semibold text-cyan-400">
            h(n) Heuristic
          </div>
          <div className="text-sm font-bold font-mono text-cyan-300">
            {hn !== undefined ? hn.toFixed(1) : '--'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Node to Goal</div>
        </div>

        {/* f(n) */}
        <div className="bg-slate-950/60 border border-purple-500/30 rounded-lg p-2">
          <div className="text-[10px] uppercase font-semibold text-purple-400">
            f(n) Total
          </div>
          <div className="text-sm font-bold font-mono text-purple-300">
            {fn !== undefined ? fn.toFixed(1) : '--'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">g(n) + h(n)</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
