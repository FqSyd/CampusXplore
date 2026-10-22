import { Position3D } from '../../types';
import { calculateEuclideanDistance } from '../../utils/distance';

/**
 * Admissible Heuristic Function for Campus Navigation:
 * Calculates straight-line 3D Euclidean distance from node n to the target destination.
 * Multiplied by the scale factor so it is in simulated meters.
 *
 * Mathematical Property:
 * h(n) <= true distance d(n, target)
 * Guaranteeing that A* remains admissible and optimal.
 */
export function calculateEuclideanHeuristic(
  fromPosition: Position3D,
  targetPosition: Position3D,
  scaleFactor: number = 6.0
): number {
  return calculateEuclideanDistance(fromPosition, targetPosition) * scaleFactor;
}
