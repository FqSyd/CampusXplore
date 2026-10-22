import { Position3D } from './algorithm';

export type NavigationNodeType =
  | 'gate'
  | 'path'
  | 'intersection'
  | 'building_entrance'
  | 'crossing'
  | 'destination'
  | 'junction'
  | 'waypoint';

export interface NavigationNode {
  id: string;
  name: string;
  position: Position3D;
  isBuildingEntrance?: boolean;
  buildingId?: string;
  type: NavigationNodeType;
}

export interface NavigationEdge {
  from: string;
  to: string;
  distance?: number;
  type?: 'road' | 'walkway' | 'path' | 'crossing';
  bidirectional?: boolean;
  isBlocked?: boolean;
}

export type NavigationStatus =
  | 'idle'
  | 'ready'
  | 'searching'
  | 'found'
  | 'not_found'
  | 'same_location';

export type CameraViewMode = 'default' | 'top' | 'south' | 'north' | 'focus' | 'follow';

export interface WalkerProgress {
  currentSegment: number;
  totalSegments: number;
  progressRatio: number;
  remainingDistance: number;
  remainingTimeMinutes: number;
  currentPosition: Position3D;
  isWalking: boolean;
  isArrived: boolean;
}

export interface CameraPreset {
  name: string;
  position: Position3D;
  target: Position3D;
}

export interface DemoRoute {
  id: string;
  name: string;
  fromId: string;
  toId: string;
  description: string;
}
