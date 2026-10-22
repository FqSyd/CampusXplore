import React from 'react';
import { DemoRoute } from '../../types';
import { DEMO_ROUTES } from '../../data/presets';
import { Play } from 'lucide-react';

interface PresetRoutesProps {
  onSelectScenario: (scenario: DemoRoute) => void;
  activeScenarioId?: string;
}

export const PresetRoutes: React.FC<PresetRoutesProps> = ({
  onSelectScenario,
  activeScenarioId,
}) => {
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
        <span>Preset Demo Scenarios</span>
        <span className="text-[10px] text-blue-400 font-normal">Section 37</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {DEMO_ROUTES.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectScenario(s)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
              activeScenarioId === s.id
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
            title={s.description}
          >
            <Play className="w-3 h-3 text-cyan-400 shrink-0 fill-cyan-400" />
            <span className="truncate">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetRoutes;
