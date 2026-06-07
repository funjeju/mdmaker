"use client";

import { User } from "firebase/auth";
import { Project } from "@/types";

const STAGE_LABEL: Record<string, string> = {
  forgelaunch: "ForgeLaunch",
  pmf: "PMF 검증",
  graph: "Product Graph",
};

const STAGE_COLOR: Record<string, string> = {
  forgelaunch: "var(--primary)",
  pmf: "#F59E0B",
  graph: "var(--success)",
};

interface Props {
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete?: (id: string) => void;
  user?: User | null;
  onSignOut?: () => void;
}

export default function Sidebar({ projects, activeId, onSelect, onNew, onDelete, user, onSignOut }: Props) {
  return (
    <aside style={{
      width: 240,
      background: "#FAFAFA",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 6 }}>
          <span>⚡</span> SpecForge
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          Idea To Product OS
        </div>
      </div>

      {/* New project */}
      <div style={{ padding: "12px 12px 8px" }}>
        <button
          onClick={onNew}
          style={{
            width: "100%",
            padding: "9px 14px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> 새 프로젝트
        </button>
      </div>

      {/* Project list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {projects.length === 0 && (
          <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "12px 10px" }}>
            프로젝트가 없습니다
          </div>
        )}
        {projects.map((p) => (
          <div key={p.id} style={{ position: "relative", marginBottom: 2 }}>
            <button
              onClick={() => onSelect(p.id)}
              style={{
                width: "100%",
                padding: "9px 10px",
                paddingRight: onDelete ? 32 : 10,
                background: activeId === p.id ? "var(--primary-light)" : "transparent",
                border: "none",
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <div style={{
                fontSize: 13,
                fontWeight: 500,
                color: activeId === p.id ? "var(--primary)" : "var(--text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {p.name || "이름 없는 프로젝트"}
              </div>
              <div style={{
                fontSize: 10,
                color: STAGE_COLOR[p.stage] ?? "var(--text-muted)",
                marginTop: 2,
                fontWeight: 500,
              }}>
                {STAGE_LABEL[p.stage] ?? p.stage}
              </div>
            </button>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                title="삭제"
                style={{
                  position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                  width: 22, height: 22, border: "none", borderRadius: 6,
                  background: "transparent", color: "var(--text-muted)",
                  cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "#FEE2E2"; (e.target as HTMLButtonElement).style.color = "#DC2626"; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "transparent"; (e.target as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* User info + sign out */}
      {user && (
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>
            {user.email}
          </div>
          <button
            onClick={onSignOut}
            style={{
              fontSize: 11, color: "var(--text-sub)", background: "none",
              border: "none", cursor: "pointer", padding: 0,
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </aside>
  );
}
