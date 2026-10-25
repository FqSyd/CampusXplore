import React, { useState } from 'react';
import { CampusBuilding, AStarResult } from '../../types';
import { formatDistance } from '../../utils/distance';
import { formatRouteWaypoints } from '../../utils/routeUtils';
import { CampusGraph } from '../../algorithms/graph';
import { Clock, Footprints, ChevronDown, ChevronUp, Cpu, Route as RouteIcon } from 'lucide-react';

interface RouteInfoProps {
  result: AStarResult | null;
  startBuilding: CampusBuilding | null;
  destBuilding: CampusBuilding | null;
  graph: CampusGraph;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
}

export const RouteInfo: React.FC<RouteInfoProps> = ({
  result,
  startBuilding,
  destBuilding,
  graph,
  selectedNodeId,
  onSelectNode,
}) => {
  const [showDetailedSteps, setShowDetailedSteps] = useState(false);

  if (!result || !result.found || !startBuilding || !destBuilding) {
    return null;
  }

  if (startBuilding.id === destBuilding.id) {
    return null;
  }

  const waypoints = formatRouteWaypoints(result, graph);

  return (
    <div className="glass-panel rounded-xl p-4 border border-emerald-500/30 shadow-2xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Route Found
          </span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
          Optimal Walkable Path
        </span>
      </div>

      {/* From and To badges */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
          <span className="text-slate-400 text-[11px] shrink-0">From:</span>
          <span className="font-semibold text-slate-100 truncate">{startBuilding.name}</span>
        </div>
        <span className="text-slate-600 px-2">→</span>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
          <span className="text-slate-400 text-[11px] shrink-0">To:</span>
          <span className="font-semibold text-slate-100 truncate">{destBuilding.name}</span>
        </div>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Distance Card */}
        <div className="glass-panel-subtle rounded-lg p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Distance</div>
            <div className="text-sm font-bold text-white tracking-tight">
              {formatDistance(result.totalDistance)}
            </div>
          </div>
        </div>

        {/* Walking Time Card */}
        <div className="glass-panel-subtle rounded-lg p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Walking Time</div>
            <div className="text-sm font-bold text-white tracking-tight">
              {result.estimatedWalkingTimeMinutes} min
            </div>
          </div>
        </div>

        {/* Nodes Explored */}
        <div className="glass-panel-subtle rounded-lg p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Explored</div>
            <div className="text-sm font-bold text-white tracking-tight">
              {result.nodesExplored} nodes
            </div>
          </div>
        </div>

        {/* Path Waypoints */}
        <div className="glass-panel-subtle rounded-lg p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <RouteIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Path Nodes</div>
            <div className="text-sm font-bold text-white tracking-tight">
              {result.path.length} waypoints
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 italic text-center">
        * Simulated campus distance at ~1.4 m/s pedestrian speed
      </div>

      {/* Expandable Turn-By-Turn Waypoint List */}
      <div className="border-t border-slate-800 pt-2">
        <button
          onClick={() => setShowDetailedSteps(!showDetailedSteps)}
          className="w-full flex items-center justify-between text-[11px] font-medium text-slate-400 hover:text-slate-200 py-1 transition-colors cursor-pointer"
        >
          <span>View Turn-by-Turn Route Nodes ({waypoints.length})</span>
          {showDetailedSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetailedSteps && (
          <div className="mt-2 space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {waypoints.map((wp) => {
              const analysis = result.routeNodesAnalysis?.find((a) => a.nodeId === wp.nodeId);
              const isSelected = wp.nodeId === selectedNodeId;

              return (
                <div
                  key={`wp-item-${wp.nodeId}-${wp.index}`}
                  onClick={() => onSelectNode?.(wp.nodeId)}
                  className={`flex items-center justify-between text-xs py-1.5 px-2 rounded cursor-pointer transition ${
                    isSelected
                      ? 'bg-cyan-950/70 border border-cyan-400 text-cyan-200'
                      : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                  title="Click to view A* calculation for this waypoint"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        wp.isStart
                          ? 'bg-emerald-500 text-white'
                          : wp.isDestination
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {wp.index}
                    </span>
                    <span className="font-medium truncate">{wp.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {analysis && (
                      <span className="text-[10px] font-mono text-cyan-300 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        f={analysis.f}m
                      </span>
                    )}
                    {wp.isBuildingEntrance && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        Entrance
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInfo;
