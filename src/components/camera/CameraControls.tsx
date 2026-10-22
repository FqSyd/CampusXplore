import React from 'react';
import { CameraViewMode } from '../../types';
import { RotateCcw, Eye, Layers, Compass, Tag, Focus, Map, Box, User } from 'lucide-react';

export interface CameraControlsProps {
  viewMode: CameraViewMode;
  onSetViewMode: (mode: CameraViewMode) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onResetCamera: () => void;
  onFocusStart: () => void;
  onFocusDest: () => void;
  hasStart: boolean;
  hasDest: boolean;
  viewType: '3d' | '2d';
  onToggleViewType: () => void;
  hasActiveRoute?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  viewMode,
  onSetViewMode,
  showLabels,
  onToggleLabels,
  onResetCamera,
  onFocusStart,
  onFocusDest,
  hasStart,
  hasDest,
  viewType,
  onToggleViewType,
  hasActiveRoute = false,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
      {/* 2D / 3D Full Simulation Mode Toggle */}
      <div className="glass-panel rounded-xl p-1 border border-blue-500/40 shadow-2xl flex items-center gap-1">
        <button
          onClick={() => {
            if (viewType !== '3d') onToggleViewType();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            viewType === '3d'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>
        <button
          onClick={() => {
            if (viewType !== '2d') onToggleViewType();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            viewType === '2d'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>2D Map</span>
        </button>
      </div>

      {/* Camera View Controls (in 3D mode) */}
      {viewType === '3d' && (
        <div className="glass-panel rounded-xl p-1.5 flex flex-col gap-1 border border-slate-700/80 shadow-2xl">
          <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
            <span>Camera Mode</span>
            {viewMode === 'follow' && (
              <span className="text-emerald-400 font-bold text-[9px] animate-pulse">● TRACKING</span>
            )}
          </div>

          {/* Follow Walker Mode Toggle (shown when route active) */}
          {hasActiveRoute && (
            <button
              onClick={() => onSetViewMode(viewMode === 'follow' ? 'default' : 'follow')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'follow'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{viewMode === 'follow' ? 'Follow Walker (Active)' : 'Follow Walker'}</span>
            </button>
          )}

          {/* Preset Camera Angles */}
          <button
            onClick={() => onSetViewMode('default')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'default'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Isometric</span>
          </button>

          <button
            onClick={() => onSetViewMode('top')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'top'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Top-Down</span>
          </button>

          <button
            onClick={() => onSetViewMode('south')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'south'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>South Gate</span>
          </button>

          <button
            onClick={() => onSetViewMode('north')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'north'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>North Quad</span>
          </button>

          <div className="h-[1px] bg-slate-800 my-1"></div>

          <button
            onClick={onResetCamera}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-left cursor-pointer"
            title="Reset Camera to free default viewpoint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Free Camera</span>
          </button>
        </div>
      )}

      {/* Toggles and Overlays */}
      {viewType === '3d' && (
        <div className="glass-panel rounded-xl p-1.5 flex flex-col gap-1 border border-slate-700/80 shadow-2xl">
          <button
            onClick={onToggleLabels}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              showLabels
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>3D Labels</span>
            </div>
            <span className="text-[10px] uppercase font-bold">{showLabels ? 'ON' : 'OFF'}</span>
          </button>

          {hasStart && (
            <button
              onClick={onFocusStart}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-all text-left cursor-pointer"
              title="Focus camera on Start location"
            >
              <Focus className="w-3.5 h-3.5" />
              <span>Focus Start</span>
            </button>
          )}

          {hasDest && (
            <button
              onClick={onFocusDest}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left cursor-pointer"
              title="Focus camera on Destination location"
            >
              <Focus className="w-3.5 h-3.5" />
              <span>Focus Dest</span>
            </button>
          )}
        </div>
      )}

      {viewType === '3d' && (
        <div className="hidden lg:block glass-panel rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400 border border-slate-800 text-center select-none">
          <span className="font-semibold text-slate-300">Left Drag:</span> Orbit •{' '}
          <span className="font-semibold text-slate-300">Wheel:</span> Zoom •{' '}
          <span className="font-semibold text-slate-300">Right Drag:</span> Pan
        </div>
      )}
    </div>
  );
};

export const ViewControls = CameraControls;
export default CameraControls;
