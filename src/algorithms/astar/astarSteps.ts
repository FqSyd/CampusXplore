import { OpenSetNode, AStarStep, Position3D } from '../../types';
import { CampusGraph } from '../graph/graph';

/**
 * Min-Heap Priority Queue for optimal O(log N) open-set extraction in A*.
 */
export class MinHeap {
  private heap: OpenSetNode[] = [];

  public get size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public push(node: OpenSetNode) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  public pop(): OpenSetNode | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  public contains(id: string): boolean {
    return this.heap.some((item) => item.id === id);
  }

  public getAll(): OpenSetNode[] {
    return [...this.heap];
  }

  private bubbleUp(index: number) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.f >= parent.f) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  private sinkDown(index: number) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex: number | null = null;

      if (leftChildIndex < length) {
        if (this.heap[leftChildIndex].f < element.f) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        if (
          (swapIndex === null && this.heap[rightChildIndex].f < element.f) ||
          (swapIndex !== null && this.heap[rightChildIndex].f < this.heap[swapIndex].f)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;

      this.heap[index] = this.heap[swapIndex];
      this.heap[swapIndex] = element;
      index = swapIndex;
    }
  }
}

/**
 * Reconstructs the optimal sequence of node IDs from target back to start.
 */
export function reconstructPath(cameFrom: Map<string, string>, targetNodeId: string): string[] {
  const path: string[] = [];
  let curr: string | undefined = targetNodeId;

  while (curr !== undefined) {
    path.push(curr);
    curr = cameFrom.get(curr);
  }

  return path.reverse();
}

/**
 * Extracts 3D coordinates from a sequence of node IDs.
 */
export function extractPathCoordinates(graph: CampusGraph, path: string[]): Position3D[] {
  return path
    .map((nodeId) => graph.getNodePosition(nodeId))
    .filter((pos): pos is Position3D => pos !== undefined);
}
