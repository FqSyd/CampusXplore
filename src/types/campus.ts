import { Position3D, AStarResult, AStarStep } from './algorithm';
import { NavigationNode, NavigationEdge, NavigationNodeType, NavigationStatus, CameraPreset, DemoRoute } from './navigation';

export type BuildingCategory =
  | 'academic'
  | 'administrative'
  | 'amenity'
  | 'sports'
  | 'residential'
  | 'gate'
  | 'medical'
  | 'outdoor';

export interface CampusBuilding {
  id: string;
  name: string;
  shortName: string;
  category: BuildingCategory;
  position: Position3D;
  size: [number, number, number]; // width, height, depth
  rotationY?: number;
  color: string;
  accentColor: string;
  roofType?: 'flat' | 'sloped' | 'dome' | 'glass';
  floors?: number;
  description: string;
  nodeId: string; // The navigation node representing its entrance
}

export type ObstacleType =
  | 'building'
  | 'wall'
  | 'restricted_zone'
  | 'water_body'
  | 'sports_pitch'
  | 'blocked_path';

export interface CampusObstacle {
  id: string;
  name: string;
  type: ObstacleType;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    height?: number;
  };
  description?: string;
  isDynamic?: boolean;
  isActive?: boolean;
}

export interface CampusData {
  campusName: string;
  version: string;
  description: string;
  scaleFactor: number;
  walkingSpeedMetersPerSec: number;
  buildings: CampusBuilding[];
  nodes: NavigationNode[];
  edges: NavigationEdge[];
  obstacles?: CampusObstacle[];
}

// Re-export for convenience & backward compatibility
export * from './algorithm';
export * from './navigation';
