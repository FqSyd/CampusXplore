# A* Pathfinding Algorithm Documentation

## Mathematical Foundation

A* finds the shortest path between a starting node $s$ and target node $t$ across a weighted graph by minimizing the total evaluation function:

$$f(n) = g(n) + h(n)$$

- **$g(n)$**: The exact accumulated cost (simulated distance in meters) from the start node $s$ to current node $n$.
- **$h(n)$**: The estimated distance from node $n$ to destination $t$. We utilize straight-line 3D Euclidean distance:
  $$h(n) = \text{scaleFactor} \times \sqrt{(x_t - x_n)^2 + (y_t - y_n)^2 + (z_t - z_n)^2}$$
- **$f(n)$**: The total estimated cost of the cheapest path traversing node $n$.

### Admissibility & Optimality
Because straight-line Euclidean distance is the shortest possible path between two physical coordinates in space, $h(n) \le d(n, t)$ is guaranteed. An admissible heuristic guarantees that A* will never overestimate remaining distance and is mathematically proven to return the optimal (shortest) walkable route.

## Input Parameters

```typescript
findPathAStar(
  graph: CampusGraph,
  startNodeId: string,
  targetNodeId: string,
  walkingSpeedMetersPerSec?: number // default 1.4 m/s
): AStarResult
```

## Output Result

```typescript
interface AStarResult {
  found: boolean;
  path: string[];                     // Sequence of node IDs from start to target
  pathCoordinates: Position3D[];     // Sequence of [x, y, z] coordinates for 3D/2D lines
  totalDistance: number;              // Total meters
  estimatedWalkingTimeMinutes: number;// Walk time at 1.4 m/s
  nodesExplored: number;              // Size of closed set
  explorationOrder: string[];         // Order of node expansions
  steps: AStarStep[];                 // Trace for step-by-step visualization
  gScores: Record<string, number>;
  hScores: Record<string, number>;
  fScores: Record<string, number>;
}
```
