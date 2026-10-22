import { AStarResult, NavigationNode } from '../types';
import { CampusGraph } from '../algorithms/graph';

export interface FormattedWaypoint {
  index: number;
  nodeId: string;
  name: string;
  isStart: boolean;
  isDestination: boolean;
  isBuildingEntrance: boolean;
  buildingId?: string;
  type?: string;
}

/**
 * Transforms an A* result into an enriched list of waypoints with readable names and metadata.
 */
export function formatRouteWaypoints(
  result: AStarResult | null,
  graph: CampusGraph
): FormattedWaypoint[] {
  if (!result || !result.found || result.path.length === 0) return [];

  return result.path.map((nodeId, idx) => {
    const node = graph.getNode(nodeId);
    return {
      index: idx + 1,
      nodeId,
      name: node?.name || nodeId,
      isStart: idx === 0,
      isDestination: idx === result.path.length - 1,
      isBuildingEntrance: !!node?.isBuildingEntrance,
      buildingId: node?.buildingId,
      type: node?.type,
    };
  });
}
