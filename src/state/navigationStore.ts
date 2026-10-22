import { NavigationStatus, DemoRoute } from '../types';

export interface NavigationState {
  startLocationId: string;
  destinationLocationId: string;
  status: NavigationStatus;
  selectedScenario?: DemoRoute;
}
