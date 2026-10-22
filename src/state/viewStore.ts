import { CameraPreset, Position3D } from '../types';

export type ViewMode = '3d' | '2d';
export type CameraAngle = 'default' | 'top' | 'south' | 'north' | 'focus';

export interface ViewState {
  viewMode: ViewMode;
  cameraAngle: CameraAngle;
  showMinimap: boolean;
  showLabels: boolean;
  focusTarget: Position3D | null;
}
