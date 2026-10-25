import { Position3D, AStarResult, AStarStep, RouteNodeAnalysis, CandidateNode } from '../../types';
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
 * - g(n): Exact walking cost accumulated from origin to node n along the path recorded by A*
 * - h(n): Admissible 3D Euclidean distance heuristic from node n to destination
 * - f(n): Estimated total cost of path passing through node n
 *
 * Guarantees:
 * - Follows only walkable edges.
 * - Avoids blocked paths, closed promenades, and physical obstacles.
 * - Mathematically optimal (shortest physical walking distance in meters).
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
      routeNodesAnalysis: [],
      errorMessage: !startNode
        ? `Start node '${startNodeId}' does not exist in campus graph.`
        : `Destination node '${targetNodeId}' does not exist in campus graph.`,
    };
  }

  // Same start and destination
  if (startNodeId === targetNodeId) {
    const analysis: RouteNodeAnalysis = {
      nodeId: startNodeId,
      nodeName: startNode.name,
      position: startNode.position,
      g: 0,
      h: 0,
      f: 0,
      isStart: true,
      isDestination: true,
      waypointIndex: 1,
      totalWaypoints: 1,
      expansionOrder: 1,
      explanation: `Origin and destination are the same location (${startNode.name}). Accumulated cost g(n) is 0 m and estimated remaining cost h(n) is 0 m.`,
    };

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
          stepNumber: 1,
          nodeId: startNodeId,
          nodeName: startNode.name,
          position: startNode.position,
          g: 0,
          h: 0,
          f: 0,
          selectionReason: 'Start node is already at destination.',
        },
      ],
      gScores: { [startNodeId]: 0 },
      hScores: { [startNodeId]: 0 },
      fScores: { [startNodeId]: 0 },
      routeNodesAnalysis: [analysis],
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
      routeNodesAnalysis: [],
      errorMessage: 'Start or destination location is currently inaccessible due to a temporary pathway closure.',
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
    // Snapshot of candidate nodes in Open Set before pop
    const openSetSnapshot = openSet.getAll();
    const current = openSet.pop()!;
    const currentId = current.id;
    const currentNode = graph.getNode(currentId);
    const parentId = cameFrom.get(currentId);
    const parentNode = parentId ? graph.getNode(parentId) : undefined;

    const currentG = gScores.get(currentId) || 0;
    const currentH = hScores.get(currentId) || 0;

    // Build candidate list for visualization
    const openSetCandidates: CandidateNode[] = openSetSnapshot.map((c) => {
      const cNode = graph.getNode(c.id);
      return {
        nodeId: c.id,
        nodeName: cNode?.name || c.id,
        g: Math.round(gScores.get(c.id) || 0),
        h: Math.round(hScores.get(c.id) || 0),
        f: Math.round(c.f),
      };
    });

    if (currentId === targetNodeId) {
      found = true;
      explorationOrder.push(currentId);
      steps.push({
        stepNumber: steps.length + 1,
        nodeId: currentId,
        nodeName: currentNode?.name || currentId,
        position: currentNode?.position || [0, 0, 0],
        g: Math.round(currentG),
        h: 0,
        f: Math.round(currentG),
        parent: parentId,
        parentName: parentNode?.name,
        openSetCandidates,
        selectionReason: `Target destination reached! Selected with minimum f(n) = ${Math.round(currentG)} m.`,
      });
      break;
    }

    if (closedSet.has(currentId)) {
      continue;
    }

    closedSet.add(currentId);
    explorationOrder.push(currentId);

    steps.push({
      stepNumber: steps.length + 1,
      nodeId: currentId,
      nodeName: currentNode?.name || currentId,
      position: currentNode?.position || [0, 0, 0],
      g: Math.round(currentG),
      h: Math.round(currentH),
      f: Math.round(current.f),
      parent: parentId,
      parentName: parentNode?.name,
      openSetCandidates,
      selectionReason: `Selected from Open Set because it has the lowest f(n) = ${Math.round(current.f)} m (${Math.round(currentG)} m actual + ${Math.round(currentH)} m estimated) among all eligible candidates.`,
    });

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
      routeNodesAnalysis: [],
      errorMessage: `No walkable route exists between '${startNode.name}' and '${targetNode.name}'. Connecting paths may be blocked by temporary pathway closures.`,
    };
  }

  const path = reconstructPath(cameFrom, targetNodeId);
  const pathCoordinates = extractPathCoordinates(graph, path);

  const totalDistance = gScores.get(targetNodeId) || 0;
  const timeCalc = calculateWalkingTime(totalDistance, walkingSpeedMetersPerSec);

  // Construct detailed node analysis for every waypoint on the optimal route
  const routeNodesAnalysis: RouteNodeAnalysis[] = path.map((nodeId, idx) => {
    const node = graph.getNode(nodeId);
    const g = Math.round(gScores.get(nodeId) || 0);
    const h = Math.round(hScores.get(nodeId) || 0);
    const f = Math.round(g + h);
    const parentId = cameFrom.get(nodeId);
    const parentNode = parentId ? graph.getNode(parentId) : undefined;
    const isStart = idx === 0;
    const isDest = idx === path.length - 1;
    const expIdx = explorationOrder.indexOf(nodeId);
    const expansionOrder = expIdx !== -1 ? expIdx + 1 : undefined;

    let explanation = '';
    if (isStart) {
      explanation = `Origin waypoint at ${node?.name || nodeId}. Initial accumulated cost g(n) is 0 m. The estimated remaining straight-line cost to ${targetNode.name} is ${h} m, yielding initial estimated route cost f(n) = 0 + ${h} = ${f} m.`;
    } else if (isDest) {
      explanation = `Final destination reached at ${node?.name || nodeId}. Total walking distance accumulated from ${startNode.name} is ${g} m. The estimated remaining cost h(n) is 0 m, giving final verified route distance f(n) = ${g} + 0 = ${f} m.`;
    } else {
      explanation = `The route cost accumulated from ${startNode.name} to this node is ${g} m. The estimated remaining cost to ${targetNode.name} is ${h} m. The estimated total cost through this node is ${f} m.`;
    }

    return {
      nodeId,
      nodeName: node?.name || nodeId,
      position: node?.position || [0, 0, 0],
      g,
      h,
      f,
      parent: parentId,
      parentName: parentNode?.name,
      isStart,
      isDestination: isDest,
      waypointIndex: idx + 1,
      totalWaypoints: path.length,
      expansionOrder,
      explanation,
    };
  });

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
    routeNodesAnalysis,
    avoidedObstaclesCount: graph.getBlockedEdgesCount(),
  };
}

export default findPathAStar;
