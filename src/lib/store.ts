import { Project, GraphNode } from "@/types";

export const DEFAULT_NODES: GraphNode[] = [
  { id: "prd", label: "PRD", emoji: "📄", type: "prd" },
  { id: "flow", label: "User Flow", emoji: "🗺️", type: "flow" },
  { id: "api", label: "API Spec", emoji: "🔌", type: "api" },
  { id: "db", label: "DB Schema", emoji: "💾", type: "db" },
  { id: "test", label: "Test Case", emoji: "🧪", type: "test" },
  { id: "claude", label: "CLAUDE.md", emoji: "🧠", type: "claude" },
  { id: "cursor", label: ".cursorrules", emoji: "🤖", type: "cursor" },
];

export function createProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: "",
    idea: "",
    stage: "forgelaunch",
    forge: { step: 1, stack: "next", sequence: "prd", cloudDone: {} },
    pmf: { problem: "", customer: "", value: "", market: "", timing: "", validated: false },
    features: [],
    nodes: DEFAULT_NODES,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// localStorage fallback (used before Firebase loads)
const LS_KEY = "specforge_projects";

export function lsLoad(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Project[]).map((p) => ({
      ...createProject(),
      ...p,
      forge: p.forge ?? { step: 1 as const, stack: "next" as const, sequence: "prd" as const, cloudDone: {} },
      pmf: p.pmf ?? { problem: "", customer: "", value: "", market: "", timing: "", validated: false },
      nodes: p.nodes?.length ? p.nodes : DEFAULT_NODES,
    }));
  } catch {
    return [];
  }
}

export function lsSave(projects: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}
