import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Position3D, CameraViewMode } from '../../types';

export interface CameraControllerProps {
  viewMode: CameraViewMode;
  focusTarget: Position3D | null;
  walkerPosition?: Position3D | null;
  walkerPositionRef?: React.MutableRefObject<Position3D | null>;
  onResetComplete?: () => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  viewMode,
  focusTarget,
  walkerPosition,
  walkerPositionRef,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Desired camera state for smooth interpolation
  const targetCamPos = useRef(new THREE.Vector3(0, 95, 115));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  useEffect(() => {
    isTransitioning.current = true;

    if (viewMode === 'default') {
      targetCamPos.current.set(0, 95, 115);
      targetLookAt.current.set(0, 0, 0);
    } else if (viewMode === 'top') {
      targetCamPos.current.set(0, 140, 0.01);
      targetLookAt.current.set(0, 0, 0);
    } else if (viewMode === 'south') {
      targetCamPos.current.set(0, 40, 95);
      targetLookAt.current.set(0, 8, 25);
    } else if (viewMode === 'north') {
      targetCamPos.current.set(0, 45, -95);
      targetLookAt.current.set(0, 8, -25);
    } else if (viewMode === 'focus' && focusTarget) {
      targetCamPos.current.set(
        focusTarget[0],
        focusTarget[1] + 35,
        focusTarget[2] + 45
      );
      targetLookAt.current.set(focusTarget[0], focusTarget[1] + 2, focusTarget[2]);
    } else if (viewMode === 'follow') {
      const pos = walkerPositionRef?.current || walkerPosition;
      if (pos) {
        targetCamPos.current.set(pos[0], pos[1] + 16, pos[2] + 24);
        targetLookAt.current.set(pos[0], pos[1] + 1.2, pos[2]);
      }
    }
  }, [viewMode, focusTarget, walkerPosition, walkerPositionRef]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Follow Walker Camera Mode (smooth continuous tracking)
    if (viewMode === 'follow') {
      const pos = walkerPositionRef?.current || walkerPosition;
      if (pos) {
        targetCamPos.current.set(pos[0], pos[1] + 16, pos[2] + 24);
        targetLookAt.current.set(pos[0], pos[1] + 1.2, pos[2]);

        const followLerp = Math.min(1, delta * 3.5);
        camera.position.lerp(targetCamPos.current, followLerp);
        controlsRef.current.target.lerp(targetLookAt.current, followLerp);
        controlsRef.current.update();
        return;
      }
    }

    if (!isTransitioning.current) return;

    const lerpFactor = Math.min(1, delta * 3.5);

    camera.position.lerp(targetCamPos.current, lerpFactor);
    controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetCamPos.current) < 0.2 &&
      controlsRef.current.target.distanceTo(targetLookAt.current) < 0.2
    ) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.7}
      panSpeed={0.8}
      zoomSpeed={1.0}
      minDistance={10}
      maxDistance={220}
      maxPolarAngle={Math.PI / 2 - 0.05} // Do not dip below ground
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};

export default CameraController;
