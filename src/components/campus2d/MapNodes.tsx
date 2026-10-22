import React from 'react';
import { NavigationNode } from '../../types';

export interface MapNodesProps {
  nodes: NavigationNode[];
  nodeMap: Map<string, NavigationNode>;
  routeNodeIds: string[];
  startNodeId: string | null;
  destNodeId: string | null;
  toSvgX: (x: number) => number;
  toSvgY: (z: number) => number;
  isMinimap?: boolean;
}

export const MapNodes: React.FC<MapNodesProps> = ({
  nodes,
  nodeMap,
  routeNodeIds,
  startNodeId,
  destNodeId,
  toSvgX,
  toSvgY,
  isMinimap = false,
}) => {
  return (
    <g name="map-nodes">
      {/* Waypoint Nodes (visible in full 2D mode) */}
      {!isMinimap &&
        nodes.map((node) => {
          const isRouteNode = routeNodeIds.includes(node.id);
          const cx = toSvgX(node.position[0]);
          const cy = toSvgY(node.position[2]);

          return (
            <circle
              key={`node-2d-${node.id}`}
              cx={cx}
              cy={cy}
              r={isRouteNode ? 3 : 1.5}
              fill={isRouteNode ? '#00F0FF' : '#475569'}
            />
          );
        })}

      {/* Start Pin */}
      {startNodeId && (
        (() => {
          const node = nodeMap.get(startNodeId);
          if (!node) return null;
          const cx = toSvgX(node.position[0]);
          const cy = toSvgY(node.position[2]);
          return (
            <g transform={`translate(${cx}, ${cy})`}>
              <circle r={isMinimap ? 5 : 7} fill="#10B981" />
              <circle r={isMinimap ? 2.5 : 3.5} fill="#FFFFFF" />
              <text
                y={isMinimap ? -7 : -10}
                textAnchor="middle"
                fill="#10B981"
                fontSize={isMinimap ? '8' : '10'}
                fontWeight="bold"
                className="drop-shadow"
              >
                START
              </text>
            </g>
          );
        })()
      )}

      {/* Destination Pin */}
      {destNodeId && (
        (() => {
          const node = nodeMap.get(destNodeId);
          if (!node) return null;
          const cx = toSvgX(node.position[0]);
          const cy = toSvgY(node.position[2]);
          return (
            <g transform={`translate(${cx}, ${cy})`}>
              <circle r={isMinimap ? 5 : 7} fill="#EF4444" />
              <circle r={isMinimap ? 2.5 : 3.5} fill="#FFFFFF" />
              <text
                y={isMinimap ? -7 : -10}
                textAnchor="middle"
                fill="#EF4444"
                fontSize={isMinimap ? '8' : '10'}
                fontWeight="bold"
                className="drop-shadow"
              >
                DEST
              </text>
            </g>
          );
        })()
      )}
    </g>
  );
};

export default MapNodes;
