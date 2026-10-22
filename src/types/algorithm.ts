export type Position3D = [number, number, number];

export interface OpenSetNode {
  id: string;
  f: number;
}

export interface AStarStep {
  nodeId: string;
  g: number;
  h: number;
  f: number;
  parent?: string;
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
  avoidedObstaclesCount?: number;
  errorMessage?: string;
}
