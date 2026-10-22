import { Position3D } from '../types/campus';

/**
 * Calculates Euclidean 3D distance between two points.
 */
export function calculateEuclideanDistance(p1: Position3D, p2: Position3D): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Formats distance in meters or kilometers into human-readable string.
 * Example: 420 m, 1.25 km
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Calculates estimated walking time based on distance and walking speed.
 * @param distanceMeters total distance in meters
 * @param speedMetersPerSec default 1.4 m/s (approx 5 km/h standard pedestrian pace)
 * @returns formatted string like "5 min", "1 min 20s", "< 1 min"
 */
export function calculateWalkingTime(
  distanceMeters: number,
  speedMetersPerSec: number = 1.4
): { minutes: number; formatted: string } {
  if (distanceMeters <= 0) {
    return { minutes: 0, formatted: '0 min' };
  }
  const totalSeconds = distanceMeters / speedMetersPerSec;
  const minutes = Math.round(totalSeconds / 60);

  if (totalSeconds < 60) {
    return {
      minutes: 1,
      formatted: `${Math.round(totalSeconds)} sec`,
    };
  }

  const mins = Math.floor(totalSeconds / 60);
  const remainingSecs = Math.round(totalSeconds % 60);

  if (remainingSecs === 0 || mins >= 5) {
    return {
      minutes: Math.max(1, mins),
      formatted: `${mins} min`,
    };
  }

  return {
    minutes: mins,
    formatted: `${mins} min ${remainingSecs}s`,
  };
}
