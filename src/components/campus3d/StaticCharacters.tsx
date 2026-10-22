import React from 'react';

interface StudentProps {
  position: [number, number, number];
  rotationY?: number;
  hoodieColor?: string;
  pantsColor?: string;
  action?: 'standing' | 'sitting' | 'reading';
}

const StudentFigure: React.FC<StudentProps> = ({
  position,
  rotationY = 0,
  hoodieColor = '#F97316',
  pantsColor = '#1E293B',
  action = 'standing',
}) => {
  const isSitting = action === 'sitting' || action === 'reading';

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Contact Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, isSitting ? 0.95 : 1.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial color={hoodieColor} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, isSitting ? 1.45 : 1.75, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#FED7AA" roughness={0.5} />
      </mesh>

      {/* Legs */}
      {isSitting ? (
        // Seated pose
        <group position={[0, 0.55, 0.2]}>
          <mesh position={[-0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.16, 0.45, 0.16]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.16, 0.45, 0.16]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[-0.14, -0.3, 0.22]}>
            <boxGeometry args={[0.16, 0.45, 0.16]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.14, -0.3, 0.22]}>
            <boxGeometry args={[0.16, 0.45, 0.16]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      ) : (
        // Standing pose
        <group position={[0, 0.45, 0]}>
          <mesh position={[-0.14, 0, 0]} castShadow>
            <boxGeometry args={[0.16, 0.7, 0.16]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.14, 0, 0]} castShadow>
            <boxGeometry args={[0.16, 0.7, 0.16]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      )}

      {/* Arms */}
      <mesh position={[-0.32, isSitting ? 0.95 : 1.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={hoodieColor} />
      </mesh>
      <mesh position={[0.32, isSitting ? 0.95 : 1.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={hoodieColor} />
      </mesh>

      {/* Optional book or laptop if reading */}
      {action === 'reading' && (
        <mesh position={[0, 0.85, 0.35]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.32, 0.04, 0.24]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
        </mesh>
      )}
    </group>
  );
};

export const StaticCharacters: React.FC = () => {
  return (
    <group name="static-background-students">
      {/* 1. Student near Central Quad fountain relaxing on lawn */}
      <StudentFigure
        position={[-6, 0, -4]}
        rotationY={Math.PI / 4}
        hoodieColor="#10B981"
        action="standing"
      />

      {/* 2. Student near Library steps reading */}
      <StudentFigure
        position={[22, 0, 6]}
        rotationY={-Math.PI / 3}
        hoodieColor="#8B5CF6"
        action="standing"
      />

      {/* 3. Student outside Canteen entrance */}
      <StudentFigure
        position={[-12, 0, -22]}
        rotationY={Math.PI * 0.7}
        hoodieColor="#EC4899"
        action="standing"
      />

      {/* 4. Student near Auditorium plaza */}
      <StudentFigure
        position={[24, 0, 26]}
        rotationY={-Math.PI * 0.4}
        hoodieColor="#EAB308"
        action="standing"
      />
    </group>
  );
};

export default StaticCharacters;
