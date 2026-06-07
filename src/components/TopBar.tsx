"use client";

import { Project, ProjectStage } from "@/types";

const STAGES: { key: ProjectStage; label: string; emoji: string }[] = [
  { key: "forgelaunch", label: "ForgeLaunch", emoji: "🚀" },
  { key: "pmf", label: "PMF 검증", emoji: "🎯" },
  { key: "graph", label: "Product Graph", emoji: "🧩" },
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
    </header>
  );
}
