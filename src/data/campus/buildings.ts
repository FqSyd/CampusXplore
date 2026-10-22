import { CampusBuilding } from '../../types';
import buildingsJson from '../buildings.json';

export const CAMPUS_BUILDINGS: CampusBuilding[] = buildingsJson as CampusBuilding[];
export const buildings = CAMPUS_BUILDINGS;

export default CAMPUS_BUILDINGS;
