import React, { useMemo } from 'react';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  type?: 'round' | 'cone';
}

const Tree: React.FC<TreeProps> = ({ position, scale = 1, type = 'round' }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Brown Wooden Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 2.4, 6]} />
        <meshStandardMaterial color="#4A2F1B" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      {type === 'round' ? (
        <group position={[0, 2.8, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1.5, 7, 7]} />
            <meshStandardMaterial color="#15803D" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[1.1, 6, 6]} />
            <meshStandardMaterial color="#16A34A" roughness={0.8} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 2.6, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <coneGeometry args={[1.6, 2.4, 6]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <coneGeometry args={[1.2, 2.0, 6]} />
            <meshStandardMaterial color="#15803D" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const CampusEnvironment: React.FC = () => {
  // Pre-calculated tree placements across the fictional campus
  const treePositions = useMemo<Array<{ pos: [number, number, number]; scale: number; type: 'round' | 'cone' }>>(() => [
    // Main Avenue tree-lined boulevard (South)
    { pos: [-6.5, 0, 60], scale: 1.1, type: 'cone' },
    { pos: [6.5, 0, 60], scale: 1.1, type: 'cone' },
    { pos: [-6.5, 0, 48], scale: 1.2, type: 'round' },
    { pos: [6.5, 0, 48], scale: 1.2, type: 'round' },
    { pos: [-6.5, 0, 36], scale: 1.0, type: 'cone' },
    { pos: [6.5, 0, 36], scale: 1.0, type: 'cone' },

    // Central Quad lawn perimeter
    { pos: [-10, 0, -8], scale: 1.2, type: 'round' },
    { pos: [10, 0, -8], scale: 1.3, type: 'round' },
    { pos: [-10, 0, 8], scale: 1.1, type: 'cone' },
    { pos: [10, 0, 8], scale: 1.2, type: 'cone' },
    { pos: [-6, 0, -12], scale: 0.9, type: 'round' },
    { pos: [6, 0, -12], scale: 1.0, type: 'round' },

    // Near Library & East Park
    { pos: [22, 0, -2], scale: 1.2, type: 'round' },
    { pos: [24, 0, 18], scale: 1.1, type: 'cone' },
    { pos: [44, 0, 22], scale: 1.3, type: 'round' },

    // Near CS Block & West lawn
    { pos: [-22, 0, 0], scale: 1.1, type: 'round' },
    { pos: [-24, 0, -8], scale: 1.2, type: 'cone' },
    { pos: [-44, 0, 24], scale: 1.3, type: 'cone' },

    // Near Canteen & SAC
    { pos: [-6, 0, -32], scale: 1.0, type: 'round' },
    { pos: [-24, 0, -30], scale: 1.2, type: 'round' },
    { pos: [-6, 0, -42], scale: 1.1, type: 'cone' },

    // Sports Ground perimeter
    { pos: [20, 0, -66], scale: 1.3, type: 'cone' },
    { pos: [34, 0, -68], scale: 1.2, type: 'cone' },
    { pos: [48, 0, -66], scale: 1.3, type: 'round' },
    { pos: [48, 0, -42], scale: 1.1, type: 'cone' },

    // North Gate greenery
    { pos: [-6, 0, -64], scale: 1.2, type: 'round' },
    { pos: [6, 0, -64], scale: 1.2, type: 'round' },
  ], []);

  // Street light positions
  const streetLightPositions: [number, number, number][] = [
    [-5.5, 0, 56],
    [5.5, 0, 56],
    [-5.5, 0, 40],
    [5.5, 0, 40],
    [0, 0, 12],
    [15, 0, 0],
    [-15, 0, 0],
    [0, 0, -14],
    [18, 0, 22],
    [-18, 0, 22],
  ];

  return (
    <group name="campus-environment">
      {/* Ambient Lighting */}
      <ambientLight intensity={0.7} color="#CADCFC" />

      {/* Primary Directional Sunlight with Shadows */}
      <directionalLight
        position={[60, 90, 50]}
        intensity={1.2}
        color="#FFFBEB"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={250}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0005}
      />

      {/* Fill Light for subtle shadow depth */}
      <directionalLight position={[-50, 40, -40]} intensity={0.4} color="#60A5FA" />

      {/* Sky/Atmosphere Tint */}
      <hemisphereLight args={['#38BDF8', '#0F172A', 0.5]} />

      {/* Render Campus Trees */}
      {treePositions.map((t, index) => (
        <Tree key={`tree-${index}`} position={t.pos} scale={t.scale} type={t.type} />
      ))}

      {/* Render Low-Poly Street Lamps */}
      {streetLightPositions.map((pos, idx) => (
        <group key={`lamp-${idx}`} position={pos}>
          {/* Lamp post pole */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 3.6, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Lamp head */}
          <mesh position={[0, 3.7, 0]}>
            <sphereGeometry args={[0.28, 8, 8]} />
            <meshStandardMaterial
              color="#FDE047"
              emissive="#FDE047"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default CampusEnvironment;
