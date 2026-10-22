import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Position3D, WalkerProgress } from '../../types';

export interface WalkingCharacterProps {
  routeCoordinates: Position3D[];
  isActive: boolean;
  walkingSpeedUnitsPerSec?: number;
  scaleFactor?: number;
  walkingSpeedMetersPerSec?: number;
  onProgress?: (progress: WalkerProgress) => void;
  onPositionChange?: (pos: Position3D) => void;
  onArrived?: () => void;
}

export const WalkingCharacter: React.FC<WalkingCharacterProps> = ({
  routeCoordinates,
  isActive,
  walkingSpeedUnitsPerSec = 8.5, // Smooth traversal speed in 3D campus units
  scaleFactor = 10, // ~10m per 3D unit
  walkingSpeedMetersPerSec = 1.4,
  onProgress,
  onPositionChange,
  onArrived,
}) => {
  // Stable refs for callbacks to avoid re-triggering useEffect
  const onProgressRef = useRef(onProgress);
  const onPositionChangeRef = useRef(onPositionChange);
  const onArrivedRef = useRef(onArrived);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onPositionChangeRef.current = onPositionChange;
    onArrivedRef.current = onArrived;
  });

  // Group and mesh refs for 3D procedural locomotion animation
  const mainGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);

  // Traversal state
  const [isArrivedState, setIsArrivedState] = useState<boolean>(false);
  const segmentProgressRef = useRef<number>(0);
  const currentSegmentIndexRef = useRef<number>(0);
  const currentPosRef = useRef<Position3D>([0, 0, 0]);
  const currentRotationY = useRef<number>(0);
  const targetRotationY = useRef<number>(0);
  const walkCycleTime = useRef<number>(0);
  const hasTriggeredArrival = useRef<boolean>(false);
  const throttleTimeRef = useRef<number>(0);
  const lastPercentRef = useRef<number>(-1);

  // Cumulative segment distances along the route
  const { segmentDistances, totalRouteDistance } = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) {
      return { segmentDistances: [], totalRouteDistance: 0 };
    }

    const dists: number[] = [];
    let total = 0;
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const p1 = routeCoordinates[i];
      const p2 = routeCoordinates[i + 1];
      const dist = Math.hypot(p2[0] - p1[0], p2[2] - p1[2]);
      dists.push(Math.max(0.01, dist));
      total += dist;
    }
    return { segmentDistances: dists, totalRouteDistance: total };
  }, [routeCoordinates]);

  // Unique signature for the route - only resets when the route itself changes!
  const routeSignature = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) return '';
    return routeCoordinates
      .map((p) => `${p[0].toFixed(1)},${p[2].toFixed(1)}`)
      .join('>');
  }, [routeCoordinates]);

  // Reset when route coordinates or active state change
  useEffect(() => {
    if (!isActive || !routeSignature || routeCoordinates.length < 2) {
      setIsArrivedState(false);
      hasTriggeredArrival.current = false;
      return;
    }

    const start = routeCoordinates[0];
    currentPosRef.current = [start[0], start[1], start[2]];
    segmentProgressRef.current = 0;
    currentSegmentIndexRef.current = 0;
    setIsArrivedState(false);
    hasTriggeredArrival.current = false;
    walkCycleTime.current = 0;
    lastPercentRef.current = 0;
    throttleTimeRef.current = 0;

    if (mainGroupRef.current) {
      mainGroupRef.current.position.set(start[0], 0, start[2]);
    }

    // Initial orientation towards first target waypoint
    const p2 = routeCoordinates[1];
    const dx = p2[0] - start[0];
    const dz = p2[2] - start[2];
    const initialAngle = Math.atan2(dx, dz);
    currentRotationY.current = initialAngle;
    targetRotationY.current = initialAngle;
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y = initialAngle;
    }

    onPositionChangeRef.current?.([start[0], start[1], start[2]]);

    const totalMeters = Math.round(totalRouteDistance * scaleFactor);
    const totalMinutes = Math.max(1, Math.round(totalMeters / walkingSpeedMetersPerSec / 60));

    onProgressRef.current?.({
      currentSegment: 1,
      totalSegments: routeCoordinates.length - 1,
      progressRatio: 0,
      remainingDistance: totalMeters,
      remainingTimeMinutes: totalMinutes,
      currentPosition: [start[0], 0, start[2]],
      isWalking: true,
      isArrived: false,
    });
  }, [routeSignature, isActive, totalRouteDistance, scaleFactor, walkingSpeedMetersPerSec, routeCoordinates]);

  // Animation frame: move smoothly along waypoints and animate limbs
  useFrame((_, delta) => {
    if (!isActive || !routeCoordinates || routeCoordinates.length < 2) return;

    const totalSegs = routeCoordinates.length - 1;
    let segIdx = currentSegmentIndexRef.current;

    // Check if arrived at final destination
    if (segIdx >= totalSegs) {
      if (!hasTriggeredArrival.current) {
        hasTriggeredArrival.current = true;
        setIsArrivedState(true);
        onArrivedRef.current?.();

        const lastP = routeCoordinates[totalSegs];
        onProgressRef.current?.({
          currentSegment: totalSegs,
          totalSegments: totalSegs,
          progressRatio: 1,
          remainingDistance: 0,
          remainingTimeMinutes: 0,
          currentPosition: [lastP[0], 0, lastP[2]],
          isWalking: false,
          isArrived: true,
        });
      }

      // Idle pose when arrived: smoothly reset limbs
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 8);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 8);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, delta * 8);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, delta * 8);
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.9 + Math.sin(walkCycleTime.current * 1.5) * 0.02;
        walkCycleTime.current += delta;
      }
      return;
    }

    const segDist = segmentDistances[segIdx] || 1;
    const progressInc = (delta * walkingSpeedUnitsPerSec) / segDist;
    segmentProgressRef.current += progressInc;

    // Advance to next segment if reached waypoint
    while (segmentProgressRef.current >= 1.0 && segIdx < totalSegs) {
      segmentProgressRef.current -= 1.0;
      segIdx++;
      currentSegmentIndexRef.current = segIdx;
      if (segIdx >= totalSegs) {
        segmentProgressRef.current = 1.0;
        break;
      }
    }

    // Calculate interpolated position
    let posX = 0;
    let posZ = 0;
    if (segIdx < totalSegs) {
      const p1 = routeCoordinates[segIdx];
      const p2 = routeCoordinates[segIdx + 1];
      const t = Math.min(1, Math.max(0, segmentProgressRef.current));

      posX = p1[0] + (p2[0] - p1[0]) * t;
      posZ = p1[2] + (p2[2] - p1[2]) * t;

      // Face toward current destination waypoint
      const dx = p2[0] - p1[0];
      const dz = p2[2] - p1[2];
      targetRotationY.current = Math.atan2(dx, dz);
    } else {
      const lastP = routeCoordinates[routeCoordinates.length - 1];
      posX = lastP[0];
      posZ = lastP[2];
    }

    currentPosRef.current = [posX, 0, posZ];

    // Smooth rotation slerp
    let diff = targetRotationY.current - currentRotationY.current;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    currentRotationY.current += diff * Math.min(1, delta * 12);

    if (mainGroupRef.current) {
      mainGroupRef.current.position.set(posX, 0, posZ);
      mainGroupRef.current.rotation.y = currentRotationY.current;
    }

    // Procedural walking animation (Legs and arms swing)
    walkCycleTime.current += delta * (walkingSpeedUnitsPerSec * 1.5);
    const swing = Math.sin(walkCycleTime.current);
    const bounce = Math.abs(Math.sin(walkCycleTime.current)) * 0.08;

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = swing * 0.55;
      rightLegRef.current.rotation.x = -swing * 0.55;
    }
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -swing * 0.45;
      rightArmRef.current.rotation.x = swing * 0.45;
    }
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.9 + bounce;
    }

    // Report position change to camera tracker
    onPositionChangeRef.current?.([posX, 0, posZ]);

    // Throttled progress report to React UI
    throttleTimeRef.current += delta;
    if (totalRouteDistance > 0 && throttleTimeRef.current >= 0.1) {
      throttleTimeRef.current = 0;

      let distCovered = 0;
      for (let i = 0; i < segIdx; i++) {
        distCovered += segmentDistances[i];
      }
      if (segIdx < totalSegs) {
        distCovered += segmentDistances[segIdx] * segmentProgressRef.current;
      } else {
        distCovered = totalRouteDistance;
      }

      const ratio = Math.min(1, Math.max(0, distCovered / totalRouteDistance));
      const currentPercent = Math.floor(ratio * 100);

      if (currentPercent !== lastPercentRef.current || segIdx >= totalSegs) {
        lastPercentRef.current = currentPercent;
        const remainingUnits = Math.max(0, totalRouteDistance - distCovered);
        const remainingMeters = Math.round(remainingUnits * scaleFactor);
        const remainingSecs = remainingMeters / walkingSpeedMetersPerSec;
        const remainingMins = Math.max(1, Math.round(remainingSecs / 60));

        onProgressRef.current?.({
          currentSegment: segIdx + 1,
          totalSegments: totalSegs,
          progressRatio: ratio,
          remainingDistance: remainingMeters,
          remainingTimeMinutes: remainingMins,
          currentPosition: [posX, 0, posZ],
          isWalking: segIdx < totalSegs,
          isArrived: segIdx >= totalSegs,
        });
      }
    }
  });

  if (!isActive || !routeCoordinates || routeCoordinates.length < 2) {
    return null;
  }

  return (
    <group ref={mainGroupRef} name="walking-avatar">
      {/* Soft Ground Contact Shadow */}
      <mesh ref={shadowRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* Ground Navigation Beacon Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.85, 24]} />
        <meshBasicMaterial
          color={isArrivedState ? '#10B981' : '#00F0FF'}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Body Hierarchy */}
      <group ref={bodyRef} position={[0, 0.9, 0]}>
        {/* Torso: Modern Campus Hoodie/Jacket */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.65, 0.75, 0.4]} />
          <meshStandardMaterial color="#2563EB" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Backpack */}
        <mesh position={[0, 0.58, -0.28]} castShadow>
          <boxGeometry args={[0.45, 0.55, 0.22]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#FED7AA" roughness={0.5} />
        </mesh>

        {/* Stylized Cap / Hair */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.27, 0.29, 0.14, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} />
        </mesh>
        {/* Cap Visor */}
        <mesh position={[0, 1.28, 0.25]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.34, 0.04, 0.22]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>

        {/* Left Arm */}
        <mesh ref={leftArmRef} position={[-0.42, 0.45, 0]} castShadow>
          <boxGeometry args={[0.16, 0.65, 0.16]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.4} />
        </mesh>

        {/* Right Arm */}
        <mesh ref={rightArmRef} position={[0.42, 0.45, 0]} castShadow>
          <boxGeometry args={[0.16, 0.65, 0.16]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.4} />
        </mesh>
      </group>

      {/* Left Leg & Shoe */}
      <mesh ref={leftLegRef} position={[-0.18, 0.42, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.6} />
      </mesh>

      {/* Right Leg & Shoe */}
      <mesh ref={rightLegRef} position={[0.18, 0.42, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.6} />
      </mesh>

      {/* Subtle Floating "You" Badge */}
      <Html position={[0, 2.7, 0]} center distanceFactor={60}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg border backdrop-blur-md transition-all duration-300 ${
              isArrivedState
                ? 'bg-emerald-600/90 text-white border-emerald-300 shadow-emerald-500/50'
                : 'bg-cyan-600/90 text-white border-cyan-300 shadow-cyan-500/50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${
                isArrivedState ? 'bg-white' : 'bg-white animate-ping'
              }`}
            />
            <span>{isArrivedState ? 'Arrived!' : 'You'}</span>
          </div>
          <div
            className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
              isArrivedState ? 'border-t-emerald-600' : 'border-t-cyan-600'
            }`}
          />
        </div>
      </Html>
    </group>
  );
};

export default WalkingCharacter;
