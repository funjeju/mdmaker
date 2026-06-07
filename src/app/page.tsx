"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loadProjects, saveProject, deleteProject } from "@/lib/db";
import { lsLoad, lsSave, lsLoadAccount, lsSaveAccount, createProject } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ForgeLaunch from "@/components/ForgeLaunch";
import PMFStage from "@/components/PMFStage";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import ProjectDashboard from "@/components/ProjectDashboard";
import SettingsPanel from "@/components/SettingsPanel";
import { Project, ForgeState, PMFState, ProjectStage, ChecklistItem, AccountInfo, Feature } from "@/types";

// ─── Stack options (quick select in modal) ───────────────────────────────────
const QUICK_FRONTEND = [
  { key: "next",   icon: "▲",  label: "Next.js" },
  { key: "vite",   icon: "⚡", label: "Vite+React" },
  { key: "vue",    icon: "💚", label: "Vue 3" },
  { key: "nuxt",   icon: "🟢", label: "Nuxt 3" },
];
const QUICK_DATABASE = [
  { key: "firebase",  icon: "🔥", label: "Firebase" },
  { key: "supabase",  icon: "⚡", label: "Supabase" },
  { key: "mongodb",   icon: "🍃", label: "MongoDB" },
  { key: "prisma",    icon: "💎", label: "Prisma+PG" },
];
const QUICK_STYLING = [
  { key: "tailwind", icon: "🎨", label: "Tailwind" },
  { key: "shadcn",   icon: "🌑", label: "shadcn/ui" },
  { key: "mui",      icon: "🔷", label: "MUI" },
  { key: "vanilla",  icon: "📄", label: "CSS" },
];

