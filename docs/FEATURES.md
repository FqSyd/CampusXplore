# CampusXplore — Feature Specifications

CampusXplore brings together spatial graph computing, real-time 3D animation, and interactive campus incident handling:

---

## 1. Interactive 3D Campus World
- **WebGL Rendering**: Powered by Three.js and `@react-three/fiber`.
- **Architectural Models**: Distinct campus buildings (Administration Block, Central Library, Computer Science & IT Block, Auditorium, Canteen, Student Activity Center, Sports Complex, Medical Center, Hostels).
- **Environmental Detailing**: Textured roads, brick pedestrian pathways, manicured grass lawns, 3D trees, dynamic daylight illumination, and building shadow mapping.
- **Visual Beacons**: Animated pulsing 3D waypoint markers highlighting the **START** (Emerald Green) and **DESTINATION** (Crimson Red) entrances.

---

## 2. Switchable 2D Topographic Map
- **Full-Screen 2D Blueprint**: Clean top-down 2D vector map showing all waypoints, nodes, physical building boundaries, and connecting paths.
- **Non-Obtrusive Switching**: Seamlessly toggle between full 3D simulation and 2D blueprint mode from the floating camera controls without floating overlays obscuring the view.
- **Interactive Building Selection**: Click any building on either 2D or 3D canvas to select it as the destination.

---

## 3. Real-Time 3D Walking Avatar Locomotion
- **Continuous Path Traversal**: An animated 3D character steps along each waypoint of the computed A* route.
- **Decoupled 60 FPS Animation**: Three.js `useFrame` animation loop uses reference pointers (`useRef`) to ensure steady locomotion without triggering React component re-renders.
- **Live Locomotion HUD**:
  - Live progress percentage ($0\% \to 100\%$).
  - Remaining distance countdown (in meters).
  - Estimated walking time (based on $1.4\text{ m/s}$ average pedestrian velocity).
  - Arrival banner upon successful completion (`✓ Arrived at [Destination]`).

---

## 4. Multi-Perspective Camera System
- **Default Orbit Controls**: Freely rotate, tilt, pan, and zoom around the campus.
- **Overhead / Bird's Eye View**: Instant 90-degree orthogonal view for tactical navigation overview.
- **Focus Building**: Automatically pans camera and centers focus on the selected building entrance.
- **Follow Walker Camera**: Third-person tracking camera smoothly following the walking character along pathways.

---

## 5. Campus Pathway Updates (Dynamic Closures & Real Rerouting)
- **Real-World Incident Cards**:
  - **`EVENT IN PROGRESS` (Canteen Forecourt)**: Simulates cultural/technical festival tents or crowd restrictions.
  - **`PATHWAY UNDER REPAIR` (Admin East Promenade)**: Simulates paving maintenance or construction closures.
- **Algorithmic Graph Disconnection**: The application physically disconnects the affected edges in the underlying `CampusGraph` (`graph.setEdgeBlocked()`).
- **Dynamic Recalculation**: A* recalculates an alternative detour route in real time. The 3D glowing path line, 2D map, and walking avatar automatically re-route around the closed area.
- **Natural Language Alert**: Displays `"⚠️ Pathway unavailable. A* recalculated an alternative walking route."`

---

## 6. A* Algorithm Visualizer & Code Inspection
- **Step-by-Step Search Animation**: Visualizes node expansion across the open set and closed set with custom animation speeds.
- **Algorithm Code Modal**: Displays clean, syntax-highlighted TypeScript implementation of A* with formula breakdowns for $f(n) = g(n) + h(n)$.
- **Educational Preset Scenarios**: Instant one-click test routes demonstrating diverse path complexities across campus.
