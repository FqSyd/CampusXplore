import React from 'react';
import { CampusBuilding, NavigationStatus, AStarResult, CampusObstacle, DemoRoute, WalkerProgress } from '../../types';
import { CampusGraph } from '../../algorithms/graph';
import { LocationSelector } from './LocationSelector';
import { RouteButton } from './RouteButton';
import { PresetRoutes } from './PresetRoutes';
import { ObstacleControlPanel } from './ObstacleControlPanel';
import { RouteInfo } from '../route/RouteInfo';
import { RouteStatus } from '../route/RouteStatus';
import { Navigation as NavIcon } from 'lucide-react';

interface NavigationPanelProps {
  buildings: CampusBuilding[];
  startBuildingId: string;
  destBuildingId: string;
  onStartChange: (id: string) => void;
  onDestChange: (id: string) => void;
  onSwapLocations: () => void;
  onFindRoute: () => void;
  onResetRoute: () => void;
  isSearching: boolean;
  animateSearch: boolean;
  onToggleAnimateSearch: () => void;
  status: NavigationStatus;
  errorMessage?: string;
  result: AStarResult | null;
  graph: CampusGraph;
  onSelectScenario: (scenario: DemoRoute) => void;
  activeScenarioId?: string;
  obstacles: CampusObstacle[];
  activeObstacleIds: Set<string>;
  onToggleObstacle: (id: string) => void;
  walkerProgress?: WalkerProgress | null;
  rerouteNotice?: string;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  buildings,
  startBuildingId,
  destBuildingId,
  onStartChange,
  onDestChange,
  onSwapLocations,
  onFindRoute,
  onResetRoute,
  isSearching,
  animateSearch,
  onToggleAnimateSearch,
  status,
  errorMessage,
  result,
  graph,
  onSelectScenario,
  activeScenarioId,
  obstacles,
  activeObstacleIds,
  onToggleObstacle,
  walkerProgress,
  rerouteNotice,
  selectedNodeId,
  onSelectNode,
}) => {
  const startBuilding = buildings.find((b) => b.id === startBuildingId) || null;
  const destBuilding = buildings.find((b) => b.id === destBuildingId) || null;

  return (
    <aside className="w-full md:w-96 glass-panel border-r border-slate-700/60 p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-65px)] z-20 shadow-2xl">
      {/* Panel Header */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 m-0">
          <NavIcon className="w-4 h-4 text-blue-400" />
          <span>Walkable Wayfinding</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select origin and destination to compute obstacle-free walking path
        </p>
      </div>

      {/* Origin & Destination Dropdown Selectors */}
      <LocationSelector
        buildings={buildings}
        startBuildingId={startBuildingId}
        destBuildingId={destBuildingId}
        onStartChange={onStartChange}
        onDestChange={onDestChange}
        onSwapLocations={onSwapLocations}
        disabled={isSearching}
      />

      {/* Animate Search Toggle */}
      <div className="flex items-center justify-between px-1 text-xs">
        <label
          htmlFor="animate-toggle"
          className="flex items-center gap-2 text-slate-300 cursor-pointer select-none"
        >
          <input
            id="animate-toggle"
            type="checkbox"
            checked={animateSearch}
            onChange={onToggleAnimateSearch}
            className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
          />
          <span className="text-[11px] font-medium">Animate A* Search Process</span>
        </label>
        <span className="text-[10px] text-slate-500 uppercase font-mono">Visualizer</span>
      </div>

      {/* Find Route / Reset Actions */}
      <RouteButton
        onFindRoute={onFindRoute}
        onResetRoute={onResetRoute}
        isSearching={isSearching}
      />

      {/* Status Banner */}
      <RouteStatus
        status={status}
        errorMessage={errorMessage}
        walkerProgress={walkerProgress}
        startName={startBuilding?.name}
        destinationName={destBuilding?.name}
        rerouteNotice={rerouteNotice}
      />

      {/* Obstacle Control Panel */}
      <ObstacleControlPanel
        obstacles={obstacles}
        activeObstacleIds={activeObstacleIds}
        onToggleObstacle={onToggleObstacle}
      />

      {/* Preset Demo Scenarios */}
      <PresetRoutes
        onSelectScenario={onSelectScenario}
        activeScenarioId={activeScenarioId}
      />

      {/* Calculated Route Information Panel */}
      <RouteInfo
        result={result}
        startBuilding={startBuilding}
        destBuilding={destBuilding}
        graph={graph}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
    </aside>
  );
};

export default NavigationPanel;
