import React from 'react';
import { Html } from '@react-three/drei';
import { CampusBuilding } from '../../types';

export interface CampusLabelsProps {
  buildings: CampusBuilding[];
  showLabels: boolean;
  selectedStartBuildingId: string | null;
  selectedDestBuildingId: string | null;
  onSelectBuilding: (building: CampusBuilding) => void;
}

export const CampusLabels: React.FC<CampusLabelsProps> = ({
  buildings,
  showLabels,
  selectedStartBuildingId,
  selectedDestBuildingId,
  onSelectBuilding,
}) => {
  if (!showLabels) return null;

  return (
    <group name="campus-building-labels">
      {buildings.map((b) => {
        const isStart = selectedStartBuildingId === b.id;
        const isDest = selectedDestBuildingId === b.id;
        const height = b.size[1];

        // Label elevation depends on building height
        const labelY = height + (b.id === 'main_gate' ? 4 : b.id === 'sports_ground' ? 4 : 3);

        return (
          <group
            key={`lbl-${b.id}`}
            position={[b.position[0], labelY, b.position[2]]}
          >
            <Html
              center
              distanceFactor={85}
              zIndexRange={[100, 0]}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBuilding(b);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xl border backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                  isStart
                    ? 'bg-emerald-600/90 text-white border-emerald-400 shadow-emerald-500/40 ring-2 ring-emerald-400'
                    : isDest
                    ? 'bg-rose-600/90 text-white border-rose-400 shadow-rose-500/40 ring-2 ring-rose-400'
                    : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800/90 hover:border-slate-500'
                }`}
              >
                <span className="text-[11px]">
                  {b.category === 'academic' && '🎓'}
                  {b.category === 'administrative' && '🏛️'}
                  {b.category === 'amenity' && (b.id === 'canteen' ? '🍽️' : '🎭')}
                  {b.category === 'sports' && '⚽'}
                  {b.category === 'residential' && '🏠'}
                  {b.category === 'medical' && '🏥'}
                  {b.category === 'gate' && '🚪'}
                  {b.category === 'outdoor' && '⛲'}
                </span>
                <span className="tracking-wide whitespace-nowrap">{b.shortName}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export default CampusLabels;
