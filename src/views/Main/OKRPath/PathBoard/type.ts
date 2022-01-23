export interface PathNode extends d3.SimulationNodeDatum {
  id: string;
  data: any;
}

export interface PathLink extends d3.SimulationLinkDatum<PathNode> {}
