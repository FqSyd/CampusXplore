import { NavigationNode, NavigationEdge, CampusBuilding, Position3D } from '../../types';

export interface GraphNeighbor {
  nodeId: string;
  distance: number;
  type?: string;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  blockedEdgesCount: number;
  blockedNodesCount: number;
}
