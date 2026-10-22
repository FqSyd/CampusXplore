import React from 'react';
import { CampusObstacle } from '../../types';
import { Html } from '@react-three/drei';

interface ObstaclesProps {
  obstacles: CampusObstacle[];
  activeObstacleIds: Set<string>;
  showLabels?: boolean;
}

export const Obstacles: React.FC<ObstaclesProps> = ({
  obstacles,
  activeObstacleIds,
  showLabels = false,
}) => {
  const activeObstacles = obstacles.filter((o) => activeObstacleIds.has(o.id));

  if (activeObstacles.length === 0) return null;

  return (
    <group name="active-obstacles-3d">
      {activeObstacles.map((obs) => {
        const centerX = (obs.bounds.minX + obs.bounds.maxX) / 2;
        const centerZ = (obs.bounds.minZ + obs.bounds.maxZ) / 2;
        const width = obs.bounds.maxX - obs.bounds.minX;
        const depth = obs.bounds.maxZ - obs.bounds.minZ;
        const isDynamicBarricade = obs.isDynamic;

        return (
          <group key={`obs-3d-${obs.id}`} position={[centerX, 0, centerZ]}>
            {/* Ground Hazard Stripe Decal */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
              <planeGeometry args={[width, depth]} />
              <meshBasicMaterial color="#DC2626" transparent opacity={0.35} />
            </mesh>

            {/* Construction Roadblock Barricade for dynamic closures */}
            {isDynamicBarricade && (
              <group position={[0, 0.7, 0]}>
                {/* Main crossbeam with hazard stripes */}
                <mesh castShadow>
                  <boxGeometry args={[Math.min(5, width * 0.9), 0.5, 0.2]} />
                  <meshStandardMaterial color="#F97316" roughness={0.4} />
                </mesh>
                {/* Left barricade leg */}
                <mesh position={[-Math.min(2.2, width * 0.4), -0.35, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                {/* Right barricade leg */}
                <mesh position={[Math.min(2.2, width * 0.4), -0.35, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                {/* Flashing Amber Warning Beacon */}
                <mesh position={[0, 0.4, 0]}>
                  <sphereGeometry args={[0.18, 8, 8]} />
                  <meshStandardMaterial
                    color="#F59E0B"
                    emissive="#F59E0B"
                    emissiveIntensity={1.5}
                  />
                </mesh>
              </group>
            )}

            {/* Subtle floating badge only for active dynamic barricades if showLabels enabled */}
            {showLabels && isDynamicBarricade && (
              <Html position={[0, 1.8, 0]} center distanceFactor={80}>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-600/90 text-white font-semibold text-[9px] uppercase tracking-wider shadow-md border border-amber-400 pointer-events-none select-none">
                  <span>🚧 Roadblock</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

export const ObstacleVisualizer3D = Obstacles;
export default Obstacles;
