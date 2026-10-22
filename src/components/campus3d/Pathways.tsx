import React from 'react';

export const Pathways: React.FC = () => {
  return (
    <group name="campus-pathways">
      {/* 1. Main Campus Grass Base Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[190, 190]} />
        <meshStandardMaterial color="#0E1A14" roughness={0.95} />
      </mesh>

      {/* 2. Main Avenue (South entrance from Main Gate to South Fork at z = 46) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 57]} receiveShadow>
        <planeGeometry args={[10, 24]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>
      {/* Main Avenue Divider Stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 57]}>
        <planeGeometry args={[0.3, 22]} />
        <meshBasicMaterial color="#EAB308" />
      </mesh>

      {/* South Fork Cross Promenade (splits around Admin) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 46]} receiveShadow>
        <planeGeometry args={[44, 7]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* Admin West Promenade (Bypasses Admin on the West) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, 0.02, 28]} receiveShadow>
        <planeGeometry args={[6, 38]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* Admin East Promenade (Bypasses Admin on the East) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.02, 28]} receiveShadow>
        <planeGeometry args={[6, 38]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* Admin South Entrance Forecourt Spur */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 40]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.75} />
      </mesh>

      {/* South Quad Walkway (North of Admin, South of Quad) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10]} receiveShadow>
        <planeGeometry args={[42, 6]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 3. North Avenue (North Gate connection) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -56]} receiveShadow>
        <planeGeometry args={[8, 24]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>

      {/* North Central Connector (Crossroad at z = -44) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -44]} receiveShadow>
        <planeGeometry args={[40, 6]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 4. East-West Central Promenade (Connecting Quad to East & West wings) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[74, 7]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 5. Central Quad Circular Promenade (Routes safely around fountain) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.5, 9.5, 32]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 6. West Academic Corridor (CS to IT to Lab at x = -25) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, 0.02, 10]} receiveShadow>
        <planeGeometry args={[6, 65]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 7. East Academic Corridor (Library to Auditorium & Medical at x = 20) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.02, 10]} receiveShadow>
        <planeGeometry args={[6, 65]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 8. North-West Student Life Corridor (Hostel & SAC to Canteen) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-14, 0.02, -18]} receiveShadow>
        <planeGeometry args={[26, 6]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.02, -26]} receiveShadow>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#2B394A" roughness={0.8} />
      </mesh>

      {/* 9. Parking Area Asphalt & Marked Bays */}
      <group position={[24, 0.03, 60]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 16]} />
          <meshStandardMaterial color="#182230" roughness={0.85} />
        </mesh>
        {[-6, -2, 2, 6].map((xOffset) => (
          <mesh key={xOffset} position={[xOffset, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 12]} />
            <meshBasicMaterial color="#94A3B8" />
          </mesh>
        ))}
        {/* Low-poly parked vehicles */}
        <group position={[-4, 0.6, -2]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 1.1, 4.2]} />
            <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.7, -0.2]}>
            <boxGeometry args={[1.8, 0.7, 2.2]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
        <group position={[4, 0.6, 2]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 1.1, 4.2]} />
            <meshStandardMaterial color="#DC2626" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.7, -0.2]}>
            <boxGeometry args={[1.8, 0.7, 2.2]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
        <group position={[0, 0.6, -3]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 1.1, 4.2]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.7, -0.2]}>
            <boxGeometry args={[1.8, 0.7, 2.2]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
      </group>

      {/* 10. Campus Perimeter Security Walls */}
      <group name="perimeter-walls">
        {/* South Wall (West of Main Gate) */}
        <mesh position={[-44, 1.5, 68]} castShadow receiveShadow>
          <boxGeometry args={[71, 3.0, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* South Wall (East of Main Gate) */}
        <mesh position={[44, 1.5, 68]} castShadow receiveShadow>
          <boxGeometry args={[71, 3.0, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* North Wall (West of North Gate) */}
        <mesh position={[-44, 1.5, -68]} castShadow receiveShadow>
          <boxGeometry args={[72, 3.0, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* North Wall (East of North Gate) */}
        <mesh position={[44, 1.5, -68]} castShadow receiveShadow>
          <boxGeometry args={[72, 3.0, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export const CampusGround = Pathways;
export default Pathways;
