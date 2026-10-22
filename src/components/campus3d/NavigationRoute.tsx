import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Position3D } from '../../types';

export interface NavigationRouteProps {
  coordinates: Position3D[];
  visible: boolean;
  color?: string;
  glowColor?: string;
}

export const NavigationRoute: React.FC<NavigationRouteProps> = ({
  coordinates,
  visible,
  color = '#00F0FF',
  glowColor = '#3B82F6',
}) => {
  const pulseSphereRef = useRef<THREE.Mesh>(null);

  // Generate 3D curve from coordinates elevated slightly above roads (y = 0.5)
  const { curve, tubeGeometry, points } = useMemo(() => {
    if (!coordinates || coordinates.length < 2) {
      return { curve: null, tubeGeometry: null, points: [] };
    }

    const pts = coordinates.map(
      (pos) => new THREE.Vector3(pos[0], pos[1] + 0.45, pos[2])
    );

    // Create smooth CatmullRom curve connecting path waypoints
    const catmullCurve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.15);
    const geometry = new THREE.TubeGeometry(catmullCurve, Math.max(30, pts.length * 15), 0.35, 8, false);

    return { curve: catmullCurve, tubeGeometry: geometry, points: pts };
  }, [coordinates]);

  // Animate a pulsing energy orb traveling down the route
  useFrame((state) => {
    if (!curve || !pulseSphereRef.current || !visible) return;
    const t = (state.clock.getElapsedTime() * 0.4) % 1; // 0 to 1 progress
    const point = curve.getPointAt(t);
    pulseSphereRef.current.position.copy(point);
  });

  if (!visible || !tubeGeometry || !curve) {
    return null;
  }

  return (
    <group name="a-star-navigation-route">
      {/* Outer Glowing Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={glowColor}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Core Bright Wireframe / Thin Beam */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Animated Traveling Energy Orb */}
      <mesh ref={pulseSphereRef}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#38BDF8"
          emissiveIntensity={2.0}
          roughness={0.1}
        />
        {/* Glow halo around orb */}
        <pointLight color="#38BDF8" intensity={2} distance={8} decay={2} />
      </mesh>

      {/* Path Waypoint Nodes (small glowing discs along route) */}
      {points.map((pt, i) => (
        <mesh key={`wp-${i}`} position={[pt.x, pt.y - 0.25, pt.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 16]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

export const RouteLine = NavigationRoute;
export default NavigationRoute;
