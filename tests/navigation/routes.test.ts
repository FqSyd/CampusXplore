import buildingsData from '../../src/data/buildings.json';
import pathsData from '../../src/data/paths.json';
import campusData from '../../src/data/campus.json';
import { CampusGraph } from '../../src/utils/graph';
import { findPathAStar } from '../../src/algorithms/astar';
import { CampusBuilding, NavigationNode, NavigationEdge } from '../../src/types/campus';

console.log('=== RUNNING PRESET DEMO SCENARIO TESTS ===');

const buildings = buildingsData as CampusBuilding[];
const nodes = pathsData.nodes as NavigationNode[];
const edges = pathsData.edges as NavigationEdge[];
const graph = new CampusGraph(nodes, edges, buildings, campusData.scaleFactor);

const demoScenarios = [
  { name: 'Main Gate to Library', from: 'main_gate', to: 'library' },
  { name: 'Parking to Canteen', from: 'parking_area', to: 'canteen' },
  { name: 'Hostel to CS Block', from: 'hostel', to: 'cs_block' },
  { name: 'Auditorium to Medical Center', from: 'auditorium', to: 'medical_center' },
];

let allPassed = true;

for (const sc of demoScenarios) {
  const fromNode = graph.getNodeForBuilding(sc.from);
  const toNode = graph.getNodeForBuilding(sc.to);

  if (!fromNode || !toNode) {
    console.error(`[FAIL] Nodes not found for scenario "${sc.name}"`);
    allPassed = false;
    continue;
  }

  const res = findPathAStar(graph, fromNode, toNode, campusData.walkingSpeedMetersPerSec);

  if (res.found && res.path.length >= 2) {
    console.log(`[PASS] ${sc.name}: ${res.totalDistance}m, ${res.estimatedWalkingTimeMinutes} min (${res.path.length} waypoints)`);
  } else {
    console.error(`[FAIL] ${sc.name}: route could not be calculated.`);
    allPassed = false;
  }
}

if (!allPassed) process.exit(1);
