import { Position3D, CampusObstacle, NavigationNode, NavigationEdge } from '../types/campus';

/**
 * Checks if a 2D line segment from (x1, z1) to (x2, z2) intersects an Axis-Aligned Bounding Box (AABB).
 * Implements the standard Cohen-Sutherland / Liang-Barsky slab algorithm in the X-Z ground plane.
 */
export function isSegmentIntersectingAABB(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  box: { minX: number; maxX: number; minZ: number; maxZ: number }
): boolean {
  // If both endpoints are strictly outside on the same side, trivial reject
  if ((x1 < box.minX && x2 < box.minX) || (x1 > box.maxX && x2 > box.maxX)) return false;
  if ((z1 < box.minZ && z2 < box.minZ) || (z1 > box.maxZ && z2 > box.maxZ)) return false;

  // If either point is strictly inside, line intersects
  if (
    x1 > box.minX && x1 < box.maxX && z1 > box.minZ && z1 < box.maxZ
  ) return true;
  if (
    x2 > box.minX && x2 < box.maxX && z2 > box.minZ && z2 < box.maxZ
  ) return true;

  const dx = x2 - x1;
  const dz = z2 - z1;

  let tMin = 0.0;
  let tMax = 1.0;

  // Check X slabs
  if (Math.abs(dx) > 1e-7) {
    let t1 = (box.minX - x1) / dx;
    let t2 = (box.maxX - x1) / dx;
    if (t1 > t2) {
      const temp = t1;
      t1 = t2;
      t2 = temp;
    }
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return false;
  } else {
    if (x1 < box.minX || x1 > box.maxX) return false;
  }

  // Check Z slabs
  if (Math.abs(dz) > 1e-7) {
    let t1 = (box.minZ - z1) / dz;
    let t2 = (box.maxZ - z1) / dz;
    if (t1 > t2) {
      const temp = t1;
      t1 = t2;
      t2 = temp;
    }
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return false;
  } else {
    if (z1 < box.minZ || z1 > box.maxZ) return false;
  }

  return tMin <= tMax && tMax >= 0 && tMin <= 1;
}

export interface CollisionViolation {
  edge: NavigationEdge;
  fromNode: NavigationNode;
  toNode: NavigationNode;
  obstacle: CampusObstacle;
}

/**
 * Validates that no edge in the navigation graph cuts through any active obstacle.
 */
export function validateGraphObstacleClearance(
  nodes: NavigationNode[],
  edges: NavigationEdge[],
  obstacles: CampusObstacle[]
): CollisionViolation[] {
  const nodeMap = new Map<string, NavigationNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  const activeObstacles = obstacles.filter((obs) => obs.isActive !== false);
  const violations: CollisionViolation[] = [];

  for (const edge of edges) {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) continue;

    const x1 = fromNode.position[0];
    const z1 = fromNode.position[2];
    const x2 = toNode.position[0];
    const z2 = toNode.position[2];

    for (const obs of activeObstacles) {
      // If the edge connects directly to a building entrance, skip that specific building
      if (
        (fromNode.isBuildingEntrance && fromNode.buildingId && obs.id.includes(fromNode.buildingId)) ||
        (toNode.isBuildingEntrance && toNode.buildingId && obs.id.includes(toNode.buildingId))
      ) {
        continue;
      }

      if (isSegmentIntersectingAABB(x1, z1, x2, z2, obs.bounds)) {
        violations.push({
          edge,
          fromNode,
          toNode,
          obstacle: obs,
        });
      }
    }
  }

  return violations;
}
