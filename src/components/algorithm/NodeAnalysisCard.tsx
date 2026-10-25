import React from 'react';
import { RouteNodeAnalysis, AStarStep } from '../../types';
import { ChevronLeft, ChevronRight, X, Compass, Activity, CheckCircle2 } from 'lucide-react';

export interface NodeAnalysisCardProps {
  selectedNode: RouteNodeAnalysis | null;
  currentStep?: AStarStep | null;
  isSearching?: boolean;
  onSelectWaypointIndex?: (index: number) => void;
  onClose?: () => void;
  className?: string;
}

export const NodeAnalysisCard: React.FC<NodeAnalysisCardProps> = ({
  selectedNode,
  currentStep,
  isSearching = false,
  onSelectWaypointIndex,
  onClose,
  className = '',
}) => {
  // If in active search mode and we have a step, prefer current step info; otherwise use selected waypoint node
  const isSearchMode = isSearching && !!currentStep;

  if (!selectedNode && !currentStep) {
    return null;
  }

  const nodeName = isSearchMode ? (currentStep?.nodeName || currentStep?.nodeId) : (selectedNode?.nodeName || selectedNode?.nodeId);
  const nodeId = isSearchMode ? currentStep?.nodeId : selectedNode?.nodeId;
  const g = isSearchMode ? (currentStep?.g ?? 0) : (selectedNode?.g ?? 0);
  const h = isSearchMode ? (currentStep?.h ?? 0) : (selectedNode?.h ?? 0);
  const f = isSearchMode ? (currentStep?.f ?? (g + h)) : (selectedNode?.f ?? (g + h));
  const parentName = isSearchMode ? (currentStep?.parentName || currentStep?.parent) : (selectedNode?.parentName || selectedNode?.parent);
  const expansionOrder = isSearchMode ? currentStep?.stepNumber : selectedNode?.expansionOrder;
  const candidates = isSearchMode ? currentStep?.openSetCandidates : undefined;
  const selectionReason = isSearchMode ? currentStep?.selectionReason : undefined;

  const waypointIdx = selectedNode?.waypointIndex ?? 1;
  const totalWaypoints = selectedNode?.totalWaypoints ?? 1;

  return (
    <div
      className={`absolute top-4 right-4 z-30 w-84 md:w-96 rounded-2xl glass-panel border border-cyan-500/40 bg-slate-950/85 backdrop-blur-xl p-4 shadow-2xl shadow-cyan-950/40 text-slate-100 flex flex-col gap-3 transition-all animate-fadeIn ${className}`}
      style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
    >
      {/* Header with Title and Close Button */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            {isSearchMode ? <Activity className="w-4 h-4 animate-pulse" /> : <Compass className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wider uppercase text-cyan-300">
              {isSearchMode ? 'A* Search Step Analysis' : 'A* Node Analysis'}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              {isSearchMode
                ? `Evaluation Step #${currentStep?.stepNumber}`
                : `Waypoint ${waypointIdx} of ${totalWaypoints}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {selectedNode?.isStart && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ORIGIN
            </span>
          )}
          {selectedNode?.isDestination && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              DESTINATION
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition ml-1"
              title="Close panel"
              aria-label="Close panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Node Name & ID */}
      <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Selected Waypoint Node
          </span>
          <span className="text-sm font-bold text-slate-100">{nodeName}</span>
          <span className="text-[10px] font-mono text-cyan-400/80">{nodeId}</span>
        </div>

        {expansionOrder !== undefined && (
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Expansion Order</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
              #{expansionOrder}
            </span>
          </div>
        )}
      </div>

      {/* Formula & Breakdown: f(n) = g(n) + h(n) */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Cost Evaluation Formula</span>
          <span className="font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            f(n) = g(n) + h(n)
          </span>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2">
          {/* g(n) */}
          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-lg p-2 text-center">
            <div className="text-[10px] font-bold text-emerald-400">g(n)</div>
            <div className="text-base font-extrabold font-mono text-emerald-300">
              {g} <span className="text-[10px] font-normal text-emerald-400/80">m</span>
            </div>
            <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Accumulated Cost</div>
          </div>

          {/* h(n) */}
          <div className="bg-slate-950/80 border border-cyan-500/40 rounded-lg p-2 text-center">
            <div className="text-[10px] font-bold text-cyan-400">h(n)</div>
            <div className="text-base font-extrabold font-mono text-cyan-300">
              {h} <span className="text-[10px] font-normal text-cyan-400/80">m</span>
            </div>
            <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Heuristic Est.</div>
          </div>

          {/* f(n) */}
          <div className="bg-slate-950/80 border border-purple-500/40 rounded-lg p-2 text-center">
            <div className="text-[10px] font-bold text-purple-400">f(n)</div>
            <div className="text-base font-extrabold font-mono text-purple-300">
              {f} <span className="text-[10px] font-normal text-purple-400/80">m</span>
            </div>
            <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Total Est. Cost</div>
          </div>
        </div>

        {/* Math Calculation Display */}
        <div className="bg-slate-950/90 rounded-lg px-2.5 py-1.5 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Calculation:</span>
          <span className="text-slate-100 font-bold">
            f(n) = <span className="text-emerald-400">{g}</span> +{' '}
            <span className="text-cyan-400">{h}</span> ={' '}
            <span className="text-purple-400">{f} m</span>
          </span>
        </div>
      </div>

      {/* Parent / Predecessor Info */}
      <div className="bg-slate-900/70 rounded-xl px-3 py-2 border border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Predecessor (Parent Node):</span>
        <span className="font-mono font-medium text-slate-200">
          {parentName ? `${parentName}` : 'None (Origin)'}
        </span>
      </div>

      {/* Natural Language Explanation Box */}
      {selectedNode?.explanation && !isSearchMode && (
        <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-2.5 text-[11px] leading-relaxed text-cyan-200/90">
          <p className="italic">"{selectedNode.explanation}"</p>
        </div>
      )}

      {/* If Search Animation is running, display candidate comparison */}
      {isSearchMode && (
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-amber-500/30 space-y-2">
          {selectionReason && (
            <div className="text-[11px] text-amber-300 leading-tight">
              <strong>Selection Logic:</strong> {selectionReason}
            </div>
          )}

          {candidates && candidates.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Open Set Candidates (sorted by lowest f score):
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                {candidates.map((cand) => (
                  <div
                    key={cand.nodeId}
                    className={`flex items-center justify-between px-2 py-1 rounded text-[10px] font-mono ${
                      cand.nodeId === nodeId
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                        : 'bg-slate-950/50 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[130px] font-semibold">{cand.nodeName}</span>
                    <span>
                      g={cand.g} h={cand.h} → <strong className="text-cyan-300">f={cand.f}m</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Waypoint Stepping Controls (Previous / Next along Route) */}
      {!isSearchMode && onSelectWaypointIndex && totalWaypoints > 1 && (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={() => onSelectWaypointIndex(Math.max(0, waypointIdx - 2))}
            disabled={waypointIdx <= 1}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition text-xs font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Waypoint</span>
          </button>

          <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2">
            {waypointIdx} / {totalWaypoints}
          </span>

          <button
            onClick={() => onSelectWaypointIndex(Math.min(totalWaypoints - 1, waypointIdx))}
            disabled={waypointIdx >= totalWaypoints}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-cyan-600/30 transition text-xs font-semibold"
          >
            <span>Next Waypoint</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Small Hint */}
      <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
        <span>Click any circular waypoint along route to inspect its A* score</span>
      </div>
    </div>
  );
};

export default NodeAnalysisCard;
