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
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
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
  selectedNodeId = null,
  onSelectNode,
}) => {
  return (
    <g name="map-nodes">
      {/* Waypoint Nodes (visible in full 2D mode) */}
      {!isMinimap &&
        nodes.map((node) => {
          const isRouteNode = routeNodeIds.includes(node.id);
          const isSelected = isRouteNode && node.id === selectedNodeId;
          const cx = toSvgX(node.position[0]);
          const cy = toSvgY(node.position[2]);

          return (
            <g key={`node-2d-${node.id}`}>
              {isSelected && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill="#F59E0B"
                  fillOpacity={0.3}
                  stroke="#FBBF24"
                  strokeWidth={2}
                  className="animate-ping"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 5 : isRouteNode ? 3.5 : 1.5}
                fill={isSelected ? '#FBBF24' : isRouteNode ? '#00F0FF' : '#475569'}
                stroke={isRouteNode ? '#FFFFFF' : 'none'}
                strokeWidth={isRouteNode ? 1 : 0}
                className={isRouteNode ? 'cursor-pointer hover:opacity-80 transition' : ''}
                onClick={() => {
                  if (isRouteNode && onSelectNode) {
                    onSelectNode(node.id);
                  }
                }}
              >
                {isRouteNode && <title>{`${node.name} (Click for A* scores)`}</title>}
              </circle>
            </g>
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
