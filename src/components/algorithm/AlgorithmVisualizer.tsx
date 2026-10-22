import React from 'react';
import { AStarStep } from '../../types';
import { CampusGraph } from '../../algorithms/graph';

export interface AlgorithmVisualizerProps {
  graph: CampusGraph;
  explorationSteps: AStarStep[];
  currentStepIndex: number;
  isSearching: boolean;
  showSearchAnimation: boolean;
}

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  graph,
  explorationSteps,
  currentStepIndex,
  isSearching,
  showSearchAnimation,
}) => {
  if (!showSearchAnimation || explorationSteps.length === 0) {
    return null;
  }

  // Slice steps up to current step index
  const visibleSteps = explorationSteps.slice(0, currentStepIndex + 1);

  return (
    <group name="a-star-search-visualizer">
      {visibleSteps.map((step, idx) => {
        const pos = graph.getNodePosition(step.nodeId);
        if (!pos) return null;

        const isCurrent = idx === visibleSteps.length - 1 && isSearching;

        return (
          <group key={`search-node-${step.nodeId}-${idx}`} position={[pos[0], 0.3, pos[2]]}>
            {/* Ground Disc Marker */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[isCurrent ? 1.6 : 0.9, 16]} />
              <meshBasicMaterial
                color={isCurrent ? '#EAB308' : '#3B82F6'}
                transparent
                opacity={isCurrent ? 0.9 : 0.55}
              />
            </mesh>

            {/* Glowing 3D Node Sphere */}
            <mesh position={[0, isCurrent ? 1.2 : 0.6, 0]}>
              <sphereGeometry args={[isCurrent ? 0.7 : 0.35, 12, 12]} />
              <meshStandardMaterial
                color={isCurrent ? '#FDE047' : '#60A5FA'}
                emissive={isCurrent ? '#EAB308' : '#2563EB'}
                emissiveIntensity={isCurrent ? 1.5 : 0.8}
                roughness={0.2}
              />
            </mesh>

            {/* If node has a parent, draw light connector ray back to parent node */}
            {step.parent && (
              (() => {
                const parentPos = graph.getNodePosition(step.parent);
                if (!parentPos) return null;
                return (
                  <line>
                    <bufferGeometry>
                      <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        array={new Float32Array([
                          0, 0.4, 0,
                          parentPos[0] - pos[0], 0.4, parentPos[2] - pos[2]
                        ])}
                        itemSize={3}
                      />
                    </bufferGeometry>
                    <lineBasicMaterial color="#60A5FA" transparent opacity={0.4} />
                  </line>
                );
              })()
            )}
          </group>
        );
      })}
    </group>
  );
};

export const SearchNodeVisualizer = AlgorithmVisualizer;
export default AlgorithmVisualizer;
