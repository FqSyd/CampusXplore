import React from 'react';
import { Cpu, CheckCircle2, X } from 'lucide-react';

export interface AlgorithmCodeProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const AlgorithmCode: React.FC<AlgorithmCodeProps> = ({
  isOpen = true,
  onClose,
  isModal = true,
}) => {
  if (isModal && !isOpen) return null;

  const content = (
    <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      {/* Close Button if Modal */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white m-0">A* Pathfinding Algorithm</h2>
          <p className="text-xs text-slate-400 m-0">Heuristic-driven optimal graph search</p>
        </div>
      </div>

      {/* Core Formula Box */}
      <div className="bg-slate-950/70 border border-blue-500/40 rounded-xl p-4 mb-4 text-center">
        <div className="text-xs uppercase font-semibold text-blue-400 tracking-wider mb-1">
          Evaluation Function
        </div>
        <div className="text-2xl font-black text-white font-mono tracking-wide py-1">
          f(n) = g(n) + h(n)
        </div>
        <div className="text-xs text-slate-300 mt-1">
          Selects the next node with the lowest estimated total path cost.
        </div>
      </div>

      {/* Mathematical Terms Explanation */}
      <div className="space-y-3 text-xs mb-5">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <span className="font-mono text-emerald-400 font-bold text-sm shrink-0 mt-0.5">
            g(n)
          </span>
          <div>
            <div className="font-semibold text-slate-200">Exact Path Cost from Start</div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              The actual cumulative distance traversed along graph road/walkway edges from the start node to node n.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <span className="font-mono text-cyan-400 font-bold text-sm shrink-0 mt-0.5">
            h(n)
          </span>
          <div>
            <div className="font-semibold text-slate-200">Admissible Heuristic Estimate</div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Straight-line 3D Euclidean distance from node n to the destination. Because Euclidean distance is straight-line, it never overestimates real path distance, guaranteeing mathematical optimality.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <span className="font-mono text-purple-400 font-bold text-sm shrink-0 mt-0.5">
            f(n)
          </span>
          <div>
            <div className="font-semibold text-slate-200">Total Estimated Route Cost</div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Combined evaluation. Using a Min-Heap priority queue, the algorithm always expands the most promising node next.
            </p>
          </div>
        </div>
      </div>

      {/* Key Properties */}
      <div className="border-t border-slate-800 pt-4">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Why A* for Campus Navigation?
        </div>
        <ul className="text-xs text-slate-400 space-y-1.5 pl-1">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Optimal:</strong> Guarantees the shortest physical walking distance.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Efficient:</strong> Directs search towards the goal instead of searching everywhere like Dijkstra.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Obstacle Avoidance:</strong> Physical obstacles automatically invalidate intersecting edges.</span>
          </li>
        </ul>
      </div>

      {isModal && onClose && (
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
        >
          Got It
        </button>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        {content}
      </div>
    );
  }

  return content;
};

export const AlgorithmInfoModal = AlgorithmCode;
export default AlgorithmCode;
