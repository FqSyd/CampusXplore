import { Position3D, AStarResult, AStarStep } from '../../types';
import { CampusGraph } from '../graph/graph';
import { calculateWalkingTime } from '../../utils/distance';
import { calculateEuclideanHeuristic } from './heuristic';
import { MinHeap, reconstructPath, extractPathCoordinates } from './astarSteps';
import { AStarOptions } from './astarTypes';

/**
 * Executes the A* Pathfinding Algorithm across the Walkable Campus Navigation Graph.
 *
 * Mathematical Formula:
 * f(n) = g(n) + h(n)
 *
 * - g(n): Exact walking cost accumulated from origin to node n
 * - h(n): Admissible 3D Euclidean distance heuristic from node n to destination
 * - f(n): Estimated total cost of path passing through node n
 *
 * Guarantees:
 * - Follows only walkable edges.
 * - Avoids blocked paths, closed promenades, and physical obstacles.
 * - Mathematically optimal (shortest physical walking distance).
 */
export function findPathAStar(
  graph: CampusGraph,
  startNodeId: string,
  targetNodeId: string,
  walkingSpeedMetersPerSec: number = 1.4,
  options?: AStarOptions
): AStarResult {
  // 1. Validation checks
  const startNode = graph.getNode(startNodeId);
  const targetNode = graph.getNode(targetNodeId);

  if (!startNode || !targetNode) {
    return {
      found: false,
      path: [],
      pathCoordinates: [],
      totalDistance: 0,
      estimatedWalkingTimeMinutes: 0,
      nodesExplored: 0,
      explorationOrder: [],
      steps: [],
      gScores: {},
      hScores: {},
      fScores: {},
      errorMessage: !startNode
        ? `Start node '${startNodeId}' does not exist in campus graph.`
        : `Destination node '${targetNodeId}' does not exist in campus graph.`,
    };
  }

  // Same start and destination
  if (startNodeId === targetNodeId) {
    return {
      found: true,
      path: [startNodeId],
      pathCoordinates: [startNode.position],
      totalDistance: 0,
      estimatedWalkingTimeMinutes: 0,
      nodesExplored: 1,
      explorationOrder: [startNodeId],
      steps: [
        {
          nodeId: startNodeId,
          g: 0,
          h: 0,
          f: 0,
        },
      ],
      gScores: { [startNodeId]: 0 },
      hScores: { [startNodeId]: 0 },
      fScores: { [startNodeId]: 0 },
    };
  }

  // Check if start or target is blocked
  if (graph.isNodeBlocked(startNodeId) || graph.isNodeBlocked(targetNodeId)) {
    return {
      found: false,
      path: [],
      pathCoordinates: [],
      totalDistance: 0,
      estimatedWalkingTimeMinutes: 0,
      nodesExplored: 0,
      explorationOrder: [],
      steps: [],
      gScores: {},
      hScores: {},
      fScores: {},
      errorMessage: 'Start or destination location is currently inaccessible due to an obstacle.',
    };
  }

  // 2. Data structures initialization
  const openSet = new MinHeap();
  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();

  const gScores = new Map<string, number>();
  const hScores = new Map<string, number>();
  const fScores = new Map<string, number>();

  const explorationOrder: string[] = [];
  const steps: AStarStep[] = [];

  const initialH = calculateEuclideanHeuristic(
    startNode.position,
    targetNode.position,
    graph.getScaleFactor()
  );

  gScores.set(startNodeId, 0);
  hScores.set(startNodeId, initialH);
  fScores.set(startNodeId, initialH);

  openSet.push({ id: startNodeId, f: initialH });

  let found = false;

  // 3. Search Loop
  while (!openSet.isEmpty()) {
    const current = openSet.pop()!;
    const currentId = current.id;

    if (currentId === targetNodeId) {
      found = true;
      explorationOrder.push(currentId);
      steps.push({
        nodeId: currentId,
        g: gScores.get(currentId) || 0,
        h: 0,
        f: fScores.get(currentId) || 0,
        parent: cameFrom.get(currentId),
      });
      break;
    }

    if (closedSet.has(currentId)) {
      continue;
    }

    closedSet.add(currentId);
    explorationOrder.push(currentId);
    steps.push({
      nodeId: currentId,
      g: gScores.get(currentId) || 0,
      h: hScores.get(currentId) || 0,
      f: current.f,
      parent: cameFrom.get(currentId),
    });

    const currentG = gScores.get(currentId)!;
    // Graph automatically filters out blocked edges & nodes
    const neighbors = graph.getNeighbors(currentId);

    for (const neighbor of neighbors) {
      const neighborId = neighbor.nodeId;

      if (closedSet.has(neighborId)) {
        continue;
      }

      const tentativeG = currentG + neighbor.distance;
      const existingG = gScores.has(neighborId) ? gScores.get(neighborId)! : Infinity;

      if (tentativeG < existingG) {
        cameFrom.set(neighborId, currentId);
        gScores.set(neighborId, tentativeG);

        const neighborNode = graph.getNode(neighborId);
        const h = neighborNode
          ? calculateEuclideanHeuristic(neighborNode.position, targetNode.position, graph.getScaleFactor())
          : 0;

        hScores.set(neighborId, h);

        const f = tentativeG + h;
        fScores.set(neighborId, f);

        openSet.push({ id: neighborId, f });
      }
    }
  }

  // 4. Path reconstruction or failure handling
  if (!found) {
    return {
      found: false,
      path: [],
      pathCoordinates: [],
      totalDistance: 0,
      estimatedWalkingTimeMinutes: 0,
      nodesExplored: closedSet.size,
      explorationOrder,
      steps,
      gScores: Object.fromEntries(gScores),
      hScores: Object.fromEntries(hScores),
      fScores: Object.fromEntries(fScores),
      errorMessage: `No walkable route exists between '${startNode.name}' and '${targetNode.name}'. Connecting paths may be blocked by obstacles.`,
    };
  }

  const path = reconstructPath(cameFrom, targetNodeId);
  const pathCoordinates = extractPathCoordinates(graph, path);

  const totalDistance = gScores.get(targetNodeId) || 0;
  const timeCalc = calculateWalkingTime(totalDistance, walkingSpeedMetersPerSec);

  return {
    found: true,
    path,
    pathCoordinates,
    totalDistance: Math.round(totalDistance),
    estimatedWalkingTimeMinutes: timeCalc.minutes,
    nodesExplored: closedSet.size,
    explorationOrder,
    steps,
    gScores: Object.fromEntries(gScores),
    hScores: Object.fromEntries(hScores),
    fScores: Object.fromEntries(fScores),
    avoidedObstaclesCount: graph.getBlockedEdgesCount(),
  };
}
