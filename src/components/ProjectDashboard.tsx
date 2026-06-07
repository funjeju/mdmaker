"use client";

import { Project, ChecklistItem, ChecklistStatus, AccountInfo, ProjectStage } from "@/types";

// ─── Checklist definition ─────────────────────────────────────────────────────

interface ChecklistDef {
  id: string;
  icon: string;
  label: string;
  desc: string;
  category: "환경" | "계정" | "키" | "프로젝트" | "문서";
  actionLabel?: string;
  actionStage?: ProjectStage;
  actionUrl?: string;
}

const CHECKLIST_DEFS: ChecklistDef[] = [
  // 환경
  { id: "node",      icon: "🟩", label: "Node.js",       desc: "LTS 버전 설치 필요",          category: "환경", actionLabel: "설치", actionUrl: "https://nodejs.org/" },
  { id: "git",       icon: "🐙", label: "Git",           desc: "버전 관리 시스템",             category: "환경", actionLabel: "설치", actionUrl: "https://git-scm.com/" },
  { id: "vscode",    icon: "💻", label: "VS Code",       desc: "코드 편집기",                  category: "환경", actionLabel: "설치", actionUrl: "https://code.visualstudio.com/" },
  // 계정 & 서비스
  { id: "github",    icon: "🐱", label: "GitHub 리포지토리", desc: "소스 코드 원격 저장소",    category: "계정", actionLabel: "설정", actionUrl: "https://github.com/new" },
  { id: "firebase",  icon: "🔥", label: "Firebase 프로젝트", desc: "Auth + Firestore 설정",  category: "계정", actionLabel: "설정", actionUrl: "https://console.firebase.google.com/" },
  { id: "vercel",    icon: "▲",  label: "Vercel 배포",   desc: "프로덕션 배포 연결",           category: "계정", actionLabel: "설정", actionUrl: "https://vercel.com/new" },
  // API Keys
  { id: "apikey",    icon: "🔑", label: "API 키",        desc: "Gemini / Anthropic 키 설정", category: "키",   actionLabel: "관리", actionStage: undefined },
  // 프로젝트
  { id: "env_local", icon: "📄", label: ".env.local",   desc: "환경변수 파일",                category: "프로젝트", actionLabel: "설정", actionStage: "forgelaunch" },
  { id: "claude_md", icon: "🧠", label: "CLAUDE.md",    desc: "AI 에이전트 컨텍스트 파일",   category: "문서",    actionLabel: "생성", actionStage: "graph" },
  // 검증
  { id: "pmf",       icon: "🎯", label: "PMF 검증",     desc: "제품·시장 적합성 완료",        category: "프로젝트", actionLabel: "시작", actionStage: "pmf" },
  { id: "graph",     icon: "🧩", label: "Product Graph", desc: "핵심 문서 1개 이상 생성",    category: "프로젝트", actionLabel: "시작", actionStage: "graph" },
];

const CATEGORY_ORDER = ["환경", "계정", "키", "프로젝트", "문서"] as const;

// ─── Traffic light ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<ChecklistStatus, { color: string; bg: string; label: string; dot: string }> = {
  green:  { color: "#16A34A", bg: "#F0FDF4", label: "완료",   dot: "#22C55E" },
  yellow: { color: "#B45309", bg: "#FFFBEB", label: "진행중", dot: "#F59E0B" },
  red:    { color: "#DC2626", bg: "#FEF2F2", label: "미완료", dot: "#EF4444" },
};

function TrafficDot({ status }: { status: ChecklistStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <div style={{
      width: 10, height: 10, borderRadius: "50%",
      background: cfg.dot,
      boxShadow: `0 0 0 3px ${cfg.dot}30`,
      flexShrink: 0,
    }} />
  );
}

// ─── Auto-detect from project state ──────────────────────────────────────────

function autoDetect(project: Project, account: AccountInfo): Partial<Record<string, ChecklistStatus>> {
  const map: Partial<Record<string, ChecklistStatus>> = {};

  // Node version set in account
  if (account.tools.node) map["node"] = "green";
  if (account.tools.git) map["git"] = "green";
  if (account.tools.vscode) map["vscode"] = "green";

  // Account info
  if (account.github.repoUrl) map["github"] = "green";
  if (account.firebase.projectId) map["firebase"] = "green";
  if (account.vercel.projectUrl) map["vercel"] = "green";
  if (account.geminiKey || account.anthropicKey) map["apikey"] = "green";

  // Project state
  const cloudAllDone = Object.keys(project.forge.cloudDone ?? {}).length >= 3;
  if (cloudAllDone) map["env_local"] = "green";

  if (project.pmf.validated) map["pmf"] = "green";
  else if (Object.values(project.pmf).some((v) => typeof v === "string" && v.trim())) map["pmf"] = "yellow";

  const hasDoc = project.nodes?.some((n) => n.document);
  if (hasDoc) map["graph"] = "green";

  const claudeNode = project.nodes?.find((n) => n.id === "claude");
  if (claudeNode?.document) map["claude_md"] = "green";

  return map;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  project: Project;
  account: AccountInfo;
  onChecklistUpdate: (checklist: ChecklistItem[]) => void;
  onNavigate: (stage: ProjectStage) => void;
  onOpenSettings: () => void;
}

