import pathsData from '../../src/data/paths.json';
import obstaclesData from '../../src/data/obstacles.json';
import { validateGraphObstacleClearance } from '../../src/utils/collision';
import { NavigationNode, NavigationEdge, CampusObstacle } from '../../src/types/campus';

console.log('=== RUNNING GRAPH OBSTACLE CLEARANCE TEST ===');

const nodes = pathsData.nodes as NavigationNode[];
const edges = pathsData.edges as NavigationEdge[];
const obstacles = obstaclesData as CampusObstacle[];

const violations = validateGraphObstacleClearance(nodes, edges, obstacles);

if (violations.length === 0) {
  console.log('[PASS] All edges have zero physical collisions with obstacle bounding boxes.');
  console.log(`Verified ${edges.length} edges against ${obstacles.length} obstacles.`);
} else {
  console.error(`[FAIL] Detected ${violations.length} edge collision violations:`);
  for (const v of violations) {
    console.error(`- Edge ${v.edge.from} -> ${v.edge.to} intersects "${v.obstacle.name}"`);
  }
  process.exit(1);
}
