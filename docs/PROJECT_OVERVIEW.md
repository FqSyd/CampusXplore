# CampusXplore — Project Overview

## 1. Introduction
**CampusXplore** is an interactive, web-based intelligent campus navigation system built with React, TypeScript, and Three.js. It models an academic campus as a spatial pedestrian graph and calculates the optimal, obstacle-free walking path between buildings using the **A* (A-Star)** pathfinding algorithm.

Unlike standard city-scale mapping services (e.g., Google Maps), CampusXplore focuses on:
- **Pedestrian Walkway Accuracy**: Routing users along real paved walkways, plazas, and pedestrian corridors instead of generic roads.
- **Doorway Precision**: Navigating users directly to verified building entrance doors rather than generic building centroids.
- **Dynamic Pathway Closures**: Reacting in real time to temporary campus events, construction, repairs, and crowd-related pathway restrictions.
- **Algorithm Transparency**: Visualizing the inner mechanics of A* (Open Set, Closed Set, heuristic evaluation, and cost functions) for educational clarity.

---

## 2. Core Problem & Motivation
Traditional mapping applications fail inside educational campuses for several reasons:
1. **Lack of Pedestrian Granularity**: Internal pathways, courtyards, promenades, and pedestrian-only corridors are often omitted.
2. **Obstacle Ignorance**: Temporary campus disruptions (college festivals, building renovations, pathway paving repairs) are not updated in real time.
3. **No Educational Value**: Students and engineers studying Artificial Intelligence cannot see how heuristics and graph search algorithms operate under the hood.

CampusXplore bridges this gap by marrying modern 3D graphics and responsive UI design with rigorous graph theory and heuristic search algorithms.

---

## 3. Key Personas & Use Cases
- **Freshmen & Visitors**: Discover the shortest walking path between campus gates, hostels, academic blocks, libraries, and canteens.
- **Campus Administrators & Facilities**: Simulate temporary pathway closures during sports events, conferences, or maintenance and observe automatic pedestrian rerouting.
- **Students & Evaluators**: Learn how A* balances actual cost $g(n)$ and heuristic estimate $h(n)$ to find provably optimal paths with minimal node expansions.

---

## 4. Key Metrics & Benchmarks
- **Average Route Calculation**: < 5 ms for 50+ node graphs.
- **Rendering Performance**: Smooth 60 FPS in 3D WebGL viewport using React Three Fiber.
- **Clearance Reliability**: 100% collision-free edges verified against 17 permanent campus obstacle bounds.
- **Deployment**: Single-click production builds with zero server-side state dependencies (runs entirely in client browser).