export default function ProjectDashboard({ project, account, onChecklistUpdate, onNavigate, onOpenSettings }: Props) {
  const checklist = project.checklist ?? [];
  const autoMap = autoDetect(project, account);

  function getStatus(id: string): ChecklistStatus {
    // Auto-detection takes precedence for green
    if (autoMap[id] === "green") return "green";
    const manual = checklist.find((c) => c.id === id);
    return manual?.status ?? "red";
  }

  function cycleStatus(id: string) {
    const cur = getStatus(id);
    const next: ChecklistStatus = cur === "red" ? "yellow" : cur === "yellow" ? "green" : "red";
    const exists = checklist.find((c) => c.id === id);
    const updated = exists
      ? checklist.map((c) => c.id === id ? { ...c, status: next } : c)
      : [...checklist, { id, status: next, note: "" }];
    onChecklistUpdate(updated);
  }

  // Stats
  const statuses = CHECKLIST_DEFS.map((d) => getStatus(d.id));
  const green = statuses.filter((s) => s === "green").length;
  const yellow = statuses.filter((s) => s === "yellow").length;
  const red = statuses.filter((s) => s === "red").length;
  const total = CHECKLIST_DEFS.length;
  const pct = Math.round((green / total) * 100);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: CHECKLIST_DEFS.filter((d) => d.category === cat),
  }));

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          Project Dashboard
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 4 }}>
              {project.name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-sub)", maxWidth: 480 }}>{project.idea || "아이디어를 입력하세요."}</p>
          </div>
          <button
            onClick={onOpenSettings}
            style={{
              padding: "8px 14px", background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: 10, fontSize: 12, fontWeight: 500, color: "var(--text-sub)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ⚙️ 계정 설정
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "20px 24px",
        marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            개발 착수 준비도
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: pct === 100 ? "var(--success)" : "var(--primary)" }}>
            {pct}%
          </div>
        </div>
        <div style={{ height: 8, background: "var(--bg3)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: pct === 100 ? "var(--success)" : "var(--primary)",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "완료", count: green, color: "#22C55E" },
            { label: "진행중", count: yellow, color: "#F59E0B" },
            { label: "미완료", count: red, color: "#EF4444" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
              <span style={{ fontSize: 12, color: "var(--text-sub)" }}>{s.label} {s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        {([
          { stage: "forgelaunch" as ProjectStage, icon: "🚀", label: "ForgeLaunch" },
          { stage: "pmf" as ProjectStage,         icon: "🎯", label: "PMF 검증" },
          { stage: "graph" as ProjectStage,       icon: "🧩", label: "Product Graph" },
        ]).map((nav) => (
          <button
            key={nav.stage}
            onClick={() => onNavigate(nav.stage)}
            style={{
              flex: 1, padding: "12px 16px",
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: 14, cursor: "pointer", textAlign: "center",
              boxShadow: "var(--shadow-sm)", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.background = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--bg)";
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{nav.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{nav.label}</div>
          </button>
        ))}
      </div>

      {/* Checklist by category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {grouped.map(({ cat, items }) => (
          <div key={cat} style={{
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 16px", borderBottom: "1px solid var(--border)",
              fontSize: 11, fontWeight: 700, color: "var(--text-sub)",
              letterSpacing: "0.06em", textTransform: "uppercase",
              background: "var(--bg2)",
            }}>
              {cat}
            </div>
            {items.map((def) => {
              const status = getStatus(def.id);
              const cfg = STATUS_CFG[status];
              return (
                <div
                  key={def.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--bg2)",
                    gap: 12,
                  }}
                >
                  {/* Traffic dot — click to cycle */}
                  <button
                    onClick={() => cycleStatus(def.id)}
                    title="클릭해서 상태 변경"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: 0, display: "flex", alignItems: "center",
                    }}
                  >
                    <TrafficDot status={status} />
                  </button>

                  <div style={{ fontSize: 16 }}>{def.icon}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 1 }}>
                      {def.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{def.desc}</div>
                  </div>

                  {/* Status chip */}
                  <div style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px",
                    borderRadius: 6, background: cfg.bg, color: cfg.color,
                    flexShrink: 0,
                  }}>
                    {cfg.label}
                  </div>

                  {/* Action button */}
                  {def.actionStage ? (
                    <button
                      onClick={() => onNavigate(def.actionStage!)}
                      style={{
                        padding: "4px 10px", background: "var(--primary-light)",
                        color: "var(--primary)", border: "none", borderRadius: 6,
                        fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      {def.actionLabel} →
                    </button>
                  ) : def.id === "apikey" ? (
                    <button
                      onClick={onOpenSettings}
                      style={{
                        padding: "4px 10px", background: "var(--primary-light)",
                        color: "var(--primary)", border: "none", borderRadius: 6,
                        fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      관리 →
                    </button>
                  ) : def.actionUrl ? (
                    <a
                      href={def.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "4px 10px", background: "var(--bg2)",
                        color: "var(--text-sub)", border: "1px solid var(--border)", borderRadius: 6,
                        fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0,
                        textDecoration: "none",
                      }}
                    >
                      {def.actionLabel} ↗
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hint */}
      <div style={{ marginTop: 16, fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
        신호등 점을 클릭하면 상태를 수동으로 변경할 수 있습니다 · 일부 항목은 프로젝트 진행에 따라 자동 업데이트됩니다
      </div>
    </div>
  );
}
