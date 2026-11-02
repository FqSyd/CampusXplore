import React from 'react';
import { CameraViewMode } from '../../types';
import { CameraControls } from '../camera/CameraControls';
import { Box, Map, Activity, Layers } from 'lucide-react';

export interface MapToolbarProps {
  viewType: '3d' | '2d';
  onToggleViewType: (mode: '3d' | '2d') => void;
  viewMode: CameraViewMode;
  onSetViewMode: (mode: CameraViewMode) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onResetCamera: () => void;
  onFocusStart: () => void;
  onFocusDest: () => void;
  hasStart: boolean;
  hasDest: boolean;
  hasActiveRoute: boolean;
  isAnalysisOpen: boolean;
  onToggleAnalysis: () => void;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({
  viewType,
  onToggleViewType,
  viewMode,
  onSetViewMode,
  showLabels,
  onToggleLabels,
  onResetCamera,
  onFocusStart,
  onFocusDest,
  hasStart,
  hasDest,
  hasActiveRoute,
  isAnalysisOpen,
  onToggleAnalysis,
}) => {
  return (
    <div
      id="campus-map-toolbar"
      className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2 z-20 shrink-0 select-none"
    >
      {/* Left: 3D View and 2D Map Selection Toolbar */}
      <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
        <button
          id="btn-switch-3d-view"
          onClick={() => {
            if (viewType !== '3d') onToggleViewType('3d');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            viewType === '3d'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Switch to 3D Campus View"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>

        <button
          id="btn-switch-2d-map"
          onClick={() => {
            if (viewType !== '2d') onToggleViewType('2d');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            viewType === '2d'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Switch to 2D Topographic Campus Map"
        >
          <Map className="w-3.5 h-3.5" />
          <span>2D Map</span>
        </button>
      </div>

      {/* Center: Camera Controls (in 3D) or 2D Map Status */}
      <div className="flex items-center gap-2">
        {viewType === '3d' ? (
          <div className="flex items-center gap-2">
            <CameraControls
              viewMode={viewMode}
              onSetViewMode={onSetViewMode}
              showLabels={showLabels}
              onToggleLabels={onToggleLabels}
              onResetCamera={onResetCamera}
              onFocusStart={onFocusStart}
              onFocusDest={onFocusDest}
              hasStart={hasStart}
              hasDest={hasDest}
              hasActiveRoute={hasActiveRoute}
              embedded={true}
            />

            {/* Quick 3D Navigation Hint (hidden on mobile) */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="font-semibold text-slate-300">Left Drag:</span> Orbit
              <span className="text-slate-600">•</span>
              <span className="font-semibold text-slate-300">Wheel:</span> Zoom
              <span className="text-slate-600">•</span>
              <span className="font-semibold text-slate-300">Right Drag:</span> Pan
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 font-medium">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>2D Topographic Overview</span>
          </div>
        )}
      </div>

      {/* Right: A* Analysis Toggle Button */}
      <div className="flex items-center gap-2">
        <button
          id="btn-toggle-astar-analysis"
          onClick={onToggleAnalysis}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shadow-lg ${
            isAnalysisOpen
              ? 'bg-cyan-600 text-white border-cyan-400/60 shadow-cyan-600/30 ring-1 ring-cyan-400/40'
              : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
          }`}
          title={isAnalysisOpen ? 'Hide A* Node Analysis panel' : 'Show A* Node Analysis panel'}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-300" />
          <span>A* Analysis</span>
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isAnalysisOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default MapToolbar;
