import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { CampusBuilding } from '../../types';

interface BuildingModelProps {
  building: CampusBuilding;
  isSelectedStart: boolean;
  isSelectedDest: boolean;
  onSelect: (building: CampusBuilding) => void;
}

export const BuildingModel: React.FC<BuildingModelProps> = ({
  building,
  isSelectedStart,
  isSelectedDest,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);
  const { position, size, color, accentColor, roofType, id } = building;
  const [w, h, d] = size;

  // Visual highlight colors if selected
  const baseMaterialColor = useMemo(() => {
    if (isSelectedStart) return '#10B981'; // Green for start
    if (isSelectedDest) return '#EF4444'; // Red for destination
    if (hovered) return '#475569';
    return color;
  }, [isSelectedStart, isSelectedDest, hovered, color]);

  const emissiveColor = useMemo(() => {
    if (isSelectedStart) return '#059669';
    if (isSelectedDest) return '#DC2626';
    if (hovered) return '#334155';
    return '#000000';
  }, [isSelectedStart, isSelectedDest, hovered]);

  const emissiveIntensity = isSelectedStart || isSelectedDest ? 0.35 : hovered ? 0.15 : 0;

  // Window grid computation
  const windowRows = Math.max(1, Math.floor(h / 3));
  const windowCols = Math.max(2, Math.floor(w / 3.5));

  return (
    <group
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(building);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Concrete Base Plinth */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[w + 1.2, 0.8, d + 1.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>

      {/* Main Building Body */}
      <mesh position={[0, h / 2 + 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={baseMaterialColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Accent Corner Trims or Accent Band */}
      <mesh position={[0, h + 0.75, 0]} castShadow>
        <boxGeometry args={[w + 0.2, 0.3, d + 0.2]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Roof Styles */}
      {roofType === 'dome' && (
        <group position={[0, h + 0.8, 0]}>
          <mesh position={[0, Math.min(w, d) * 0.25, 0]} castShadow>
            <sphereGeometry
              args={[Math.min(w, d) * 0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry
              args={[Math.min(w, d) * 0.33, Math.min(w, d) * 0.35, 0.4, 16]}
            />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>
      )}

      {roofType === 'sloped' && (
        <mesh position={[0, h + 1.6, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[Math.max(w, d) * 0.55, 2.2, 4]} />
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </mesh>
      )}

      {roofType === 'flat' && (
        /* Roof Parapet & AC Utility Units */
        <group position={[0, h + 0.9, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[w - 0.4, 0.4, d - 0.4]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          {/* Small rooftop AC/hvac unit */}
          <mesh position={[w * 0.2, 0.6, -d * 0.2]} castShadow>
            <boxGeometry args={[2, 0.8, 1.8]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* Entrance Portico / Canopy facing front (positive Z) */}
      <group position={[0, 0.8, d / 2 + 0.8]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[Math.min(6, w * 0.5), 0.3, 1.8]} />
          <meshStandardMaterial color={accentColor} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[-Math.min(2.5, w * 0.22), 0.9, 0.6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 8]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[Math.min(2.5, w * 0.22), 0.9, 0.6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 8]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        {/* Entrance Doorway glass */}
        <mesh position={[0, 0.9, -0.75]}>
          <planeGeometry args={[Math.min(3.2, w * 0.3), 1.7]} />
          <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Special Building Identifier Signs */}
      {id === 'medical_center' && (
        <group position={[0, h + 1.8, 0]}>
          {/* Red Cross Symbol on Medical Center */}
          <mesh position={[0, 0, d / 2 + 0.05]}>
            <boxGeometry args={[1.8, 0.5, 0.1]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, d / 2 + 0.05]}>
            <boxGeometry args={[0.5, 1.8, 0.1]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {/* Decorative Façade Windows (front & back) */}
      {windowRows > 0 &&
        Array.from({ length: windowRows }).map((_, rIdx) => {
          const yPos = 2.2 + rIdx * 2.4;
          if (yPos > h - 0.8) return null;
          return Array.from({ length: windowCols }).map((_, cIdx) => {
            const xPos = -w / 2 + 1.8 + cIdx * ((w - 3.6) / Math.max(1, windowCols - 1));
            return (
              <mesh key={`win-front-${rIdx}-${cIdx}`} position={[xPos, yPos, d / 2 + 0.03]}>
                <planeGeometry args={[1.2, 1.0]} />
                <meshStandardMaterial
                  color="#93C5FD"
                  roughness={0.1}
                  metalness={0.8}
                  emissive="#60A5FA"
                  emissiveIntensity={0.15}
                />
              </mesh>
            );
          });
        })}

      {/* Ground Selection Ring if Selected */}
      {(isSelectedStart || isSelectedDest) && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.7, Math.max(w, d) * 0.78, 32]} />
          <meshBasicMaterial
            color={isSelectedStart ? '#10B981' : '#EF4444'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  );
};

export interface BuildingsProps {
  buildings: CampusBuilding[];
  selectedStartBuildingId: string | null;
  selectedDestBuildingId: string | null;
  onSelectBuilding: (building: CampusBuilding) => void;
}

export const Buildings: React.FC<BuildingsProps> = ({
  buildings,
  selectedStartBuildingId,
  selectedDestBuildingId,
  onSelectBuilding,
}) => {
  return (
    <group name="campus-buildings">
      {buildings.map((building) => {
        // Special rendering for sports ground (turf + running track)
        if (building.id === 'sports_ground') {
          return (
            <group
              key={building.id}
              position={[building.position[0], 0.05, building.position[2]]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBuilding(building);
              }}
            >
              {/* Outer Synthetic Track (Terracotta red) */}
              <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[26, 22]} />
                <meshStandardMaterial color="#B91C1C" roughness={0.9} />
              </mesh>
              {/* Inner Soccer Turf (Lush green) */}
              <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[18, 14]} />
                <meshStandardMaterial color="#15803D" roughness={0.8} />
              </mesh>
              {/* Goalposts */}
              <mesh position={[-8, 0.8, 0]}>
                <boxGeometry args={[0.2, 1.4, 3.2]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[8, 0.8, 0]}>
                <boxGeometry args={[0.2, 1.4, 3.2]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              {/* Spectator Bleachers / Pavilion */}
              <mesh position={[0, 1.2, -12]} castShadow receiveShadow>
                <boxGeometry args={[20, 2.2, 3]} />
                <meshStandardMaterial color="#334155" roughness={0.7} />
              </mesh>
            </group>
          );
        }

        // Special rendering for Central Quad (Plaza with centerpiece fountain/sculpture)
        if (building.id === 'central_quad') {
          return (
            <group
              key={building.id}
              position={[building.position[0], 0.05, building.position[2]]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBuilding(building);
              }}
            >
              {/* Circular Plaza Pavement */}
              <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[9, 32]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
              </mesh>
              {/* Inner Green Lawn Ring */}
              <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[4.2, 8.2, 32]} />
                <meshStandardMaterial color="#166534" roughness={0.9} />
              </mesh>
              {/* Centerpiece Fountain / Monument */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[3, 3.4, 0.8, 24]} />
                <meshStandardMaterial color="#64748B" roughness={0.5} />
              </mesh>
              {/* Water surface */}
              <mesh position={[0, 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2.7, 24]} />
                <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.8} />
              </mesh>
              {/* Central Monument Obelisk */}
              <mesh position={[0, 2.8, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.7, 4.2, 4]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.4} />
              </mesh>
            </group>
          );
        }

        // Special rendering for Main Gate (Grand Entrance Arch & Pillars)
        if (building.id === 'main_gate') {
          return (
            <group
              key={building.id}
              position={[building.position[0], 0, building.position[2]]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBuilding(building);
              }}
            >
              {/* Left Pillar */}
              <mesh position={[-6.5, 3.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.5, 7, 2.5]} />
                <meshStandardMaterial color="#1E293B" roughness={0.6} />
              </mesh>
              {/* Right Pillar */}
              <mesh position={[6.5, 3.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.5, 7, 2.5]} />
                <meshStandardMaterial color="#1E293B" roughness={0.6} />
              </mesh>
              {/* Overhead Grand Arch Beam */}
              <mesh position={[0, 7.2, 0]} castShadow>
                <boxGeometry args={[16, 1.4, 3]} />
                <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.2} />
              </mesh>
              {/* Security Guard Booth */}
              <mesh position={[9.5, 1.8, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.8, 3.6, 3]} />
                <meshStandardMaterial color="#334155" roughness={0.7} />
              </mesh>
              {/* Vehicle Boom Barrier (Red/White stripes) */}
              <mesh position={[-2.5, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 4.5, 8]} />
                <meshStandardMaterial color="#EF4444" />
              </mesh>
            </group>
          );
        }

        // Standard 3D Building model
        return (
          <BuildingModel
            key={building.id}
            building={building}
            isSelectedStart={selectedStartBuildingId === building.id}
            isSelectedDest={selectedDestBuildingId === building.id}
            onSelect={onSelectBuilding}
          />
        );
      })}
    </group>
  );
};

// Aliases for compatibility
export const BuildingsGroup = Buildings;
export default Buildings;
