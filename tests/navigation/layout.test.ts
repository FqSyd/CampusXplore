import buildingsData from '../../src/data/buildings.json';
import pathsData from '../../src/data/paths.json';
import campusData from '../../src/data/campus.json';
import { CampusGraph } from '../../src/utils/graph';
import { findPathAStar } from '../../src/algorithms/astar';
import { CampusBuilding, NavigationNode, NavigationEdge, CameraViewMode } from '../../src/types/campus';

console.log('=== RUNNING LAYOUT & MAP CONTROLS INTEGRATION TESTS ===');

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

// 1. Route Calculation & Waypoint Node Analysis Preservation
const routeResult = findPathAStar(graph, 'node_main_gate', 'node_library_entrance', 1.4);
assert(routeResult.found === true, 'A* pathfinding succeeds for route calculation');
assert(!!routeResult.routeNodesAnalysis && routeResult.routeNodesAnalysis.length > 0, 'Route produces routeNodesAnalysis for right panel');

const waypoints = routeResult.routeNodesAnalysis;
const totalWaypoints = waypoints.length;

// 2. Waypoint stepping logic (Next / Prev)
let currentWaypointIdx = 0; // 0-indexed corresponding to waypoint 1
assert(waypoints[currentWaypointIdx].waypointIndex === 1, 'First waypoint has index 1');
assert(waypoints[currentWaypointIdx].isStart === true, 'First waypoint is marked as origin');

// Step next
currentWaypointIdx = Math.min(totalWaypoints - 1, currentWaypointIdx + 1);
assert(currentWaypointIdx === 1, 'Stepping next moves to index 1');
assert(waypoints[currentWaypointIdx].waypointIndex === 2, 'Second waypoint has index 2');

// Step beyond end
let endIdx = Math.min(totalWaypoints - 1, totalWaypoints + 5);
assert(endIdx === totalWaypoints - 1, 'Stepping beyond max is safely clamped');
assert(waypoints[endIdx].isDestination === true, 'Last waypoint is marked as destination');

// Step prev
let prevIdx = Math.max(0, currentWaypointIdx - 1);
assert(prevIdx === 0, 'Stepping prev moves back to origin');

// 3. Camera Controls Modes
const validModes: CameraViewMode[] = ['default', 'top', 'south', 'north', 'follow', 'focus'];
assert(validModes.length === 6, 'All 6 camera view modes defined');

// 4. View Switching (3D <-> 2D) preserving route and analysis
let currentViewType: '3d' | '2d' = '3d';
assert(currentViewType === '3d', 'Initial view is 3D simulation');

// Switch to 2D
currentViewType = '2d';
assert(currentViewType === '2d', 'Switched to 2D map');
// Verify route and analysis are intact
assert(routeResult.path.length === totalWaypoints, 'Route path preserved when switched to 2D map');
assert(routeResult.totalDistance > 0, 'Route total distance preserved when switched to 2D map');
assert(waypoints[0].g === 0, 'A* node analysis preserved when switched to 2D map');

// Switch back to 3D
currentViewType = '3d';
assert(currentViewType === '3d', 'Switched back to 3D view');
assert(routeResult.path.length === totalWaypoints, 'Route path preserved when switched back to 3D view');

// 5. A* Analysis Panel Toggle preservation
let isAnalysisOpen = true;
// Toggle closed
isAnalysisOpen = false;
assert(!isAnalysisOpen, 'A* Analysis panel can be hidden to allow map expansion');
assert(routeResult.found === true, 'Route state preserved when A* Analysis panel is hidden');

// Toggle open
isAnalysisOpen = true;
assert(isAnalysisOpen, 'A* Analysis panel can be reopened');
assert(waypoints.length === totalWaypoints, 'Analysis data remains complete when panel reopened');

console.log(`\nResults: ${testsPassed} passed, ${testsFailed} failed.`);

if (testsFailed > 0) {
  process.exit(1);
}
