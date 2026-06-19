"use client";

import { Project, ProjectStage } from "@/types";

const STAGES: { key: ProjectStage; label: string; emoji: string }[] = [
  { key: "dashboard",   label: "대시보드",     emoji: "📊" },
  { key: "forgelaunch", label: "ForgeLaunch", emoji: "🚀" },
  { key: "pmf",         label: "PMF 검증",    emoji: "🎯" },
  { key: "graph",       label: "Product Graph", emoji: "🧩" },
];

// 상단 우측 — AI 코딩 도구 바로가기
const AI_TOOLS: { label: string; emoji: string; url: string; accent: string }[] = [
  { label: "Z.ai",       emoji: "💬", url: "https://chat.z.ai/",          accent: "#2563EB" },
  { label: "클로드코드", emoji: "🟧", url: "https://claude.com/claude-code", accent: "#D97757" },
  { label: "안티그래비티", emoji: "🪐", url: "https://antigravity.google/",  accent: "#4285F4" },
  { label: "커서AI",     emoji: "🖱️", url: "https://cursor.com/",          accent: "#111111" },
  { label: "코덱스",     emoji: "🤖", url: "https://chatgpt.com/codex",     accent: "#10A37F" },
];

interface Props {
  project: Project | null;
  onStageChange?: (stage: ProjectStage) => void;
}

export default function TopBar({ project, onStageChange }: Props) {
  return (
    <header style={{
      height: 56,
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 16,
      flexShrink: 0,
      background: "var(--bg)",
    }}>
      {project ? (
        <>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginRight: 4 }}>
            {project.name || "이름 없는 프로젝트"}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {STAGES.map((s) => {
              const isActive = project.stage === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onStageChange?.(s.key)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: isActive ? "var(--primary)" : "var(--border)",
                    background: isActive ? "var(--primary-light)" : "transparent",
                    color: isActive ? "var(--primary)" : "var(--text-sub)",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span>{s.emoji}</span> {s.label}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
          프로젝트를 선택하거나 새로 시작하세요
        </span>
      )}

      {/* AI 코딩 도구 바로가기 */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        {AI_TOOLS.map((t) => (
          <a
            key={t.label}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            title={t.label}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 11px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--bg2)",
              fontSize: 12, fontWeight: 600, color: "var(--text-sub)",
              textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = t.accent;
              e.currentTarget.style.color = t.accent;
              e.currentTarget.style.background = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-sub)";
              e.currentTarget.style.background = "var(--bg2)";
            }}
          >
            <span style={{ fontSize: 13 }}>{t.emoji}</span> {t.label}
          </a>
        ))}
      </div>
    </header>
  );
}
