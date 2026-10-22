# Team Collaboration & Git Branching Guide

## Branching Strategy

To minimize merge conflicts when multiple developers collaborate, follow the branch convention:

```
main (Production Releases)
  ↑
develop (Integration Branch)
  ↑
feature/astar             (Developer 1: Algorithm enhancements)
feature/campus-3d         (Developer 2: 3D scene & models)
feature/campus-2d         (Developer 3: 2D map & minimap)
feature/algorithm-vis     (Developer 4: Execution step visualizers)
feature/ui-navigation     (Developer 5: Wayfinding UI controls)
```

## Workflow

1. **Pull Latest Changes**:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Create a Scoped Feature Branch**:
   ```bash
   git checkout -b feature/campus-3d
   ```
3. **Commit Incrementally**:
   Make small, focused commits with meaningful commit messages.
4. **Test Before Submitting**:
   ```bash
   npm run build
   npx tsx tests/algorithms/astar.test.ts
   ```
5. **Open a Pull Request**:
   Target `develop`. Complete the checklist in `.github/pull_request_template.md`.
