"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loadProjects, saveProject, deleteProject } from "@/lib/db";
import { lsLoad, lsSave, createProject } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ForgeLaunch from "@/components/ForgeLaunch";
import PMFStage from "@/components/PMFStage";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { Project, ForgeState, PMFState, ProjectStage } from "@/types";

// ─── New Project Modal ────────────────────────────────────────────────────────
function NewProjectModal({ onConfirm, onClose }: {
  onConfirm: (name: string, idea: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div
        style={{
          width: 480, background: "var(--bg)", borderRadius: 24,
          padding: "36px", boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", marginBottom: 8 }}>
          NEW PROJECT
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 24 }}>
          새 프로젝트 시작
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: 6 }}>
              프로젝트 이름
            </label>
            <input
              autoFocus
              type="text"
              placeholder="예: SpecForge, TodoApp, ShopMate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px",
                border: "1px solid var(--border)", borderRadius: 12,
                fontSize: 14, background: "var(--bg2)", color: "var(--text)", outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: 6 }}>
              아이디어 한 줄 설명
            </label>
            <textarea
              placeholder="예: AI가 아이디어를 PRD/API/DB 문서로 자동 변환해주는 제품 운영 시스템"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "12px 16px",
                border: "1px solid var(--border)", borderRadius: 12,
                fontSize: 14, background: "var(--bg2)", color: "var(--text)",
                outline: "none", resize: "none", lineHeight: 1.7, fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", background: "var(--bg2)",
              color: "var(--text-sub)", border: "1px solid var(--border)",
              borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            onClick={() => name.trim() && onConfirm(name.trim(), idea.trim())}
            disabled={!name.trim()}
            style={{
              flex: 2, padding: "11px",
              background: !name.trim() ? "var(--bg3)" : "var(--primary)",
              color: !name.trim() ? "var(--text-muted)" : "#fff",
              border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600,
              cursor: !name.trim() ? "default" : "pointer",
            }}
          >
            프로젝트 생성 →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to login if not authenticated (only after auth state resolved)
  useEffect(() => {
    if (authLoading) return; // wait for getRedirectResult + onAuthStateChanged
    if (!user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Load projects from Firestore (or localStorage fallback)
  useEffect(() => {
    if (!user) return;

    async function load() {
      setDataLoading(true);
      try {
        const firestoreProjects = await loadProjects(user!.uid);
        if (firestoreProjects.length > 0) {
          setProjects(firestoreProjects);
          setActiveId(firestoreProjects[0].id);
        } else {
          // Migrate from localStorage
          const lsProjects = lsLoad();
          if (lsProjects.length > 0) {
            setProjects(lsProjects);
            setActiveId(lsProjects[0].id);
            // Save to Firestore
            for (const p of lsProjects) {
              await saveProject(user!.uid, p);
            }
            lsSave([]); // Clear localStorage after migration
          }
        }
      } catch (err) {
        console.error("Failed to load from Firestore, using localStorage:", err);
        const lsProjects = lsLoad();
        setProjects(lsProjects);
        if (lsProjects.length > 0) setActiveId(lsProjects[0].id);
      } finally {
        setDataLoading(false);
      }
    }

    load();
  }, [user]);

  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  const update = useCallback(async (partial: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((p) =>
        p.id === activeId ? { ...p, ...partial, updatedAt: Date.now() } : p
      );
      // Persist
      const updated = next.find((p) => p.id === activeId);
      if (updated && user) {
        saveProject(user.uid, updated).catch(console.error);
      } else if (updated) {
        lsSave(next);
      }
      return next;
    });
  }, [activeId, user]);

  function handleNew() {
    setShowNewModal(true);
  }

  async function handleConfirmNew(name: string, idea: string) {
    const p = createProject();
    p.name = name;
    p.idea = idea;
    const next = [p, ...projects];
    setProjects(next);
    setActiveId(p.id);
    setShowNewModal(false);
    if (user) {
      await saveProject(user.uid, p).catch(console.error);
    } else {
      lsSave(next);
    }
  }

  async function handleDelete(id: string) {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
    if (user) {
      await deleteProject(id).catch(console.error);
    } else {
      lsSave(next);
    }
  }

  function handleDocUpdate(nodeId: string, doc: string) {
    if (!activeProject) return;
    const nodes = activeProject.nodes.map((n) =>
      n.id === nodeId ? { ...n, document: doc } : n
    );
    update({ nodes });
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg2)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 14, color: "var(--text-sub)" }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        projects={projects}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
        onDelete={handleDelete}
        user={user}
        onSignOut={signOut}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar
          project={activeProject}
          onStageChange={(stage) => update({ stage })}
        />

        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {dataLoading ? (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg2)",
            }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>프로젝트 불러오는 중...</div>
            </div>
          ) : !activeProject ? (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 20, background: "var(--bg2)",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 8 }}>
                  SpecForge
                </div>
                <div style={{ fontSize: 14, color: "var(--text-sub)", marginBottom: 32 }}>
                  Idea To Product Operating System
                </div>
                <button
                  onClick={handleNew}
                  style={{
                    padding: "14px 32px",
                    background: "var(--primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
                  }}
                >
                  + 새 프로젝트 시작
                </button>
              </div>
            </div>
          ) : activeProject.stage === "forgelaunch" ? (
            <ForgeLaunch
              project={activeProject}
              onUpdate={(forge: ForgeState) => update({ forge })}
              onComplete={() => update({ stage: "pmf" as ProjectStage })}
            />
          ) : activeProject.stage === "pmf" ? (
            <PMFStage
              pmf={activeProject.pmf}
              projectName={activeProject.name}
              onUpdate={(pmf: PMFState) => update({ pmf })}
              onComplete={() => update({ stage: "graph" as ProjectStage })}
            />
          ) : (
            <KnowledgeGraph
              project={activeProject}
              onDocUpdate={handleDocUpdate}
              onFeaturesUpdate={(features) => update({ features })}
            />
          )}
        </div>
      </div>

      {showNewModal && (
        <NewProjectModal
          onConfirm={handleConfirmNew}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
}
