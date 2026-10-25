export type Position3D = [number, number, number];

export interface OpenSetNode {
  id: string;
  f: number;
}

export interface CandidateNode {
  nodeId: string;
  nodeName: string;
  g: number;
  h: number;
  f: number;
}

export interface AStarStep {
  stepNumber: number;
  nodeId: string;
  nodeName: string;
  position: Position3D;
  g: number;
  h: number;
  f: number;
  parent?: string;
  parentName?: string;
  openSetCandidates?: CandidateNode[];
  selectionReason?: string;
}

export interface RouteNodeAnalysis {
  nodeId: string;
  nodeName: string;
  position: Position3D;
  g: number;                          // Accumulated walking cost from start in meters
  h: number;                          // Estimated straight-line remaining cost to destination in meters
  f: number;                          // Total estimated cost f(n) = g(n) + h(n) in meters
  parent?: string;
  parentName?: string;
  isStart: boolean;
  isDestination: boolean;
  waypointIndex: number;              // 1-based index (e.g. 1 of 8)
  totalWaypoints: number;
  expansionOrder?: number;            // Step in which this node was expanded
  explanation: string;                // Natural language breakdown of f(n) = g(n) + h(n)
}

export interface AStarResult {
  found: boolean;
  path: string[];                     // Sequence of node IDs from start to destination
  pathCoordinates: Position3D[];      // Real-space coordinates along the path
  totalDistance: number;               // Simulated meters
  estimatedWalkingTimeMinutes: number; // Based on walking speed
  nodesExplored: number;               // Number of nodes evaluated
  explorationOrder: string[];          // Order in which nodes were evaluated
  steps: AStarStep[];                  // Detailed trace for animation
  gScores: Record<string, number>;
  hScores: Record<string, number>;
  fScores: Record<string, number>;
  routeNodesAnalysis: RouteNodeAnalysis[]; // Detailed node-level calculations along the optimal route
  avoidedObstaclesCount?: number;
  errorMessage?: string;
}
