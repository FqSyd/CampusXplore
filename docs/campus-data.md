# Campus Data Specification

Campus spatial data is structured in modular files under `src/data/campus/`.

## 1. Buildings (`buildings.ts`)
Each landmark or functional facility has architectural dimensions and an entrance reference:
```typescript
interface CampusBuilding {
  id: string;
  name: string;
  shortName: string;
  category: 'academic' | 'administrative' | 'amenity' | 'sports' | 'residential' | 'gate' | 'medical' | 'outdoor';
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accentColor: string;
  roofType?: 'flat' | 'sloped' | 'dome' | 'glass';
  nodeId: string; // ID of the dedicated entrance node
}
```

## 2. Navigation Nodes (`nodes.ts`)
Nodes define valid ground-level positions in the pedestrian network:
```typescript
interface NavigationNode {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'gate' | 'path' | 'intersection' | 'building_entrance' | 'crossing' | 'destination';
  isBuildingEntrance?: boolean;
  buildingId?: string;
}
```

## 3. Navigation Edges (`edges.ts`)
Edges represent walkable physical pathway segments:
```typescript
interface NavigationEdge {
  from: string;
  to: string;
  distance?: number; // Simulated meters
  type?: 'road' | 'walkway' | 'path' | 'crossing';
  bidirectional?: boolean;
  isBlocked?: boolean;
}
```

## 4. Obstacles (`obstacles.ts`)
Defines physical non-walkable barriers (buildings, walls, water basins) and dynamic blockages:
```typescript
interface CampusObstacle {
  id: string;
  name: string;
  type: 'building' | 'wall' | 'restricted_zone' | 'water_body' | 'sports_pitch' | 'blocked_path';
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number; height?: number };
  isDynamic?: boolean;
  isActive?: boolean;
}
```
All edges are verified with 2D AABB slab intersection checks to guarantee zero collision with obstacles.
