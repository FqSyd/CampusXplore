import { Position3D, OpenSetNode, AStarStep, AStarResult } from '../../types';

export type { Position3D, OpenSetNode, AStarStep, AStarResult };

export interface AStarOptions {
  walkingSpeedMetersPerSec?: number;
  avoidObstacles?: boolean;
}
