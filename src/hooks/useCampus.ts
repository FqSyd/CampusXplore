import { useMemo, useState, useCallback } from 'react';
import { CAMPUS_BUILDINGS, CAMPUS_NODES, CAMPUS_EDGES, CAMPUS_OBSTACLES, CAMPUS_CONFIG } from '../data/campus';
import { CampusGraph } from '../algorithms/graph';

export function useCampus() {
  const buildings = useMemo(() => CAMPUS_BUILDINGS, []);
  const nodes = useMemo(() => CAMPUS_NODES, []);
  const edges = useMemo(() => CAMPUS_EDGES, []);
  const obstacles = useMemo(() => CAMPUS_OBSTACLES, []);
  const config = useMemo(() => CAMPUS_CONFIG, []);

  const graph = useMemo(
    () => new CampusGraph(nodes, edges, buildings, config.scaleFactor),
    [nodes, edges, buildings, config.scaleFactor]
  );

  // Active obstacles tracking (all permanent obstacles + toggleable dynamic)
  const [activeObstacleIds, setActiveObstacleIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    for (const obs of obstacles) {
      if (!obs.isDynamic || obs.isActive) {
        set.add(obs.id);
      }
    }
    return set;
  });

  const toggleObstacle = useCallback(
    (obstacleId: string) => {
      setActiveObstacleIds((prev) => {
        const next = new Set(prev);
        const willBeActive = !next.has(obstacleId);

        if (willBeActive) {
          next.add(obstacleId);
        } else {
          next.delete(obstacleId);
        }

        // Apply edge blockages to graph
        if (obstacleId === 'dyn_admin_east_closure') {
          graph.setEdgeBlocked('node_admin_se_turn', 'node_admin_east_mid', willBeActive);
          graph.setEdgeBlocked('node_admin_east_mid', 'node_admin_ne_corner', willBeActive);
        } else if (obstacleId === 'dyn_canteen_plaza_closure') {
          graph.setEdgeBlocked('node_canteen_south', 'node_canteen_se_corner', willBeActive);
          graph.setEdgeBlocked('node_canteen_se_corner', 'node_canteen_east_walk', willBeActive);
        }

        return next;
      });
    },
    [graph]
  );

  return {
    buildings,
    nodes,
    edges,
    obstacles,
    config,
    graph,
    activeObstacleIds,
    toggleObstacle,
  };
}
