import { Project, GraphNode, ChecklistItem, AccountInfo } from "@/types";

export const DEFAULT_NODES: GraphNode[] = [
  { id: "prd",    label: "PRD",         emoji: "📄", type: "prd" },
  { id: "flow",   label: "User Flow",   emoji: "🗺️", type: "flow" },
  { id: "api",    label: "API Spec",    emoji: "🔌", type: "api" },
  { id: "db",     label: "DB Schema",   emoji: "💾", type: "db" },
  { id: "test",   label: "Test Case",   emoji: "🧪", type: "test" },
  { id: "claude", label: "CLAUDE.md",   emoji: "🧠", type: "claude" },
  { id: "cursor", label: ".cursorrules",emoji: "🤖", type: "cursor" },
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "node",       status: "red", note: "" },
  { id: "git",        status: "red", note: "" },
  { id: "vscode",     status: "red", note: "" },
  { id: "github",     status: "red", note: "" },
  { id: "firebase",   status: "red", note: "" },
  { id: "vercel",     status: "red", note: "" },
  { id: "apikey",     status: "red", note: "" },
  { id: "claude_md",  status: "red", note: "" },
  { id: "env_local",  status: "red", note: "" },
  { id: "pmf",        status: "red", note: "" },
  { id: "graph",      status: "red", note: "" },
];

export const DEFAULT_ACCOUNT: AccountInfo = {
  github:    { username: "", repoUrl: "" },
  firebase:  { projectId: "" },
  vercel:    { projectUrl: "" },
  geminiKey: "",
  anthropicKey: "",
  tools:     { node: "", git: "", vscode: false },
  defaultStack: { frontend: "vite", database: "supabase", styling: "tailwind" },
};

export function createProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: "",
    idea: "",
    stage: "dashboard",
    forge: {
      step: 1,
      stack: "next",
      stackDetail: { frontend: "vite", database: "supabase", styling: "tailwind" },
      sequence: "prd",
      cloudDone: {},
    },
    pmf: { problem: "", customer: "", value: "", market: "", timing: "", validated: false },
    features: [],
    nodes: DEFAULT_NODES,
    checklist: DEFAULT_CHECKLIST,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const LS_KEY = "specforge_projects";
const LS_ACCOUNT_KEY = "specforge_account";

export function lsLoad(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Project[]).map((p) => ({
      ...createProject(),
      ...p,
      stage: p.stage ?? "dashboard",
      forge: p.forge ?? { step: 1 as const, stack: "next", stackDetail: { frontend: "vite", database: "supabase", styling: "tailwind" }, sequence: "prd" as const, cloudDone: {} },
      pmf: p.pmf ?? { problem: "", customer: "", value: "", market: "", timing: "", validated: false },
      nodes: p.nodes?.length ? p.nodes : DEFAULT_NODES,
      checklist: p.checklist?.length ? p.checklist : DEFAULT_CHECKLIST,
    }));
  } catch {
    return [];
  }
}

export function lsSave(projects: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}

export function lsLoadAccount(): AccountInfo {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT;
  try {
    const raw = localStorage.getItem(LS_ACCOUNT_KEY);
    if (!raw) return DEFAULT_ACCOUNT;
    return { ...DEFAULT_ACCOUNT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ACCOUNT;
  }
}

export function lsSaveAccount(account: AccountInfo) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_ACCOUNT_KEY, JSON.stringify(account));
}
