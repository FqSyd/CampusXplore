import { CampusObstacle } from '../../types';
import obstaclesJson from '../obstacles.json';

export const CAMPUS_OBSTACLES: CampusObstacle[] = obstaclesJson as CampusObstacle[];
export const obstacles = CAMPUS_OBSTACLES;

export default CAMPUS_OBSTACLES;
