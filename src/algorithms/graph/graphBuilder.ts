import { CampusBuilding, NavigationNode, NavigationEdge } from '../../types';
import { CampusGraph } from './graph';

export function buildCampusGraph(
  nodes: NavigationNode[],
  edges: NavigationEdge[],
  buildings: CampusBuilding[],
  scaleFactor: number = 6.0
): CampusGraph {
  return new CampusGraph(nodes, edges, buildings, scaleFactor);
}
