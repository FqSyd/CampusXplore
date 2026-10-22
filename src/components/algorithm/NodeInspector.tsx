import React from 'react';
import { NavigationNode } from '../../types';

export interface NodeInspectorProps {
  node: NavigationNode | null;
  gn?: number;
  hn?: number;
  fn?: number;
  parentNodeId?: string | null;
  status?: 'open' | 'closed' | 'current' | 'route' | 'unvisited';
  onClose?: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  gn,
  hn,
  fn,
  parentNodeId,
  status = 'unvisited',
  onClose,
}) => {
  if (!node) return null;

  const statusColors: Record<string, string> = {
    open: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    closed: 'bg-slate-700/40 text-slate-300 border-slate-600',
    current: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
    route: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    unvisited: 'bg-slate-800/40 text-slate-400 border-slate-700',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-100 font-mono">{node.id}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusColors[status] || statusColors.unvisited}`}>
            {status.toUpperCase()}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="text-slate-400">Position (X, Z):</span>
          <span className="ml-1 font-mono text-slate-200">
            [{node.position[0].toFixed(1)}, {node.position[2].toFixed(1)}]
          </span>
        </div>
        <div>
          <span className="text-slate-400">Parent:</span>
          <span className="ml-1 font-mono text-slate-200">{parentNodeId || 'None (Root)'}</span>
        </div>
      </div>

      {(gn !== undefined || hn !== undefined || fn !== undefined) && (
        <div className="flex items-center justify-between bg-slate-950/70 p-2 rounded border border-slate-800 font-mono text-[11px]">
          <span>g: <strong className="text-emerald-400">{gn?.toFixed(1) ?? '--'}</strong></span>
          <span>h: <strong className="text-cyan-400">{hn?.toFixed(1) ?? '--'}</strong></span>
          <span>f: <strong className="text-purple-400">{fn?.toFixed(1) ?? '--'}</strong></span>
        </div>
      )}
    </div>
  );
};

export default NodeInspector;
