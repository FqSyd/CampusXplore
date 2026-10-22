import React from 'react';
import { NavigationEdge, NavigationNode } from '../../types';

export interface MapPathsProps {
  edges: NavigationEdge[];
  nodeMap: Map<string, NavigationNode>;
  toSvgX: (x: number) => number;
  toSvgY: (z: number) => number;
  isMinimap?: boolean;
}

export const MapPaths: React.FC<MapPathsProps> = ({
  edges,
  nodeMap,
  toSvgX,
  toSvgY,
  isMinimap = false,
}) => {
  return (
    <g name="walkable-paths">
      {edges.map((edge, idx) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;

        const x1 = toSvgX(from.position[0]);
        const y1 = toSvgY(from.position[2]);
        const x2 = toSvgX(to.position[0]);
        const y2 = toSvgY(to.position[2]);

        const isRoad = edge.type === 'road';

        return (
          <line
            key={`edge-${edge.from}-${edge.to}-${idx}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isRoad ? '#334155' : '#1E293B'}
            strokeWidth={isRoad ? (isMinimap ? 3 : 5) : (isMinimap ? 2 : 3)}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

export default MapPaths;
