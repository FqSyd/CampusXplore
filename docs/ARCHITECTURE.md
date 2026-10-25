# CampusXplore — System Architecture

This document describes the software architecture, spatial data modeling, and mathematical algorithms governing CampusXplore.

---

## 1. Architectural Overview

CampusXplore follows a modular, decoupled unidirectional architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                       CampusXplore                          │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                 Spatial Data Layer                  │   │
│   │  - buildings.json / buildings.ts                    │   │
│   │  - nodes.ts (Waypoints & Entrances)                 │   │
│   │  - edges.ts (Walkable Segments & Distances)         │   │
│   │  - obstacles.ts (Permanent & Dynamic Bounds)        │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                Algorithms & Logic                   │   │
│   │  - CampusGraph: Adjacency list & edge blocking      │   │
│   │  - A* Pathfinder: Priority queue, f(n) = g(n) + h(n)│   │
│   │  - NavigationService: High-level orchestrator       │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│              ┌───────────────┴───────────────┐              │
│              ▼                               ▼              │
│   ┌──────────────────────┐       ┌──────────────────────┐   │
│   │   3D Canvas Layer    │       │   2D Blueprint View  │   │
│   │  - Campus3D          │       │  - Campus2D          │   │
│   │  - WalkingCharacter  │       │  - MapNodes / Paths  │   │
│   │  - CameraController  │       │  - Interactive Select│   │
│   └──────────┬───────────┘       └───────────┬──────────┘   │
│              │                               │              │
│              └───────────────┬───────────────┘              │
│                              │                              │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                   UI & Controls                     │   │
│   │  - NavigationPanel (Start/Dest Selectors, Presets)  │   │
│   │  - ObstacleControlPanel (Temporary Pathway Updates) │   │
│   │  - RouteStatus HUD & Algorithm Inspection Modal     │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Graph Modeling & Spatial Representation

The campus pedestrian network is mathematically represented as an undirected weighted graph:
$$G = (V, E)$$

- **Vertices ($V$)**:
  Each vertex represents a physical waypoint $v_i = (\text{id}, x, y, z, \text{type})$.
  - `gate`: Campus boundaries (e.g., Main Gate, North Gate).
  - `building_entrance`: Exact front entrance doors connected to the walkway system.
  - `intersection`: Crossroads, avenue splits, or plaza corners.
  - `path`: Intermediate nodes along curved or elongated walkways.

- **Edges ($E$)**:
  Each edge $e = (u, v, w)$ connects adjacent waypoints $u, v \in V$ with distance weight $w$:
  $$w = \sqrt{(x_v - x_u)^2 + (y_v - y_u)^2 + (z_v - z_u)^2}$$
  Edges can be marked as blocked ($e.\text{isBlocked} = \text{true}$) at runtime when temporary pathway closures occur.

- **Obstacle Clearance**:
  All 55 edges are pre-verified against 17 permanent obstacle bounding boxes (axis-aligned bounding boxes). No edge intersects with building footprints.

---

## 3. The A* (A-Star) Pathfinding Algorithm

### Cost Function
$$f(n) = g(n) + h(n)$$

1. **$g(n)$ — Path Cost from Origin**:
   The exact sum of edge distances traversed along the pathway from the Start Node to current node $n$:
   $$g(n) = g(\text{parent}) + \text{dist}(\text{parent}, n)$$

2. **$h(n)$ — Heuristic Estimate to Goal**:
   Euclidean distance from node $n$ to the goal waypoint:
   $$h(n) = \sqrt{(x_{\text{goal}} - x_n)^2 + (z_{\text{goal}} - z_n)^2}$$

3. **Admissibility & Optimality**:
   Because straight-line Euclidean distance is always less than or equal to the actual walking path distance along roads/walkways:
   $$h(n) \le d(n, \text{goal})$$
   The heuristic is **admissible** and **consistent** (monotone). Consequently, A* is mathematically guaranteed to find the shortest walkable route without searching the entire graph.