function QuickStackRow({
  label, options, selected, onSelect,
}: {
  label: string;
  options: { key: string; icon: string; label: string }[];
  selected: string;
  onSelect: (k: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: 6, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map((o) => {
          const active = selected === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onSelect(o.key)}
              style={{
                padding: "5px 10px", borderRadius: 8, border: "1.5px solid",
                borderColor: active ? "var(--primary)" : "var(--border)",
                background: active ? "var(--primary-light)" : "var(--bg2)",
                color: active ? "var(--primary)" : "var(--text-sub)",
                fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <span>{o.icon}</span> {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── New Project Modal (2-step) ───────────────────────────────────────────────
function NewProjectModal({ onConfirm, onClose, defaultStack }: {
  onConfirm: (name: string, idea: string, stack: { frontend: string; database: string; styling: string }) => void;
  onClose: () => void;
  defaultStack: { frontend: string; database: string; styling: string };
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [stack, setStack] = useState({ ...defaultStack });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        width: 520, background: "var(--bg)", borderRadius: 24,
        padding: "36px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
      }} onClick={(e) => e.stopPropagation()}>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              height: 3, flex: 1, borderRadius: 99,
              background: step >= s ? "var(--primary)" : "var(--bg3)",
              transition: "background 0.2s",
            }} />
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", marginBottom: 6 }}>
          {step === 1 ? "STEP 1 / 2 — 기본 정보" : "STEP 2 / 2 — 개발 환경"}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 20 }}>
          {step === 1 ? "새 프로젝트 시작" : "개발 스택 선택"}
        </h2>

        {step === 1 ? (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: 6 }}>프로젝트 이름 *</label>
                <input
                  autoFocus type="text" placeholder="예: SpecForge, TodoApp, ShopMate"
                  value={name} onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 12, fontSize: 14, background: "var(--bg2)", color: "var(--text)", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: 6 }}>아이디어 한 줄 설명</label>
                <textarea
                  placeholder="예: AI가 아이디어를 PRD/API/DB 문서로 자동 변환해주는 시스템"
                  value={idea} onChange={(e) => setIdea(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 12, fontSize: 14, background: "var(--bg2)", color: "var(--text)", outline: "none", resize: "none", lineHeight: 1.7, fontFamily: "inherit" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "var(--bg2)", color: "var(--text-sub)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                취소
              </button>
              <button
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
                style={{ flex: 2, padding: "11px", background: !name.trim() ? "var(--bg3)" : "var(--primary)", color: !name.trim() ? "var(--text-muted)" : "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: !name.trim() ? "default" : "pointer" }}
              >
                다음: 개발 환경 선택 →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              기본값은 계정 설정의 기본 스택입니다. 모르면 그냥 다음으로 넘어가세요.
            </p>
            <QuickStackRow label="프론트엔드" options={QUICK_FRONTEND} selected={stack.frontend} onSelect={(v) => setStack({ ...stack, frontend: v })} />
            <QuickStackRow label="데이터베이스" options={QUICK_DATABASE} selected={stack.database} onSelect={(v) => setStack({ ...stack, database: v })} />
            <QuickStackRow label="UI 스타일링" options={QUICK_STYLING} selected={stack.styling} onSelect={(v) => setStack({ ...stack, styling: v })} />

            {/* Selected summary */}
            <div style={{ padding: "10px 14px", background: "var(--primary-light)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, fontSize: 12, color: "var(--primary)", fontWeight: 600, marginTop: 4, marginBottom: 20 }}>
              ⚡ {[stack.frontend, stack.database, stack.styling].join(" + ")}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "11px", background: "var(--bg2)", color: "var(--text-sub)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                ← 이전
              </button>
              <button
                onClick={() => onConfirm(name.trim(), idea.trim(), stack)}
                style={{ flex: 2, padding: "11px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                🚀 프로젝트 생성
              </button>
            </div>
          </div>
        )}
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
  const [account, setAccount] = useState<AccountInfo>(lsLoadAccount());
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setDataLoading(true);
      try {
        const fp = await loadProjects(user!.uid);
        if (fp.length > 0) {
          setProjects(fp); setActiveId(fp[0].id);
        } else {
          const ls = lsLoad();
          if (ls.length > 0) {
            setProjects(ls); setActiveId(ls[0].id);
            for (const p of ls) await saveProject(user!.uid, p);
            lsSave([]);
          }
        }
      } catch {
        const ls = lsLoad();
        setProjects(ls);
        if (ls.length > 0) setActiveId(ls[0].id);
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
      const updated = next.find((p) => p.id === activeId);
      if (updated && user) saveProject(user.uid, updated).catch(console.error);
      else if (updated) lsSave(next);
      return next;
    });
  }, [activeId, user]);

  async function handleConfirmNew(name: string, idea: string, stack: { frontend: string; database: string; styling: string }) {
    const p = createProject();
    p.name = name;
    p.idea = idea;
    p.forge.stackDetail = { ...stack };
    const next = [p, ...projects];
    setProjects(next); setActiveId(p.id); setShowNewModal(false);
    if (user) await saveProject(user.uid, p).catch(console.error);
    else lsSave(next);
  }

  async function handleDelete(id: string) {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
    if (user) await deleteProject(id).catch(console.error);
    else lsSave(next);
  }

  function handleDocUpdate(nodeId: string, doc: string) {
    if (!activeProject) return;
    const nodes = activeProject.nodes.map((n) => n.id === nodeId ? { ...n, document: doc } : n);
    update({ nodes });
  }

  function handleSaveAccount(a: AccountInfo) {
    setAccount(a);
    lsSaveAccount(a);
    setShowSettings(false);
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg2)" }}>
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
        onNew={() => setShowNewModal(true)}
        onDelete={handleDelete}
        user={user}
        onSignOut={signOut}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar project={activeProject} onStageChange={(stage) => update({ stage })} />

        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {dataLoading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg2)" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>프로젝트 불러오는 중...</div>
            </div>
          ) : !activeProject ? (
            /* Empty state */
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, background: "var(--bg2)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 8 }}>SpecForge</div>
                <div style={{ fontSize: 14, color: "var(--text-sub)", marginBottom: 32 }}>Idea To Product Operating System</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setShowNewModal(true)} style={{ padding: "14px 32px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,0.3)" }}>
                    + 새 프로젝트 시작
                  </button>
                  <button onClick={() => setShowSettings(true)} style={{ padding: "14px 20px", background: "var(--bg)", color: "var(--text-sub)", border: "1px solid var(--border)", borderRadius: 14, fontSize: 14, cursor: "pointer" }}>
                    ⚙️ 계정 설정
                  </button>
                </div>
              </div>
            </div>
          ) : activeProject.stage === "dashboard" ? (
            <ProjectDashboard
              project={activeProject}
              account={account}
              onChecklistUpdate={(checklist: ChecklistItem[]) => update({ checklist })}
              onAccountUpdate={(a: AccountInfo) => { setAccount(a); lsSaveAccount(a); }}
              onNavigate={(stage: ProjectStage) => update({ stage })}
              onOpenSettings={() => setShowSettings(true)}
            />
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
              onFeaturesUpdate={(features: Feature[]) => update({ features })}
              onStackUpdate={(stackUpdate) => {
                const current = activeProject.forge.stackDetail ?? {};
                update({
                  forge: {
                    ...activeProject.forge,
                    stackDetail: { ...current, ...stackUpdate },
                  },
                });
              }}
            />
          )}
        </div>
      </div>

      {showNewModal && (
        <NewProjectModal
          onConfirm={handleConfirmNew}
          onClose={() => setShowNewModal(false)}
          defaultStack={account.defaultStack}
        />
      )}

      {showSettings && (
        <SettingsPanel account={account} onSave={handleSaveAccount} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
