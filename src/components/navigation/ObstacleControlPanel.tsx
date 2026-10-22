import React from 'react';
import { CampusObstacle } from '../../types';
import { BellRing, Calendar, Wrench } from 'lucide-react';

interface ObstacleControlPanelProps {
  obstacles: CampusObstacle[];
  activeObstacleIds: Set<string>;
  onToggleObstacle: (obstacleId: string) => void;
}

export const ObstacleControlPanel: React.FC<ObstacleControlPanelProps> = ({
  obstacles,
  activeObstacleIds,
  onToggleObstacle,
}) => {
  const dynamicObstacles = obstacles.filter((o) => o.isDynamic);

  // Helper to map realistic campus situation details
  const getUpdateDetails = (obs: CampusObstacle) => {
    if (obs.id === 'dyn_canteen_plaza_closure') {
      return {
        badge: 'EVENT IN PROGRESS',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        location: 'Canteen Forecourt',
        description: 'An event is currently using this pathway. Find another walking route.',
        icon: Calendar,
      };
    }
    if (obs.id === 'dyn_admin_east_closure') {
      return {
        badge: 'PATHWAY UNDER REPAIR',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        location: 'Admin East Promenade',
        description: 'Maintenance work is in progress. This pathway is temporarily unavailable.',
        icon: Wrench,
      };
    }
    return {
      badge: 'TEMPORARY CLOSURE',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      location: obs.name,
      description: obs.description || 'This pathway is temporarily unavailable.',
      icon: BellRing,
    };
  };

  return (
    <div className="glass-panel-subtle rounded-xl p-3 border border-slate-700/60 flex flex-col gap-2">
      {/* Main Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <BellRing className="w-3.5 h-3.5 text-blue-400" />
          <span>CAMPUS PATHWAY UPDATES</span>
        </div>
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
          Live Alerts
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">
        Some campus pathways may be temporarily unavailable due to events, construction, maintenance or repairs. A* finds the fastest available walking route around them.
      </p>

      {/* Temporary Campus Updates Sub-section */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
          TEMPORARY CAMPUS UPDATES
        </div>

        {dynamicObstacles.map((obs) => {
          const isBlocked = activeObstacleIds.has(obs.id);
          const details = getUpdateDetails(obs);
          const IconComponent = details.icon;

          return (
            <div
              key={obs.id}
              onClick={() => onToggleObstacle(obs.id)}
              className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                isBlocked
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-sm shadow-amber-900/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isBlocked}
                onChange={() => {}}
                className="mt-1 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${details.badgeBg}`}>
                    {details.badge}
                  </span>
                  <span className="font-semibold text-white text-xs truncate">
                    {details.location}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {details.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ObstaclePanel = ObstacleControlPanel;
export default ObstacleControlPanel;
