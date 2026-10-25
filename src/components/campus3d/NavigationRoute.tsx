import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Position3D, RouteNodeAnalysis } from '../../types';

export interface NavigationRouteProps {
  coordinates: Position3D[];
  visible: boolean;
  color?: string;
  glowColor?: string;
  routeNodes?: RouteNodeAnalysis[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
}

export const NavigationRoute: React.FC<NavigationRouteProps> = ({
  coordinates,
  visible,
  color = '#00F0FF',
  glowColor = '#3B82F6',
  routeNodes = [],
  selectedNodeId = null,
  onSelectNode,
}) => {
  const pulseSphereRef = useRef<THREE.Mesh>(null);
  const selectedHaloRef = useRef<THREE.Mesh>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
    const tClock = state.clock.getElapsedTime();
    if (curve && pulseSphereRef.current && visible) {
      const t = (tClock * 0.4) % 1; // 0 to 1 progress
      const point = curve.getPointAt(t);
      pulseSphereRef.current.position.copy(point);
    }

    if (selectedHaloRef.current) {
      const scale = 1 + Math.sin(tClock * 5) * 0.15;
      selectedHaloRef.current.scale.set(scale, scale, 1);
    }
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

      {/* Interactive Path Waypoint Nodes (circular points along the calculated route) */}
      {points.map((pt, i) => {
        const nodeData = routeNodes[i];
        const nodeId = nodeData?.nodeId;
        const isSelected = !!nodeId && nodeId === selectedNodeId;
        const isHovered = hoveredIdx === i;

        return (
          <group
            key={`wp-node-${nodeId || i}`}
            position={[pt.x, pt.y - 0.25, pt.z]}
          >
            {/* Clickable Waypoint Disc */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (nodeId && onSelectNode) {
                  onSelectNode(nodeId);
                }
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
                setHoveredIdx(i);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
                setHoveredIdx(null);
              }}
            >
              <circleGeometry args={[isSelected ? 1.0 : isHovered ? 0.8 : 0.6, 24]} />
              <meshStandardMaterial
                color={isSelected ? '#FBBF24' : isHovered ? '#67E8F9' : '#00F0FF'}
                emissive={isSelected ? '#F59E0B' : isHovered ? '#22D3EE' : '#00F0FF'}
                emissiveIntensity={isSelected ? 2.5 : isHovered ? 1.8 : 0.9}
                roughness={0.2}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Selected Waypoint Halo & Marker Pin */}
            {isSelected && (
              <group>
                <mesh
                  ref={selectedHaloRef}
                  position={[0, 0.05, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <ringGeometry args={[1.1, 1.6, 24]} />
                  <meshBasicMaterial
                    color="#F59E0B"
                    transparent
                    opacity={0.7}
                    side={THREE.DoubleSide}
                  />
                </mesh>

                {/* Floating Waypoint Floating HTML Badge */}
                {nodeData && (
                  <Html position={[0, 2.2, 0]} center distanceFactor={24}>
                    <div className="pointer-events-none select-none bg-slate-950/90 border border-amber-400 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5 animate-bounce">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>{nodeData.nodeName}: f={nodeData.f}m (g={nodeData.g} + h={nodeData.h})</span>
                    </div>
                  </Html>
                )}
              </group>
            )}

            {/* Hovered Waypoint Tooltip */}
            {isHovered && !isSelected && nodeData && (
              <Html position={[0, 1.5, 0]} center distanceFactor={28}>
                <div className="pointer-events-none select-none bg-slate-900/90 border border-cyan-400 text-cyan-200 font-mono text-[9px] font-semibold px-2 py-0.5 rounded-lg shadow-md whitespace-nowrap">
                  {nodeData.nodeName} • Click for A* calculation
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

export const RouteLine = NavigationRoute;
export default NavigationRoute;
