import { CampusGraph } from '../algorithms/graph';
import { findPathAStar } from '../algorithms/astar';
import { AStarResult } from '../types';

/**
 * High-level navigation service wrapper for calculating optimal walkable paths
 */
export class NavigationService {
  /**
   * Computes route using A* algorithm with safety obstacle awareness
   */
  static computeRoute(
    graph: CampusGraph,
    startNodeId: string,
    destNodeId: string,
    speedMetersPerSec: number = 1.4
  ): AStarResult {
    return findPathAStar(graph, startNodeId, destNodeId, speedMetersPerSec);
  }

  /**
   * Applies temporary campus pathway closure updates to the graph
   */
  static applyObstacleState(
    graph: CampusGraph,
    obstacleId: string,
    isBlocked: boolean
  ): void {
    if (obstacleId === 'dyn_admin_east_closure') {
      graph.setEdgeBlocked('node_admin_se_turn', 'node_admin_east_mid', isBlocked);
      graph.setEdgeBlocked('node_admin_east_mid', 'node_admin_ne_corner', isBlocked);
    } else if (obstacleId === 'dyn_canteen_plaza_closure') {
      graph.setEdgeBlocked('node_canteen_south', 'node_canteen_se_corner', isBlocked);
      graph.setEdgeBlocked('node_canteen_se_corner', 'node_canteen_east_walk', isBlocked);
    }
  }
}

export default NavigationService;
