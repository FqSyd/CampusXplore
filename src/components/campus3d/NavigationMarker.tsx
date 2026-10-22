import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Position3D } from '../../types';

export interface MarkerProps {
  position: Position3D;
  label?: string;
}

export const StartMarker: React.FC<MarkerProps> = ({ position, label = 'START' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating bob
      groupRef.current.position.y = position[1] + 2.8 + Math.sin(t * 3) * 0.4;
    }
    if (ringRef.current) {
      // Expanding pulsing ground ring
      const scale = 1 + (Math.sin(t * 4) * 0.2 + 0.2);
      ringRef.current.scale.set(scale, scale, 1);
    }
    if (pinRef.current) {
      pinRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Ground Glowing Rings */}
      <mesh ref={ringRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#059669" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Marker Pin & Gem */}
      <group ref={groupRef} position={[0, 2.8, 0]}>
        {/* Diamond / Octahedron Beacon */}
        <mesh ref={pinRef} castShadow>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#34D399"
            emissive="#10B981"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Vertical light beam / needle pointer */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.08, 0.02, 2.0, 8]} />
          <meshBasicMaterial color="#6EE7B7" transparent opacity={0.9} />
        </mesh>

        {/* High-visibility 3D HTML Badge */}
        <Html position={[0, 1.3, 0]} center distanceFactor={70}>
          <div className="flex flex-col items-center pointer-events-none select-none">
            <div className="bg-emerald-600/95 border-2 border-emerald-300 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-lg shadow-emerald-500/50 flex items-center gap-1.5 whitespace-nowrap animate-bounce">
              <span className="w-2 h-2 rounded-full bg-white inline-block animate-ping"></span>
              {label}
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-emerald-600"></div>
          </div>
        </Html>
      </group>
    </group>
  );
};

export const DestinationMarker: React.FC<MarkerProps> = ({ position, label = 'DESTINATION' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + 3.0 + Math.sin(t * 3.2 + 1) * 0.4;
    }
    if (ringRef.current) {
      const scale = 1 + (Math.sin(t * 4.5) * 0.25 + 0.25);
      ringRef.current.scale.set(scale, scale, 1);
    }
    if (pinRef.current) {
      pinRef.current.rotation.y = -t * 1.8;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Ground Glowing Rings */}
      <mesh ref={ringRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#B91C1C" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Marker Pin & Gem */}
      <group ref={groupRef} position={[0, 3.0, 0]}>
        {/* Diamond / Octahedron Beacon */}
        <mesh ref={pinRef} castShadow>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#F87171"
            emissive="#EF4444"
            emissiveIntensity={0.85}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Vertical light beam / needle pointer */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.08, 0.02, 2.2, 8]} />
          <meshBasicMaterial color="#FCA5A5" transparent opacity={0.9} />
        </mesh>

        {/* High-visibility 3D HTML Badge */}
        <Html position={[0, 1.3, 0]} center distanceFactor={70}>
          <div className="flex flex-col items-center pointer-events-none select-none">
            <div className="bg-rose-600/95 border-2 border-rose-300 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-lg shadow-rose-500/50 flex items-center gap-1.5 whitespace-nowrap animate-bounce">
              <span className="w-2 h-2 rounded-full bg-white inline-block animate-ping"></span>
              {label}
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-rose-600"></div>
          </div>
        </Html>
      </group>
    </group>
  );
};

export interface NavigationMarkerProps extends MarkerProps {
  type: 'start' | 'destination';
}

export const NavigationMarker: React.FC<NavigationMarkerProps> = ({ type, ...props }) => {
  return type === 'start' ? <StartMarker {...props} /> : <DestinationMarker {...props} />;
};

export default NavigationMarker;
