import buildingsData from '../../src/data/buildings.json';
import pathsData from '../../src/data/paths.json';
import campusData from '../../src/data/campus.json';
import { CampusGraph } from '../../src/utils/graph';
import { findPathAStar } from '../../src/algorithms/astar';
import { CampusBuilding, NavigationNode, NavigationEdge } from '../../src/types/campus';

console.log('=== RUNNING A* ALGORITHM UNIT TESTS ===');

const buildings = buildingsData as CampusBuilding[];
const nodes = pathsData.nodes as NavigationNode[];
const edges = pathsData.edges as NavigationEdge[];
const graph = new CampusGraph(nodes, edges, buildings, campusData.scaleFactor);

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    testsFailed++;
  }
}

// 1. Valid Route Test
const res1 = findPathAStar(graph, 'node_main_gate', 'node_library_entrance');
assert(res1.found === true && res1.path.length > 2, 'Should find valid route between Main Gate and Library');
assert(res1.totalDistance > 0, 'Total distance should be greater than zero');

// 2. Same Start and Destination Test
const resSame = findPathAStar(graph, 'node_main_gate', 'node_main_gate');
assert(resSame.found === true && resSame.totalDistance === 0, 'Same start and destination should yield 0 distance');
assert(resSame.path.length === 1 && resSame.path[0] === 'node_main_gate', 'Path should contain only start node');

// 3. Obstacle Avoidance Test: Main Gate to Library should not route through Admin
assert(!res1.path.includes('node_admin_entrance'), 'Path to Library should not pass through Administration building entrance');

// 4. Dynamic Obstacle Rerouting Test
graph.setEdgeBlocked('node_admin_se_turn', 'node_admin_east_mid', true);
graph.setEdgeBlocked('node_admin_east_mid', 'node_admin_ne_corner', true);

const resDetour = findPathAStar(graph, 'node_main_gate', 'node_library_entrance');
assert(resDetour.found === true, 'Should find alternative route when East Promenade is blocked');
assert(!resDetour.path.includes('node_admin_east_mid'), 'Detour path should not contain blocked East Promenade nodes');
assert(resDetour.path.includes('node_admin_west_mid'), 'Detour path should route through West Promenade');

// Reset block
graph.setEdgeBlocked('node_admin_se_turn', 'node_admin_east_mid', false);
graph.setEdgeBlocked('node_admin_east_mid', 'node_admin_ne_corner', false);

// 5. Invalid / Disconnected Node Test
const resInvalid = findPathAStar(graph, 'node_non_existent', 'node_library_entrance');
assert(resInvalid.found === false && !!resInvalid.errorMessage, 'Should handle non-existent node gracefully');

console.log(`\nResults: ${testsPassed} passed, ${testsFailed} failed.`);
if (testsFailed > 0) process.exit(1);
