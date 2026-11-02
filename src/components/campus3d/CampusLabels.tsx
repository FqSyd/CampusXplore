import React, { useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CampusBuilding } from '../../types';

export interface CampusLabelsProps {
  buildings: CampusBuilding[];
  showLabels: boolean;
  selectedStartBuildingId: string | null;
  selectedDestBuildingId: string | null;
  onSelectBuilding: (building: CampusBuilding) => void;
  isAnalysisPanelOpen?: boolean;
}

export const CampusLabels: React.FC<CampusLabelsProps> = ({
  buildings,
  showLabels,
  selectedStartBuildingId,
  selectedDestBuildingId,
  onSelectBuilding,
  isAnalysisPanelOpen = false,
}) => {
  const { camera, size, gl } = useThree();
  const labelContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Reusable vectors for zero-allocation 60 FPS calculations
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const camToObj = useMemo(() => new THREE.Vector3(), []);

  // Half-dimensions of typical label badges in screen pixels
  const LABEL_HALF_WIDTH = 65;
  const LABEL_HALF_HEIGHT = 16;
  const SAFETY_BUFFER = 12;

  useFrame(() => {
    if (!showLabels) return;

    const canvasEl = gl.domElement;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();

    // 1. Check A* Node Analysis Panel live boundary
    let panelBounds: { left: number; right: number; top: number; bottom: number } | null = null;
    const panelEl = document.getElementById('astar-node-analysis-panel');
    if (panelEl && isAnalysisPanelOpen) {
      const r = panelEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        panelBounds = {
          left: r.left - canvasRect.left,
          right: r.right - canvasRect.left,
          top: r.top - canvasRect.top,
          bottom: r.bottom - canvasRect.top,
        };
      }
    }

    // 2. Check Camera Controls Panel live boundary
    let controlsBounds: { left: number; right: number; top: number; bottom: number } | null = null;
    const controlsEl = document.getElementById('camera-controls-panel');
    if (controlsEl) {
      const r = controlsEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        controlsBounds = {
          left: r.left - canvasRect.left,
          right: r.right - canvasRect.left,
          top: r.top - canvasRect.top,
          bottom: r.bottom - canvasRect.top,
        };
      }
    }

    camera.getWorldDirection(camDir);

    for (const b of buildings) {
      const el = labelContainerRefs.current[b.id];
      if (!el) continue;

      const height = b.size[1];
      const labelY = height + (b.id === 'main_gate' ? 4 : b.id === 'sports_ground' ? 4 : 3);

      // Check if building position is in front of the camera
      camToObj.set(
        b.position[0] - camera.position.x,
        labelY - camera.position.y,
        b.position[2] - camera.position.z
      );

      if (camToObj.dot(camDir) <= 0) {
        // Behind camera: hide smoothly
        if (el.style.opacity !== '0') {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.visibility = 'hidden';
        }
        continue;
      }

      // Project 3D coordinates to NDC [-1, 1]
      tempVec.set(b.position[0], labelY, b.position[2]);
      tempVec.project(camera);

      // Verify camera depth bounds
      if (tempVec.z > 1 || tempVec.z < -1) {
        if (el.style.opacity !== '0') {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.visibility = 'hidden';
        }
        continue;
      }

      // Convert NDC to canvas screen pixels
      const screenX = ((tempVec.x + 1) / 2) * size.width;
      const screenY = ((-tempVec.y + 1) / 2) * size.height;

      // Label bounding box in screen coordinates
      const labelLeft = screenX - LABEL_HALF_WIDTH;
      const labelRight = screenX + LABEL_HALF_WIDTH;
      const labelTop = screenY - LABEL_HALF_HEIGHT;
      const labelBottom = screenY + LABEL_HALF_HEIGHT;

      let isObstructed = false;

      // Check intersection with A* Node Analysis Panel
      if (panelBounds) {
        const overlapsPanel = !(
          labelRight < panelBounds.left - SAFETY_BUFFER ||
          labelLeft > panelBounds.right + SAFETY_BUFFER ||
          labelBottom < panelBounds.top - SAFETY_BUFFER ||
          labelTop > panelBounds.bottom + SAFETY_BUFFER
        );
        if (overlapsPanel) {
          isObstructed = true;
        }
      }

      // Check intersection with Camera Controls Panel
      if (!isObstructed && controlsBounds) {
        const overlapsControls = !(
          labelRight < controlsBounds.left - SAFETY_BUFFER ||
          labelLeft > controlsBounds.right + SAFETY_BUFFER ||
          labelBottom < controlsBounds.top - SAFETY_BUFFER ||
          labelTop > controlsBounds.bottom + SAFETY_BUFFER
        );
        if (overlapsControls) {
          isObstructed = true;
        }
      }

      // Apply visibility state without triggering React re-renders
      if (isObstructed) {
        if (el.style.opacity !== '0') {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.visibility = 'hidden';
          el.style.transform = 'scale(0.85)';
        }
      } else {
        if (el.style.opacity !== '1') {
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
          el.style.visibility = 'visible';
          el.style.transform = 'scale(1)';
        }
      }
    }
  });

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
              zIndexRange={[15, 0]}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                ref={(el) => {
                  labelContainerRefs.current[b.id] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBuilding(b);
                }}
                style={{
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xl border backdrop-blur-md transform hover:scale-110 active:scale-95 ${
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
