import React, { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  CampusBuilding,
  NavigationNode,
  Position3D,
  AStarStep,
  CampusObstacle,
  CameraViewMode,
  WalkerProgress,
} from '../../types';
import { CampusGraph } from '../../algorithms/graph';
import { Pathways } from './Pathways';
import { CampusEnvironment } from './CampusEnvironment';
import { Buildings } from './Building';
import { Obstacles } from './Obstacles';
import { StartMarker, DestinationMarker } from './NavigationMarker';
import { NavigationRoute } from './NavigationRoute';
import { CampusLabels } from './CampusLabels';
import { CameraController } from './CameraController';
import { WalkingCharacter } from './WalkingCharacter';
import { StaticCharacters } from './StaticCharacters';
import { AlgorithmVisualizer } from '../algorithm/AlgorithmVisualizer';

export interface Campus3DProps {
  buildings: CampusBuilding[];
  graph: CampusGraph;
  obstacles: CampusObstacle[];
  activeObstacleIds: Set<string>;
  startBuilding: CampusBuilding | null;
  destBuilding: CampusBuilding | null;
  startNode: NavigationNode | null;
  destNode: NavigationNode | null;
  routeCoordinates: Position3D[];
  showRoute: boolean;
  showLabels: boolean;
  viewMode: CameraViewMode;
  focusTarget: Position3D | null;
  explorationSteps: AStarStep[];
  currentStepIndex: number;
  isSearching: boolean;
  showSearchAnimation: boolean;
  onSelectBuilding: (building: CampusBuilding) => void;
  onWalkerProgress?: (progress: WalkerProgress) => void;
  onWalkerArrived?: () => void;
  onWalkerPositionChange?: (pos: Position3D) => void;
}

export const Campus3D: React.FC<Campus3DProps> = ({
  buildings,
  graph,
  obstacles,
  activeObstacleIds,
  startBuilding,
  destBuilding,
  startNode,
  destNode,
  routeCoordinates,
  showRoute,
  showLabels,
  viewMode,
  focusTarget,
  explorationSteps,
  currentStepIndex,
  isSearching,
  showSearchAnimation,
  onSelectBuilding,
  onWalkerProgress,
  onWalkerArrived,
  onWalkerPositionChange,
}) => {
  const walkerPosRef = useRef<Position3D | null>(null);

  const handleWalkerPosChange = useCallback((pos: Position3D) => {
    walkerPosRef.current = pos;
    if (onWalkerPositionChange) {
      onWalkerPositionChange(pos);
    }
  }, [onWalkerPositionChange]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-[#0B0F17]">
      <Canvas
        shadows
        camera={{ position: [0, 95, 115], fov: 45, near: 1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0B0F17']} />
        {/* Atmospheric Distance Fog */}
        <fog attach="fog" args={['#0B0F17', 120, 240]} />

        <Suspense fallback={null}>
          {/* Camera Controller with Follow Walker support via stable ref */}
          <CameraController
            viewMode={viewMode}
            focusTarget={focusTarget}
            walkerPositionRef={walkerPosRef}
          />

          {/* Campus Environment (Sky, Sunlight, Shadows, Trees, Street Lamps) */}
          <CampusEnvironment />

          {/* Ground, Roads, Walkways, Parking Bays, Perimeter Walls */}
          <Pathways />

          {/* Static Background Student Figures for realism */}
          <StaticCharacters />

          {/* 3D Campus Buildings */}
          <Buildings
            buildings={buildings}
            selectedStartBuildingId={startBuilding?.id || null}
            selectedDestBuildingId={destBuilding?.id || null}
            onSelectBuilding={onSelectBuilding}
          />

          {/* Active Obstacles & Construction Barricades in 3D (Subtle & clean) */}
          <Obstacles
            obstacles={obstacles}
            activeObstacleIds={activeObstacleIds}
            showLabels={false}
          />

          {/* A* Search Exploration Visualizer */}
          <AlgorithmVisualizer
            graph={graph}
            explorationSteps={explorationSteps}
            currentStepIndex={currentStepIndex}
            isSearching={isSearching}
            showSearchAnimation={showSearchAnimation}
          />

          {/* Start Marker (Green beacon + START badge) */}
          {startNode && (
            <StartMarker
              position={startNode.position}
              label={startBuilding ? `START: ${startBuilding.shortName}` : 'START'}
            />
          )}

          {/* Destination Marker (Red beacon + DESTINATION badge) */}
          {destNode && (
            <DestinationMarker
              position={destNode.position}
              label={destBuilding ? `DEST: ${destBuilding.shortName}` : 'DESTINATION'}
            />
          )}

          {/* Calculated 3D Glowing Route Line */}
          <NavigationRoute
            coordinates={routeCoordinates}
            visible={showRoute && routeCoordinates.length >= 2}
          />

          {/* 3D Walking Character following actual A* Path */}
          <WalkingCharacter
            routeCoordinates={routeCoordinates}
            isActive={showRoute && routeCoordinates.length >= 2 && !isSearching}
            onProgress={onWalkerProgress}
            onPositionChange={handleWalkerPosChange}
            onArrived={onWalkerArrived}
          />

          {/* Campus Floating Building Labels */}
          <CampusLabels
            buildings={buildings}
            showLabels={showLabels}
            selectedStartBuildingId={startBuilding?.id || null}
            selectedDestBuildingId={destBuilding?.id || null}
            onSelectBuilding={onSelectBuilding}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export const CampusScene = Campus3D;
export default Campus3D;
