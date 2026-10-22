import React from 'react';
import { CampusBuilding } from '../../types';
import { ArrowDownUp } from 'lucide-react';

interface LocationSelectorProps {
  buildings: CampusBuilding[];
  startBuildingId: string;
  destBuildingId: string;
  onStartChange: (id: string) => void;
  onDestChange: (id: string) => void;
  onSwapLocations: () => void;
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  buildings,
  startBuildingId,
  destBuildingId,
  onStartChange,
  onDestChange,
  onSwapLocations,
  disabled = false,
}) => {
  return (
    <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
      {/* Origin Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            Starting Location (Origin)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">START</span>
        </label>
        <select
          value={startBuildingId}
          onChange={(e) => onStartChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 text-slate-100 text-xs rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer font-medium"
        >
          {buildings.map((b) => (
            <option key={`sel-start-${b.id}`} value={b.id} className="bg-slate-900 text-slate-100">
              {b.name} ({b.category})
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-1">
        <button
          type="button"
          onClick={onSwapLocations}
          disabled={disabled}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Swap Origin and Destination"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Destination Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-rose-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            Destination (Target)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">DESTINATION</span>
        </label>
        <select
          value={destBuildingId}
          onChange={(e) => onDestChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-rose-500 text-slate-100 text-xs rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer font-medium"
        >
          {buildings.map((b) => (
            <option key={`sel-dest-${b.id}`} value={b.id} className="bg-slate-900 text-slate-100">
              {b.name} ({b.category})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;
