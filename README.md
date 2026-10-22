# CampusXplore

> **Smart Campus Navigation System Using the A\* (A-Star) Pathfinding Algorithm**

[![CampusXplore CI](https://github.com/FqSyd/CampusXplore/actions/workflows/ci.yml/badge.svg)](https://github.com/FqSyd/CampusXplore/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

🌐 **Live Deployment**: [https://campus-xplore.vercel.app](https://campus-xplore.vercel.app) *(or your Vercel deployment URL)*  
📖 **Architecture Documentation**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)  
🤝 **Contribution Guide**: [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

## 📌 About CampusXplore

**CampusXplore** is an interactive, browser-based 3D and 2D university campus wayfinding application. It demonstrates how the **A\* (A-Star)** pathfinding algorithm calculates the shortest and most efficient pedestrian walking route between buildings while strictly avoiding physical structures and adapting dynamically to real-time pathway disruptions.

Commercial street maps (such as Google Maps) often fall short on academic campuses because they lack internal walkway networks, ignore entrance doors, and fail to reflect temporary pathway closures. CampusXplore solves this with entrance-level precision and complete algorithmic transparency.

```
       Start Location & Destination
                    ↓
   Walkable Campus Graph (Pedestrian Network)
                    ↓
        A* Algorithm: f(n) = g(n) + h(n)
                    ↓
          Optimal Collision-Free Route
                    ↓
  ┌─────────────────┬─────────────────┐
  ↓                 ↓                 ↓
3D Simulation    2D Blueprint    3D Walking Avatar
(WebGL / Three)  (Vector Map)    (Live HUD Metrics)
```

---

## ✨ Key Features

- **Interactive 3D Campus World**: Realistic 3D low-poly buildings, walkways, green lawns, trees, daylight lighting, and glowing navigation waypoint markers.
- **Switchable 2D Topographic Blueprint**: Instant toggle between full 3D simulation and a 2D architectural map without floating overlays blocking the view.
- **Animated 3D Walking Character**: A walking character traverses each A\* waypoint with smooth 60 FPS motion and a real-time HUD displaying progress percentage ($0\% \to 100\%$), remaining meters countdown, and estimated walking minutes.
- **Dynamic Camera Controls**: Orbit, overhead Bird's Eye view, focus target, and third-person **Follow Walker** camera.
- **Campus Pathway Updates & Real Recalculation**:
  - `EVENT IN PROGRESS` (Canteen Forecourt)
  - `PATHWAY UNDER REPAIR` (Admin East Promenade)
  - When an alert is toggled, affected edges are physically disconnected in `CampusGraph`, and A\* dynamically finds the fastest alternative detour in real time.
- **Algorithm Transparency**: Step-by-step search visualizer (evaluating open set vs. closed set) and educational code inspection modal.

---

## 🧠 The A\* Pathfinding Algorithm

At each node $n$, A\* evaluates the cost function:

$$f(n) = g(n) + h(n)$$

- **$g(n)$**: The exact accumulated walking distance (in meters) from the origin to node $n$.
- **$h(n)$**: The straight-line Euclidean distance heuristic to the destination entrance door:
  $$h(n) = \sqrt{(x_{\text{goal}} - x_n)^2 + (z_{\text{goal}} - z_n)^2}$$
- **$f(n)$**: The total estimated route cost through node $n$.

Because Euclidean distance in physical space is always $\le$ actual walking distance, $h(n)$ is **admissible** and **consistent**, guaranteeing the mathematically shortest collision-free route.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript |
| **3D Graphics Engine** | Three.js + `@react-three/fiber` + `@react-three/drei` |
| **Styling & Icons** | Tailwind CSS + Lucide Icons |
| **Build Tool** | Vite 5 |
| **Hosting & CI/CD** | Vercel + GitHub Actions |
| **Testing** | Node test runner + `tsx` |

---

## 📁 Project Structure

```
CampusXplore/
├── .github/
│   └── workflows/ci.yml         # GitHub Actions automated build & test CI
├── public/
│   ├── assets/                  # 3D models, textures, images, and fonts
│   ├── favicon.svg              # Campus icon
│   └── icons.svg
├── src/
│   ├── app/                     # Application orchestrator and provider wrappers
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── providers/
│   ├── algorithms/              # A* pathfinding and spatial graph engine
│   │   ├── astar.ts
│   │   ├── heuristic.ts
│   │   └── graph.ts
│   ├── components/              # Modular UI & 3D components
│   │   ├── campus/              # 3D buildings, environment, and scene
│   │   ├── walker/              # 3D walking character locomotion
│   │   ├── map/                 # 2D topographic blueprint map
│   │   ├── route/               # Route line rendering and status HUD
│   │   ├── navigation/          # Location selectors and pathway update alerts
│   │   ├── algorithm/           # Algorithm visualizer and code modal
│   │   ├── layout/              # Header and layout wrappers
│   │   └── ui/                  # Reusable buttons, modals, camera controls
│   ├── data/                    # Spatial campus models, entrance nodes, pathways
│   │   ├── campus.ts
│   │   ├── buildings.ts
│   │   ├── pathways.ts
│   │   └── campusUpdates.ts
│   ├── services/                # High-level NavigationService
│   ├── types/                   # TypeScript interfaces
│   ├── utils/                   # Geometry, distance, and collision math
│   └── styles/                  # Tailwind & global stylesheet
├── docs/                        # Project documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── FEATURES.md
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
├── tests/                       # Unit tests for A*, graph, and preset routes
│   ├── algorithms/
│   └── navigation/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/FqSyd/CampusXplore.git
cd CampusXplore

# 2. Install dependencies
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Run Tests
```bash
# Run all unit tests
npm test

# Run individual test suites
npm run test:astar
npm run test:graph
npm run test:routes
```

### Build for Production
```bash
npm run build
```
Build output will be generated in `dist/`.

---

## 👥 Contributing

1. Create a branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'feat: add amazing feature'`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request on GitHub.

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
