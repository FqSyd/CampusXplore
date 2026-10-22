import { useState, useCallback, useRef, useEffect } from 'react';
import { AStarResult, NavigationStatus, CampusBuilding } from '../types';
import { CampusGraph } from '../algorithms/graph';
import { findPathAStar } from '../algorithms/astar';
import { DemoRoute } from '../types/navigation';

export interface UsePathfindingProps {
  graph: CampusGraph;
  buildings: CampusBuilding[];
  walkingSpeed: number;
}

export function usePathfinding({ graph, buildings, walkingSpeed }: UsePathfindingProps) {
  const [startBuildingId, setStartBuildingId] = useState<string>('main_gate');
  const [destBuildingId, setDestBuildingId] = useState<string>('library');
  const [status, setStatus] = useState<NavigationStatus>('ready');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [result, setResult] = useState<AStarResult | null>(null);

  const [animateSearch, setAnimateSearch] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeScenarioId, setActiveScenarioId] = useState<string | undefined>('s1');

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  const resetRoute = useCallback(() => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    setIsSearching(false);
    setResult(null);
    setStatus('ready');
    setErrorMessage('');
    setCurrentStepIndex(0);
    setActiveScenarioId(undefined);
  }, []);

  const findRoute = useCallback(() => {
    if (startBuildingId === destBuildingId) {
      setStatus('same_location');
      setResult(null);
      return;
    }

    const startNodeId = graph.getNodeForBuilding(startBuildingId);
    const destNodeId = graph.getNodeForBuilding(destBuildingId);

    if (!startNodeId || !destNodeId) {
      setStatus('not_found');
      setErrorMessage('Selected locations do not have valid entrance waypoints.');
      setResult(null);
      return;
    }

    const aStarResult = findPathAStar(graph, startNodeId, destNodeId, walkingSpeed);

    if (!aStarResult.found) {
      setStatus('not_found');
      setErrorMessage(
        aStarResult.errorMessage ||
          'No walkable route could be found. Connecting paths may be blocked by obstacles.'
      );
      setResult(aStarResult);
      return;
    }

    if (animateSearch && aStarResult.steps.length > 1) {
      setIsSearching(true);
      setStatus('searching');
      setCurrentStepIndex(0);

      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }

      let step = 0;
      const totalSteps = aStarResult.steps.length;
      const intervalMs = Math.max(25, Math.min(100, Math.floor(1200 / totalSteps)));

      animationTimerRef.current = setInterval(() => {
        step++;
        setCurrentStepIndex(step);

        if (step >= totalSteps - 1) {
          if (animationTimerRef.current) {
            clearInterval(animationTimerRef.current);
          }
          setIsSearching(false);
          setStatus('found');
          setResult(aStarResult);
        }
      }, intervalMs);
    } else {
      setResult(aStarResult);
      setStatus('found');
      setCurrentStepIndex(aStarResult.steps.length - 1);
    }
  }, [startBuildingId, destBuildingId, graph, walkingSpeed, animateSearch]);

  const swapLocations = useCallback(() => {
    setStartBuildingId(destBuildingId);
    setDestBuildingId(startBuildingId);
    resetRoute();
  }, [startBuildingId, destBuildingId, resetRoute]);

  const selectScenario = useCallback(
    (scenario: DemoRoute) => {
      resetRoute();
      setStartBuildingId(scenario.fromId);
      setDestBuildingId(scenario.toId);
      setActiveScenarioId(scenario.id);
      setStatus('ready');
    },
    [resetRoute]
  );

  return {
    startBuildingId,
    setStartBuildingId: (id: string) => {
      setStartBuildingId(id);
      resetRoute();
    },
    destBuildingId,
    setDestBuildingId: (id: string) => {
      setDestBuildingId(id);
      resetRoute();
    },
    status,
    errorMessage,
    result,
    animateSearch,
    setAnimateSearch,
    isSearching,
    currentStepIndex,
    activeScenarioId,
    findRoute,
    resetRoute,
    swapLocations,
    selectScenario,
  };
}
