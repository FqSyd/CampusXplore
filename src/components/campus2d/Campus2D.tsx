import React, { useMemo } from 'react';
import {
  CampusBuilding,
  NavigationNode,
  NavigationEdge,
  CampusObstacle,
  Position3D,
} from '../../types';
import { MapPaths } from './MapPaths';
import { MapBuildings } from './MapBuildings';
import { MapNodes } from './MapNodes';
import { MapRoute } from './MapRoute';

export interface Campus2DProps {
  buildings: CampusBuilding[];
  nodes: NavigationNode[];
  edges: NavigationEdge[];
  obstacles: CampusObstacle[];
  activeObstacleIds: Set<string>;
  startBuildingId: string | null;
  destBuildingId: string | null;
  startNodeId: string | null;
  destNodeId: string | null;
  routeNodeIds: string[];
  routeCoordinates: Position3D[];
  onSelectBuilding: (building: CampusBuilding) => void;
  isMinimap?: boolean;
}

export const Campus2D: React.FC<Campus2DProps> = ({
  buildings,
  nodes,
  edges,
  obstacles,
  activeObstacleIds,
  startBuildingId,
  destBuildingId,
  startNodeId,
  destNodeId,
  routeNodeIds,
  routeCoordinates,
  onSelectBuilding,
  isMinimap = false,
}) => {
  // Map dimensions
  const mapSize = isMinimap ? 280 : 600;
  const padding = isMinimap ? 15 : 30;
  const usable = mapSize - padding * 2;

  // Coordinate conversion: Campus 3D (X: -75 to 75, Z: -75 to 75) -> 2D SVG
  const toSvgX = (x: number) => padding + ((x + 75) / 150) * usable;
  const toSvgY = (z: number) => padding + ((z + 75) / 150) * usable;

  const nodeMap = useMemo(() => {
    const map = new Map<string, NavigationNode>();
    for (const n of nodes) map.set(n.id, n);
    return map;
  }, [nodes]);

  // Generate SVG polyline points for the active A* route
  const routePointsString = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) return '';
    return routeCoordinates
      .map((pos) => `${toSvgX(pos[0])},${toSvgY(pos[2])}`)
      .join(' ');
  }, [routeCoordinates, padding, usable]);

  return (
    <div
      className={`relative select-none overflow-hidden ${
        isMinimap
          ? 'w-[280px] h-[280px] rounded-xl glass-panel border border-slate-700/80 shadow-2xl'
          : 'w-full h-full flex items-center justify-center p-4 bg-[#090D14]'
      }`}
    >
      <svg
        width={mapSize}
        height={mapSize}
        viewBox={`0 0 ${mapSize} ${mapSize}`}
        className="overflow-visible"
      >
        <defs>
          {/* Diagonal caution stripes pattern for blocked obstacles */}
          <pattern
            id="blocked-stripes"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="4" height="8" fill="#EF4444" opacity="0.8" />
            <rect x="4" width="4" height="8" fill="#1E293B" opacity="0.8" />
          </pattern>

          {/* Glow filter for route line */}
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Background Ground Terrain */}
        <rect
          x="0"
          y="0"
          width={mapSize}
          height={mapSize}
          rx={isMinimap ? 12 : 16}
          fill="#0B131E"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Campus Grid Pattern Lines */}
        {[-50, -25, 0, 25, 50].map((coord) => (
          <g key={`grid-${coord}`} opacity="0.15">
            <line
              x1={toSvgX(-75)}
              y1={toSvgY(coord)}
              x2={toSvgX(75)}
              y2={toSvgY(coord)}
              stroke="#64748B"
              strokeDasharray="2,4"
            />
            <line
              x1={toSvgX(coord)}
              y1={toSvgY(-75)}
              x2={toSvgX(coord)}
              y2={toSvgY(75)}
              stroke="#64748B"
              strokeDasharray="2,4"
            />
          </g>
        ))}

        {/* 2. Walkable Pathways Network (Edges) */}
        <MapPaths
          edges={edges}
          nodeMap={nodeMap}
          toSvgX={toSvgX}
          toSvgY={toSvgY}
          isMinimap={isMinimap}
        />

        {/* 3. Non-Walkable Obstacles & Building Footprints */}
        <MapBuildings
          buildings={buildings}
          obstacles={obstacles}
          activeObstacleIds={activeObstacleIds}
          startBuildingId={startBuildingId}
          destBuildingId={destBuildingId}
          toSvgX={toSvgX}
          toSvgY={toSvgY}
          onSelectBuilding={onSelectBuilding}
          isMinimap={isMinimap}
        />

        {/* 4. Calculated A* Walkable Route */}
        <MapRoute
          routePointsString={routePointsString}
          isMinimap={isMinimap}
        />

        {/* 5. Navigation Nodes / Waypoints & Start/Dest Pins */}
        <MapNodes
          nodes={nodes}
          nodeMap={nodeMap}
          routeNodeIds={routeNodeIds}
          startNodeId={startNodeId}
          destNodeId={destNodeId}
          toSvgX={toSvgX}
          toSvgY={toSvgY}
          isMinimap={isMinimap}
        />

        {/* Compass Rose (North Indicator) */}
        <g transform={`translate(${mapSize - (isMinimap ? 22 : 36)}, ${isMinimap ? 22 : 36})`}>
          <circle r={isMinimap ? 10 : 16} fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <path d="M 0 -8 L 3 3 L 0 1 L -3 3 Z" fill="#EF4444" />
          <text
            y={isMinimap ? 9 : 14}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize={isMinimap ? '7' : '10'}
            fontWeight="bold"
          >
            N
          </text>
        </g>
      </svg>
    </div>
  );
};

export const CampusMap2D = Campus2D;
export default Campus2D;
