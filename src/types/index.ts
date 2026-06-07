export type ProjectStage = "forgelaunch" | "pmf" | "graph";

export type ForgeStep = 1 | 2 | 3 | 4;

export interface ForgeStack {
  frontend: string;
  database: string;
  styling: string;
}

export interface ForgeState {
  step: ForgeStep;
  stack: string; // legacy, kept for migration
  stackDetail: ForgeStack;
  sequence: "prd" | "env";
  cloudDone: Record<number, boolean>;
}

export interface PMFState {
  problem: string;
  customer: string;
  value: string;
  market: string;
  timing: string;
  validated: boolean;
}

export type FeatureStatus = "idea" | "validated" | "designed" | "specified" | "implemented" | "released";
export type FeatureType = "core" | "supporting" | "operational";
export type FeaturePriority = "p0" | "p1" | "p2" | "p3";

export interface Feature {
  id: string;
  name: string;
  type: FeatureType;
  status: FeatureStatus;
  priority: FeaturePriority;
  description: string;
  dependencies: string[];
  createdAt: number;
}

export interface GraphNode {
  id: string;
  label: string;
  emoji: string;
  type: string;
  document?: string;
}

export interface Project {
  id: string;
  uid?: string;
  name: string;
  idea: string;
  stage: ProjectStage;
  forge: ForgeState;
  pmf: PMFState;
  features: Feature[];
  nodes: GraphNode[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
