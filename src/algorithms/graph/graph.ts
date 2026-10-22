import { NavigationNode, NavigationEdge, CampusBuilding, Position3D } from '../../types';
import { calculateEuclideanDistance } from '../../utils/distance';
import { GraphNeighbor, GraphStats } from './graphTypes';

export class CampusGraph {
  private nodesMap: Map<string, NavigationNode> = new Map();
  private buildingToNodeMap: Map<string, string> = new Map();
  private nodeToBuildingMap: Map<string, string> = new Map();
  private adjacencyList: Map<string, GraphNeighbor[]> = new Map();
  private edgesList: NavigationEdge[] = [];
  private blockedEdges: Set<string> = new Set();
  private blockedNodes: Set<string> = new Set();
  private scaleFactor: number;

  constructor(
    nodes: NavigationNode[],
    edges: NavigationEdge[],
    buildings: CampusBuilding[],
    scaleFactor: number = 6.0
  ) {
    this.scaleFactor = scaleFactor;
    this.edgesList = edges;
    this.initNodes(nodes);
    this.initBuildings(buildings);
    this.initEdges(edges);
  }

  private initNodes(nodes: NavigationNode[]) {
    for (const node of nodes) {
      this.nodesMap.set(node.id, node);
      this.adjacencyList.set(node.id, []);
      if (node.buildingId) {
        this.buildingToNodeMap.set(node.buildingId, node.id);
        this.nodeToBuildingMap.set(node.id, node.buildingId);
      }
    }
  }

  private initBuildings(buildings: CampusBuilding[]) {
    for (const building of buildings) {
      if (building.nodeId) {
        this.buildingToNodeMap.set(building.id, building.nodeId);
        this.nodeToBuildingMap.set(building.nodeId, building.id);
      }
    }
  }

  private initEdges(edges: NavigationEdge[]) {
    for (const edge of edges) {
      const fromNode = this.nodesMap.get(edge.from);
      const toNode = this.nodesMap.get(edge.to);

      if (!fromNode || !toNode) {
        console.warn(`[CampusGraph] Invalid edge between '${edge.from}' and '${edge.to}'`);
        continue;
      }

      const distance =
        typeof edge.distance === 'number' && edge.distance > 0
          ? edge.distance
          : calculateEuclideanDistance(fromNode.position, toNode.position) * this.scaleFactor;

      const isBidirectional = edge.bidirectional !== false;

      this.addDirectEdge(edge.from, edge.to, distance, edge.type);
      if (isBidirectional) {
        this.addDirectEdge(edge.to, edge.from, distance, edge.type);
      }

      if (edge.isBlocked) {
        this.setEdgeBlocked(edge.from, edge.to, true);
      }
    }
  }

  private addDirectEdge(from: string, to: string, distance: number, type?: string) {
    const neighbors = this.adjacencyList.get(from) || [];
    if (!neighbors.some((n) => n.nodeId === to)) {
      neighbors.push({ nodeId: to, distance, type });
      this.adjacencyList.set(from, neighbors);
    }
  }

  private getEdgeKey(nodeA: string, nodeB: string): string {
    return nodeA < nodeB ? `${nodeA}__${nodeB}` : `${nodeB}__${nodeA}`;
  }

  public setEdgeBlocked(nodeA: string, nodeB: string, blocked: boolean) {
    const key = this.getEdgeKey(nodeA, nodeB);
    if (blocked) {
      this.blockedEdges.add(key);
    } else {
      this.blockedEdges.delete(key);
    }
  }

  public isEdgeBlocked(nodeA: string, nodeB: string): boolean {
    return this.blockedEdges.has(this.getEdgeKey(nodeA, nodeB));
  }

  public setNodeBlocked(nodeId: string, blocked: boolean) {
    if (blocked) {
      this.blockedNodes.add(nodeId);
    } else {
      this.blockedNodes.delete(nodeId);
    }
  }

  public isNodeBlocked(nodeId: string): boolean {
    return this.blockedNodes.has(nodeId);
  }

  public getBlockedEdgesCount(): number {
    return this.blockedEdges.size;
  }

  public getNode(nodeId: string): NavigationNode | undefined {
    return this.nodesMap.get(nodeId);
  }

  public getAllNodes(): NavigationNode[] {
    return Array.from(this.nodesMap.values());
  }

  public getAllEdges(): NavigationEdge[] {
    return this.edgesList;
  }

  /**
   * Returns valid walkable neighbors, filtering out blocked paths or restricted nodes.
   */
  public getNeighbors(nodeId: string): GraphNeighbor[] {
    if (this.isNodeBlocked(nodeId)) {
      return [];
    }

    const allNeighbors = this.adjacencyList.get(nodeId) || [];
    return allNeighbors.filter(
      (neighbor) =>
        !this.isNodeBlocked(neighbor.nodeId) &&
        !this.isEdgeBlocked(nodeId, neighbor.nodeId)
    );
  }

  public getNodePosition(nodeId: string): Position3D | undefined {
    return this.nodesMap.get(nodeId)?.position;
  }

  public getNodeForBuilding(buildingId: string): string | undefined {
    return this.buildingToNodeMap.get(buildingId);
  }

  public getBuildingForNode(nodeId: string): string | undefined {
    return this.nodeToBuildingMap.get(nodeId);
  }

  public getScaleFactor(): number {
    return this.scaleFactor;
  }

  public getStats(): GraphStats {
    return {
      totalNodes: this.nodesMap.size,
      totalEdges: this.edgesList.length,
      blockedEdgesCount: this.blockedEdges.size,
      blockedNodesCount: this.blockedNodes.size,
    };
  }
}
