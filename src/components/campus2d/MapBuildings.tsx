import React from 'react';
import { CampusBuilding, CampusObstacle } from '../../types';

export interface MapBuildingsProps {
  buildings: CampusBuilding[];
  obstacles: CampusObstacle[];
  activeObstacleIds: Set<string>;
  startBuildingId: string | null;
  destBuildingId: string | null;
  toSvgX: (x: number) => number;
  toSvgY: (z: number) => number;
  onSelectBuilding: (building: CampusBuilding) => void;
  isMinimap?: boolean;
}

export const MapBuildings: React.FC<MapBuildingsProps> = ({
  buildings,
  obstacles,
  activeObstacleIds,
  startBuildingId,
  destBuildingId,
  toSvgX,
  toSvgY,
  onSelectBuilding,
  isMinimap = false,
}) => {
  return (
    <g name="obstacles-and-buildings">
      {/* 1. Obstacles (fountains, sports field, and active barricades) */}
      {obstacles.map((obs) => {
        const x = toSvgX(obs.bounds.minX);
        const y = toSvgY(obs.bounds.minZ);
        const w = toSvgX(obs.bounds.maxX) - x;
        const h = toSvgY(obs.bounds.maxZ) - y;

        const isBlocked = activeObstacleIds.has(obs.id);
        const isFountain = obs.id === 'obs_quad_fountain';
        const isSports = obs.id === 'obs_sports_ground';

        return (
          <g key={`obs-${obs.id}`}>
            <rect
              x={x}
              y={y}
              width={Math.max(2, w)}
              height={Math.max(2, h)}
              rx={isFountain ? Math.max(1, w / 2) : 2}
              fill={
                isBlocked
                  ? 'url(#blocked-stripes)'
                  : isFountain
                  ? '#0284C7'
                  : isSports
                  ? '#166534'
                  : '#1E293B'
              }
              stroke={isBlocked ? '#EF4444' : '#334155'}
              strokeWidth={isBlocked ? 2 : 1}
              opacity={isFountain ? 0.8 : 0.9}
            />
          </g>
        );
      })}

      {/* 2. Building Footprints */}
      {buildings.map((b) => {
        const isStart = startBuildingId === b.id;
        const isDest = destBuildingId === b.id;

        const hw = b.size[0] / 2;
        const hd = b.size[2] / 2;
        const x = toSvgX(b.position[0] - hw);
        const y = toSvgY(b.position[2] - hd);
        const w = toSvgX(b.position[0] + hw) - x;
        const h = toSvgY(b.position[2] + hd) - y;

        if (b.id === 'central_quad' || b.id === 'sports_ground') return null;

        return (
          <g
            key={`bldg-2d-${b.id}`}
            onClick={() => onSelectBuilding(b)}
            className="cursor-pointer transition-transform hover:opacity-100"
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={2.5}
              fill={isStart ? '#059669' : isDest ? '#DC2626' : b.color}
              stroke={isStart ? '#10B981' : isDest ? '#EF4444' : b.accentColor}
              strokeWidth={isStart || isDest ? 2 : 1}
              opacity={0.9}
            />
            {!isMinimap && (
              <text
                x={x + w / 2}
                y={y + h / 2 + 3}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="9"
                fontWeight="600"
                pointerEvents="none"
                className="drop-shadow"
              >
                {b.shortName}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default MapBuildings;
