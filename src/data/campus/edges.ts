import { NavigationEdge } from '../../types';
import pathsJson from '../paths.json';

export const CAMPUS_EDGES: NavigationEdge[] = pathsJson.edges as NavigationEdge[];
export const edges = CAMPUS_EDGES;

export default CAMPUS_EDGES;
