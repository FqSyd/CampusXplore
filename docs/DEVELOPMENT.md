# CampusXplore — Development & Contribution Guide

This guide describes how to run, test, and contribute to CampusXplore.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **Git**

---

## 2. Getting Started

### Clone the Repository
```bash
git clone https://github.com/FqSyd/CampusXplore.git
cd CampusXplore
```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 3. Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and builds optimized production bundle to `dist/`. |
| `npm run preview` | Locally serves the built production application. |
| `npm test` | Runs all automated unit test suites (`astar`, `graph`, `routes`). |
| `npm run test:astar` | Runs A* algorithm pathfinding tests. |
| `npm run test:graph` | Runs physical obstacle clearance collision tests. |
| `npm run test:routes` | Runs preset demo scenario verification tests. |

---

## 4. Git Collaboration Workflow

To ensure stability on the production deployment, contributors should follow this branch workflow:

1. **Pull Latest Changes**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # e.g., git checkout -b feature/add-new-building
   ```

3. **Make and Test Changes**:
   Verify everything compiles and tests pass locally before committing:
   ```bash
   npm run build
   npm test
   ```

4. **Commit with Clear Message**:
   Use semantic commit conventions:
   ```bash
   git commit -m "feat: add indoor waypoint routing for CS block"
   # or
   git commit -m "fix: correct bounding box for library fountain"
   ```

5. **Push and Open Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Open a Pull Request on GitHub against `main`. Automated GitHub Actions CI will run tests and build checks.

---

## 5. Adding New Campus Buildings or Pathways

1. **Add Building Spatial Data**:
   Edit `src/data/campus/buildings.ts` to add the building footprint, position coordinates, and dimensions.
2. **Register Entrance Waypoint**:
   Add an entrance node in `src/data/campus/nodes.ts` with `type: 'building_entrance'`.
3. **Connect Walkway Edges**:
   In `src/data/campus/edges.ts`, connect the new entrance node to the closest walkway node.
4. **Verify Clearance**:
   Run `npm run test:graph` to ensure no new edges collide with building footprints.
