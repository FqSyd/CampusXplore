import React, { useState, useRef, useEffect } from 'react';
import { CameraViewMode } from '../../types';
import {
  RotateCcw,
  Eye,
  Layers,
  Compass,
  Tag,
  Focus,
  User,
  Camera,
  ChevronDown,
} from 'lucide-react';

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
  hasActiveRoute?: boolean;
  embedded?: boolean;
  viewType?: '3d' | '2d';
  onToggleViewType?: () => void;
  isAnalysisPanelOpen?: boolean;
}

const VIEW_MODE_LABELS: Record<CameraViewMode, string> = {
  default: '3D Isometric',
  top: 'Top-Down',
  south: 'South Gate',
  north: 'North Quad',
  follow: 'Follow Walker',
  focus: 'Focused View',
};

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
  hasActiveRoute = false,
  embedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close camera popover on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Mode selection helper: sets mode and automatically collapses menu
  const handleSelectMode = (mode: CameraViewMode) => {
    onSetViewMode(mode);
    setIsOpen(false);
  };

  const handleReset = () => {
    onResetCamera();
    setIsOpen(false);
  };

  const handleFocusStartClick = () => {
    onFocusStart();
    setIsOpen(false);
  };

  const handleFocusDestClick = () => {
    onFocusDest();
    setIsOpen(false);
  };

  return (
    <div
      id="camera-controls-panel"
      ref={menuRef}
      className={`relative inline-block text-left select-none ${
        embedded ? '' : 'absolute top-3 left-3 z-30'
      }`}
    >
      {/* Compact Collapsible Toolbar Trigger Button */}
      <button
        id="camera-controls-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-md ${
          isOpen
            ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 ring-1 ring-cyan-500/30'
            : viewMode === 'follow'
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600'
        }`}
        title="Open Camera Controls & Perspectives"
        aria-expanded={isOpen}
      >
        <Camera className="w-3.5 h-3.5 text-cyan-400" />
        <span className="truncate max-w-[110px] sm:max-w-none">
          {VIEW_MODE_LABELS[viewMode] || 'Camera'}
        </span>
        {viewMode === 'follow' && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        )}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu (Only rendered when user opens it; collapses on selection) */}
      {isOpen && (
        <div
          id="camera-controls-dropdown"
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 rounded-2xl glass-panel bg-slate-950/95 border border-slate-700/90 shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-fadeIn"
        >
          {/* Header */}
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
            <span>Camera Perspectives</span>
            {viewMode === 'follow' && (
              <span className="text-emerald-400 font-bold text-[9px] animate-pulse">
                ● TRACKING
              </span>
            )}
          </div>

          {/* 1. Follow Walker (Shown when active route exists) */}
          {hasActiveRoute && (
            <button
              onClick={() => handleSelectMode(viewMode === 'follow' ? 'default' : 'follow')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                viewMode === 'follow'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{viewMode === 'follow' ? 'Follow Walker (Active)' : 'Follow Walker'}</span>
            </button>
          )}

          {/* 2. 3D Isometric */}
          <button
            onClick={() => handleSelectMode('default')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'default'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Isometric</span>
          </button>

          {/* 3. Top-Down */}
          <button
            onClick={() => handleSelectMode('top')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'top'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Top-Down</span>
          </button>

          {/* 4. South Gate */}
          <button
            onClick={() => handleSelectMode('south')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'south'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>South Gate</span>
          </button>

          {/* 5. North Quad */}
          <button
            onClick={() => handleSelectMode('north')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              viewMode === 'north'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>North Quad</span>
          </button>

          {/* 6. Free Camera / Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-left cursor-pointer"
            title="Reset Camera to free orbit viewpoint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Free Camera</span>
          </button>

          <div className="h-[1px] bg-slate-800 my-1" />

          {/* 7. 3D Labels Toggle */}
          <button
            onClick={onToggleLabels}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              showLabels
                ? 'bg-slate-900 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>3D Labels</span>
            </div>
            <span className="text-[10px] uppercase font-bold">{showLabels ? 'ON' : 'OFF'}</span>
          </button>

          {/* 8. Focus Start */}
          {hasStart && (
            <button
              onClick={handleFocusStartClick}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-all text-left cursor-pointer"
              title="Focus camera on Start location"
            >
              <Focus className="w-3.5 h-3.5" />
              <span>Focus Start</span>
            </button>
          )}

          {/* 9. Focus Destination */}
          {hasDest && (
            <button
              onClick={handleFocusDestClick}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left cursor-pointer"
              title="Focus camera on Destination location"
            >
              <Focus className="w-3.5 h-3.5" />
              <span>Focus Dest</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const ViewControls = CameraControls;
export default CameraControls;