4. **Node-Level Score Recording & State Tracking**:
   During execution, the algorithm records:
   - For every explored step: `nodeId`, `parent`, actual `g(n)`, heuristic estimate `h(n)`, total evaluation `f(n)`, snapshot of eligible candidate nodes in the Open Set priority queue, and the explicit selection justification (`lowest f(n)`).
   - For every waypoint along the optimal reconstructed path: an immutable `RouteNodeAnalysis` object containing the mathematical breakdown $f(n) = g(n) + h(n)$, predecessor, expansion order, and natural language explanation.

---

## 4. Architectural Separation of Concerns

CampusXplore strictly isolates responsibilities to ensure maintainability and eliminate circular dependencies:

1. **Campus Data (`src/data/`)**:
   Static spatial definitions of university buildings, entrance coordinates, road network waypoints, and obstacle bounding boxes. Has zero dependencies on algorithms, React, or WebGL.

2. **Walkable Graph (`src/algorithms/graph.ts`)**:
   In-memory weighted adjacency list constructed from campus data. Exposes topological queries (`getNeighbors`, `getDistance`), unit conversions, and dynamic runtime edge blocking (`setEdgeBlocked`).

3. **A* Algorithm (`src/algorithms/astar/`)**:
   Pure TypeScript implementation of the A* search algorithm using a binary min-heap priority queue. Operates solely on the abstract `CampusGraph` interface without UI or WebGL coupling.

4. **Search-State Recording (`src/algorithms/astar/astarSteps.ts`, `src/types/algorithm.ts`)**:
   Captures real algorithmic states (visited nodes, candidate snapshots, tie-breaking justifications, reconstructed waypoint analysis) at runtime for visualization without fabricating synthetic search sequences.

5. **Route Visualization (`src/components/campus3d/NavigationRoute.tsx`, `src/components/campus2d/MapRoute.tsx`)**:
   Transforms calculated Cartesian waypoint arrays into smooth Catmull-Rom 3D spline tubes, glowing energy orbs, and interactive waypoint discs in 3D and 2D.

6. **Walking Animation (`src/components/campus3d/WalkingCharacter.tsx`)**:
   Independent 60 FPS interpolation engine animating the walking character along route segments, tracking real-time heading orientation, distance countdown, and percentage completion.

7. **Event Closures (`src/components/navigation/ObstacleControlPanel.tsx`, `App.tsx`)**:
   Dynamic incident management. Toggling pathway closures (`EVENT IN PROGRESS`, `PATHWAY UNDER REPAIR`) mutates graph edge availability and automatically triggers re-routing while clearing stale node evaluation metrics.

8. **UI Components (`src/components/algorithm/NodeAnalysisCard.tsx`, `src/components/ui/`)**:
   Compact, decoupled floating HUD cards and modals displaying real-time algorithm metrics, formulas, and waypoint stepper controls without obstructing the 3D scene.

---

## 5. Directory & Module Organization

| Directory | Purpose |
| :--- | :--- |
| `src/app/` | Application root entry, provider wrappers, and top-level orchestrator (`App.tsx`, `main.tsx`). |
| `src/algorithms/` | Pure pathfinding logic (`astar.ts`, `graph.ts`, `heuristic.ts`). Independent of React/DOM. |
| `src/components/campus3d/` | 3D WebGL campus environment, buildings, lights, and scene. |
| `src/components/campus2d/` | Full-screen 2D architectural blueprint map. |
| `src/components/walker/` | 3D walking character locomotion, orientation calculations, and animation loop. |
| `src/components/route/` | Route line rendering, navigation progress status, and metrics HUD. |
| `src/components/navigation/` | Origin/destination selectors, pathway update incident cards, preset scenarios. |
| `src/components/algorithm/` | A* Node Analysis floating card, visualizer, and code modal. |
| `src/components/ui/` | Reusable UI primitives (Button, Modal, Panel, CameraControls). |
| `src/components/layout/` | Header and structural layout wrappers. |
| `src/data/` | Spatial campus models (buildings, entrance nodes, pathways, obstacle bounds). |
| `src/services/` | High-level orchestrator (`NavigationService`). |
| `src/types/` | TypeScript type declarations for algorithms, campus data, and UI state. |
| `tests/` | Automated unit test suites covering A*, obstacle clearance, and demo routes. |
