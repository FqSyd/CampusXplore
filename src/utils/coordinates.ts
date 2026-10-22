import { Position3D } from '../types';

/**
 * Projects a 3D ground position (X, Y, Z) onto a 2D SVG coordinate system.
 * In the 3D campus coordinate space:
 * - X ranges roughly from -75 to +75 (West to East)
 * - Z ranges roughly from -75 to +75 (North to South, where South is +Z)
 */
export function project3DTo2D(
  pos: Position3D,
  mapSize: number,
  padding: number = 20
): { x: number; y: number } {
  const usable = mapSize - padding * 2;
  const x = padding + ((pos[0] + 75) / 150) * usable;
  const y = padding + ((pos[2] + 75) / 150) * usable;
  return { x, y };
}

/**
 * Converts an array of 3D positions into an SVG points attribute string.
 */
export function positionsToSvgPoints(
  positions: Position3D[],
  mapSize: number,
  padding: number = 20
): string {
  if (!positions || positions.length < 2) return '';
  return positions
    .map((pos) => {
      const { x, y } = project3DTo2D(pos, mapSize, padding);
      return `${x},${y}`;
    })
    .join(' ');
}
