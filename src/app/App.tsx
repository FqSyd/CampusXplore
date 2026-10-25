import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  buildings,
  nodes,
  edges,
  obstacles,
  campusConfig,
} from '../data';
import { CampusGraph, findPathAStar } from '../algorithms';
import {
  CampusBuilding,
  NavigationStatus,
  Position3D,
  CameraViewMode,
  DemoRoute,
  AStarResult,
  WalkerProgress,
} from '../types';
import { Campus3D } from '../components/campus';
import { Campus2D } from '../components/map';
import { Header } from '../components/layout';
import { NavigationPanel } from '../components/navigation';
import { CameraControls } from '../components/ui';
import { AlgorithmCode, NodeAnalysisCard } from '../components/algorithm';

export const App: React.FC = () => {
  // 1. Initialize Navigation Graph from decoupled campus data
  const graph = useMemo(
    () => new CampusGraph(nodes, edges, buildings, campusConfig.scaleFactor),
    []
  );

  // 2. Application State
  const [startBuildingId, setStartBuildingId] = useState<string>('main_gate');
  const [destBuildingId, setDestBuildingId] = useState<string>('library');
  const [status, setStatus] = useState<NavigationStatus>('ready');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [result, setResult] = useState<AStarResult | null>(null);

  // Active obstacle tracking (static + toggleable dynamic)
  const [activeObstacleIds, setActiveObstacleIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    for (const obs of obstacles) {
      if (!obs.isDynamic || obs.isActive) {
        set.add(obs.id);
      }
    }
    return set;
  });

  // Visualization mode toggles (3D vs 2D full switch, NO floating overlay)
  const [viewType, setViewType] = useState<'3d' | '2d'>('3d');
  const [showRoute, setShowRoute] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<CameraViewMode>('default');
  const [focusTarget, setFocusTarget] = useState<Position3D | null>(null);

  // Search animation state
  const [animateSearch, setAnimateSearch] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Walker state
  const [walkerProgress, setWalkerProgress] = useState<WalkerProgress | null>(null);
  const [walkerPosition, setWalkerPosition] = useState<Position3D | null>(null);
  const [rerouteNotice, setRerouteNotice] = useState<string>('');

  // A* Node-level analysis state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAnalysisCardOpen, setIsAnalysisCardOpen] = useState<boolean>(true);

  // Modals and scenario active tracking
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState<boolean>(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | undefined>('s1');

  // Derived building objects
  const startBuilding = useMemo(
    () => buildings.find((b: CampusBuilding) => b.id === startBuildingId) || null,
    [startBuildingId]
  );
  const destBuilding = useMemo(
    () => buildings.find((b: CampusBuilding) => b.id === destBuildingId) || null,
    [destBuildingId]
  );

  // Derived entrance nodes
  const startNode = useMemo(() => {
    if (!startBuilding) return null;
    const nodeId = graph.getNodeForBuilding(startBuilding.id);
    return nodeId ? graph.getNode(nodeId) || null : null;
  }, [startBuilding, graph]);

  const destNode = useMemo(() => {
    if (!destBuilding) return null;
    const nodeId = graph.getNodeForBuilding(destBuilding.id);
    return nodeId ? graph.getNode(nodeId) || null : null;
  }, [destBuilding, graph]);

  // Derived selected waypoint analysis data
  const selectedNodeAnalysis = useMemo(() => {
    if (!result?.routeNodesAnalysis || result.routeNodesAnalysis.length === 0) return null;
    if (selectedNodeId) {
      const match = result.routeNodesAnalysis.find((n) => n.nodeId === selectedNodeId);
      if (match) return match;
    }
    return result.routeNodesAnalysis[0] || null;
  }, [result, selectedNodeId]);

  // Clean up any search animation timer on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  // Handler: Run A* Pathfinding
  const handleFindRoute = useCallback(() => {
    // Edge case: Same start and destination
    if (startBuildingId === destBuildingId) {
      setStatus('same_location');
      setResult(null);
      setShowRoute(false);
      setWalkerProgress(null);
      setRerouteNotice('');
      return;
    }

    if (!startNode || !destNode) {
      setStatus('not_found');
      setErrorMessage('Selected locations do not have valid entrance waypoints.');
      setResult(null);
      setShowRoute(false);
      setWalkerProgress(null);
      return;
    }

    // Notice for campus pathway updates
    if (activeObstacleIds.size > 0) {
      setRerouteNotice('Pathway unavailable. A* recalculated an alternative walking route.');
    } else {
      setRerouteNotice('');
    }

    // Execute A*
    const aStarResult = findPathAStar(
      graph,
      startNode.id,
      destNode.id,
      campusConfig.walkingSpeedMetersPerSec
    );

    if (!aStarResult.found) {
      setStatus('not_found');
      setErrorMessage(
        aStarResult.errorMessage ||
          'No walkable route could be found. All connecting paths may be blocked by temporary closures.'
      );
      setResult(aStarResult);
      setShowRoute(false);
      setWalkerProgress(null);
      return;
    }

    // Reset walker progress on fresh calculation
    setWalkerProgress(null);

    // Store result immediately so explorationSteps and routeNodes are available
    setResult(aStarResult);
    setIsAnalysisCardOpen(true);
    if (aStarResult.path && aStarResult.path.length > 0) {
      setSelectedNodeId(aStarResult.path[0]);
    }

    // Route found successfully
    if (animateSearch && aStarResult.steps.length > 1) {
      setIsSearching(true);
      setStatus('searching');
      setShowRoute(false);
      setCurrentStepIndex(0);

      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }

      let step = 0;
      const totalSteps = aStarResult.steps.length;
      const intervalMs = Math.max(25, Math.min(100, Math.floor(1200 / totalSteps)));

      animationTimerRef.current = setInterval(() => {
        step++;
        setCurrentStepIndex(step);

        if (step >= totalSteps - 1) {
          if (animationTimerRef.current) {
            clearInterval(animationTimerRef.current);
          }
          setIsSearching(false);
          setStatus('found');
          setShowRoute(true);
          if (aStarResult.path && aStarResult.path.length > 0) {
            setSelectedNodeId(aStarResult.path[0]);
          }
        }
      }, intervalMs);
    } else {
      // Immediate execution
      setStatus('found');
      setShowRoute(true);
      setCurrentStepIndex(aStarResult.steps.length - 1);
    }
  }, [startBuildingId, destBuildingId, startNode, destNode, graph, animateSearch, activeObstacleIds]);

  // Handler: Dynamic Obstacle Toggle (Maintenance / Blocked paths)
  const handleToggleObstacle = useCallback(
    (obstacleId: string) => {
      const willBeActive = !activeObstacleIds.has(obstacleId);

      setActiveObstacleIds((prev) => {
        const next = new Set(prev);
        if (willBeActive) {
          next.add(obstacleId);
        } else {
          next.delete(obstacleId);
        }
        return next;
      });

      // Apply physical edge blockages in graph
      if (obstacleId === 'dyn_admin_east_closure') {
        graph.setEdgeBlocked('node_admin_se_turn', 'node_admin_east_mid', willBeActive);
        graph.setEdgeBlocked('node_admin_east_mid', 'node_admin_ne_corner', willBeActive);
      } else if (obstacleId === 'dyn_canteen_plaza_closure') {
        graph.setEdgeBlocked('node_canteen_south', 'node_canteen_se_corner', willBeActive);
        graph.setEdgeBlocked('node_canteen_se_corner', 'node_canteen_east_walk', willBeActive);
      }

      // If a route was already displayed, recompute path dynamically around the new obstacle!
      if (showRoute) {
        if (willBeActive) {
          setRerouteNotice('Pathway unavailable. A* recalculated an alternative walking route.');
        } else {
          setRerouteNotice(activeObstacleIds.size > 1 ? 'Pathway unavailable. A* recalculated an alternative walking route.' : '');
        }
        setTimeout(() => {
          handleFindRoute();
        }, 50);
      }
    },
    [activeObstacleIds, graph, showRoute, handleFindRoute]
  );

  // Handler: Reset Route and state
  const handleResetRoute = useCallback(() => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    setIsSearching(false);
    setShowRoute(false);
    setResult(null);
    setStatus('ready');
    setErrorMessage('');
    setCurrentStepIndex(0);
    setActiveScenarioId(undefined);
    setWalkerProgress(null);
    setWalkerPosition(null);
    setRerouteNotice('');
    setSelectedNodeId(null);
    setIsAnalysisCardOpen(false);
  }, []);

  // Handler: Select specific waypoint node on route
  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsAnalysisCardOpen(true);
  }, []);

  // Handler: Select waypoint by index on route
  const handleSelectWaypointIndex = useCallback(
    (index: number) => {
      if (result?.routeNodesAnalysis && result.routeNodesAnalysis[index]) {
        setSelectedNodeId(result.routeNodesAnalysis[index].nodeId);
        setIsAnalysisCardOpen(true);
      }
    },
    [result]
  );

  // Handler: Walker arrival
  const handleWalkerArrived = useCallback(() => {
    setStatus('found');
  }, []);

  // Handler: Reset Camera
  const handleResetCamera = useCallback(() => {
    setViewMode('default');
    setFocusTarget(null);
  }, []);

  // Handler: Swap Start and Destination
  const handleSwapLocations = useCallback(() => {
    setStartBuildingId(destBuildingId);
    setDestBuildingId(startBuildingId);
    handleResetRoute();
  }, [startBuildingId, destBuildingId, handleResetRoute]);

  // Handler: Preset Demo Scenarios
  const handleSelectScenario = useCallback(
    (scenario: DemoRoute) => {
      handleResetRoute();
      setStartBuildingId(scenario.fromId);
      setDestBuildingId(scenario.toId);
      setActiveScenarioId(scenario.id);
      setStatus('ready');
    },
    [handleResetRoute]
  );

  // Handler: Interactive 2D or 3D building click selection
  const handleSelectBuilding = useCallback(
    (building: CampusBuilding) => {
      if (building.id === startBuildingId) {
        return;
      }
      if (building.id === destBuildingId) {
        return;
      }
      setDestBuildingId(building.id);
      handleResetRoute();
    },
    [startBuildingId, destBuildingId, handleResetRoute]
  );

  // Handler: Camera focus targets
  const handleFocusStart = useCallback(() => {
    if (startBuilding) {
      setFocusTarget(startBuilding.position);
      setViewMode('focus');
    }
  }, [startBuilding]);

  const handleFocusDest = useCallback(() => {
    if (destBuilding) {
      setFocusTarget(destBuilding.position);
      setViewMode('focus');
    }
  }, [destBuilding]);

  const hasActiveRoute = showRoute && (result?.pathCoordinates?.length || 0) >= 2;

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0F17] select-none text-slate-100 overflow-hidden">
      {/* Top Header */}
      <Header
        onOpenAlgorithmModal={() => setIsAlgorithmModalOpen(true)}
        campusName={campusConfig.campusName}
      />

      {/* Main Workspace: Navigation Panel + Interactive Simulation (3D OR 2D) */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Left Navigation, Obstacles & Wayfinding Sidebar */}
        <NavigationPanel
          buildings={buildings}
          startBuildingId={startBuildingId}
          destBuildingId={destBuildingId}
          onStartChange={(id) => {
            setStartBuildingId(id);
            handleResetRoute();
          }}
          onDestChange={(id) => {
            setDestBuildingId(id);
            handleResetRoute();
          }}
          onSwapLocations={handleSwapLocations}
          onFindRoute={handleFindRoute}
          onResetRoute={handleResetRoute}
          isSearching={isSearching}
          animateSearch={animateSearch}
          onToggleAnimateSearch={() => setAnimateSearch(!animateSearch)}
          status={status}
          errorMessage={errorMessage}
          result={result}
          graph={graph}
          onSelectScenario={handleSelectScenario}
          activeScenarioId={activeScenarioId}
          obstacles={obstacles}
          activeObstacleIds={activeObstacleIds}
          onToggleObstacle={handleToggleObstacle}
          walkerProgress={walkerProgress}
          rerouteNotice={rerouteNotice}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
        />

        {/* Center / Right Visualization Canvas (3D Campus OR 2D Topographic Map - Never overlapping!) */}
        <main className="flex-1 relative h-full">
          {viewType === '3d' ? (
            /* Full 3D Campus Simulation with 3D Walking Character */
            <Campus3D
              buildings={buildings}
              graph={graph}
              obstacles={obstacles}
              activeObstacleIds={activeObstacleIds}
              startBuilding={startBuilding}
              destBuilding={destBuilding}
              startNode={startNode}
              destNode={destNode}
              routeCoordinates={result?.pathCoordinates || []}
              showRoute={showRoute}
              showLabels={showLabels}
              viewMode={viewMode}
              focusTarget={focusTarget}
              explorationSteps={result?.steps || []}
              currentStepIndex={currentStepIndex}
              isSearching={isSearching}
              showSearchAnimation={animateSearch && isSearching}
              onSelectBuilding={handleSelectBuilding}
              onWalkerProgress={setWalkerProgress}
              onWalkerPositionChange={setWalkerPosition}
              onWalkerArrived={handleWalkerArrived}
              routeNodesAnalysis={result?.routeNodesAnalysis || []}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
            />
          ) : (
            /* Full 2D Topographic Campus Map (Replaces main area cleanly, no floating overlay) */
            <Campus2D
              buildings={buildings}
              nodes={nodes}
              edges={edges}
              obstacles={obstacles}
              activeObstacleIds={activeObstacleIds}
              startBuildingId={startBuildingId}
              destBuildingId={destBuildingId}
              startNodeId={startNode?.id || null}
              destNodeId={destNode?.id || null}
              routeNodeIds={result?.path || []}
              routeCoordinates={result?.pathCoordinates || []}
              onSelectBuilding={handleSelectBuilding}
              isMinimap={false}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
            />
          )}

          {/* Floating A* Node-Level Calculation Analysis Card (HUD) */}
          {(showRoute || isSearching) && isAnalysisCardOpen && (
            <NodeAnalysisCard
              selectedNode={selectedNodeAnalysis}
              currentStep={isSearching && result?.steps ? result.steps[currentStepIndex] : null}
              isSearching={isSearching}
              onSelectWaypointIndex={handleSelectWaypointIndex}
              onClose={() => setIsAnalysisCardOpen(false)}
            />
          )}

          {/* Quick Re-open Node Analysis Button if minimized */}
          {showRoute && !isAnalysisCardOpen && (
            <button
              onClick={() => setIsAnalysisCardOpen(true)}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 shadow-lg text-xs font-semibold backdrop-blur-md transition"
              title="Open A* Node Analysis panel"
            >
              <span>A* Node Analysis</span>
            </button>
          )}

          {/* Floating Camera & View Controls */}
          <CameraControls
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            onResetCamera={handleResetCamera}
            onFocusStart={handleFocusStart}
            onFocusDest={handleFocusDest}
            hasStart={!!startBuilding}
            hasDest={!!destBuilding}
            viewType={viewType}
            onToggleViewType={() => setViewType(viewType === '3d' ? '2d' : '3d')}
            hasActiveRoute={hasActiveRoute}
          />
        </main>
      </div>

      {/* A* Algorithm Explanation Modal */}
      <AlgorithmCode
        isOpen={isAlgorithmModalOpen}
        onClose={() => setIsAlgorithmModalOpen(false)}
      />
    </div>
  );
};

export default App;
