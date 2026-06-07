"use client";

import { useState } from "react";
import { Project, ForgeState, ForgeStack } from "@/types";

// ─── Stack Options ────────────────────────────────────────────────────────────

const FRONTEND_OPTIONS = [
  { key: "next",    icon: "▲",  label: "Next.js",      desc: "풀스택 · SSR · App Router" },
  { key: "vite",    icon: "⚡", label: "Vite + React", desc: "SPA · 빠른 빌드" },
  { key: "react",   icon: "⚛️", label: "CRA / React",  desc: "전통적 SPA" },
  { key: "vue",     icon: "💚", label: "Vue 3",         desc: "경량 · Composition API" },
  { key: "nuxt",    icon: "🟢", label: "Nuxt 3",        desc: "Vue 기반 풀스택" },
  { key: "svelte",  icon: "🔥", label: "SvelteKit",    desc: "초경량 · 컴파일 기반" },
  { key: "skip",    icon: "⏭️", label: "잘 모름",      desc: "스킵" },
];

const DATABASE_OPTIONS = [
  { key: "firebase",   icon: "🔥", label: "Firebase",      desc: "Firestore + Auth" },
  { key: "supabase",   icon: "⚡", label: "Supabase",      desc: "PostgreSQL + Auth" },
  { key: "mongodb",    icon: "🍃", label: "MongoDB Atlas",  desc: "NoSQL · 유연한 스키마" },
  { key: "prisma",     icon: "💎", label: "Prisma + PG",   desc: "ORM · PostgreSQL" },
  { key: "planetscale",icon: "🌍", label: "PlanetScale",   desc: "MySQL · 서버리스" },
  { key: "skip",       icon: "⏭️", label: "잘 모름",       desc: "스킵" },
];

const STYLING_OPTIONS = [
  { key: "tailwind",   icon: "🎨", label: "Tailwind CSS",  desc: "유틸리티 퍼스트 · 표준" },
  { key: "shadcn",     icon: "🌑", label: "shadcn/ui",     desc: "Tailwind + Radix UI 컴포넌트" },
  { key: "mui",        icon: "🔷", label: "MUI",           desc: "Material Design 컴포넌트" },
  { key: "chakra",     icon: "⚡", label: "Chakra UI",     desc: "접근성 · 유연한 컴포넌트" },
  { key: "styled",     icon: "💅", label: "styled-comp.",  desc: "CSS-in-JS" },
  { key: "vanilla",    icon: "📄", label: "CSS / SCSS",    desc: "순수 CSS" },
  { key: "skip",       icon: "⏭️", label: "잘 모름",       desc: "스킵" },
];

// ─── Popular Presets ──────────────────────────────────────────────────────────

const PRESETS = [
  { label: "Next.js + Firebase + shadcn", frontend: "next",   database: "firebase",    styling: "shadcn",   tag: "🔥 인기" },
  { label: "Next.js + Supabase + shadcn", frontend: "next",   database: "supabase",    styling: "shadcn",   tag: "📈 성장중" },
  { label: "Vite + Firebase + Tailwind",  frontend: "vite",   database: "firebase",    styling: "tailwind", tag: "⚡ 빠름" },
  { label: "Next.js + Prisma + Tailwind", frontend: "next",   database: "prisma",      styling: "tailwind", tag: "💎 견고함" },
];

// ─── Sequences ────────────────────────────────────────────────────────────────

const SEQUENCES = [
  {
    key: "prd",
    title: "기획(PRD) 먼저",
    desc: "아이디어·기능 설계 완성 후 개발환경 구성. AI 에이전트 최적화.",
    tag: "AI-NATIVE · 권장",
    tagColor: "var(--success)",
  },
  {
    key: "env",
    title: "개발환경 먼저",
    desc: "Git, VS Code, DB 등 인프라 세팅 후 기획 진행. 기존 방식.",
    tag: "STANDARD FLOW",
    tagColor: "var(--text-muted)",
  },
] as const;

// ─── Cloud / ENV ──────────────────────────────────────────────────────────────

const CLOUD_STEPS = [
  { icon: "🔥", title: "Firebase 프로젝트 생성", desc: "Firebase 콘솔에서 새 프로젝트를 추가합니다.", label: "콘솔 이동", url: "https://console.firebase.google.com/" },
  { icon: "🔑", title: "인증(Auth) 활성화", desc: "Google OAuth 등 인증 수단을 활성화합니다.", label: "인증 설정", url: "https://console.firebase.google.com/project/_/authentication/providers" },
  { icon: "💾", title: "Firestore 데이터베이스 생성", desc: "Cloud Firestore를 생성하고 규칙을 설정합니다.", label: "Firestore 생성", url: "https://console.firebase.google.com/project/_/firestore" },
];

const ENV_TEMPLATE = `NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTerminalCommands(stackDetail: ForgeStack, sequence: string) {
  const isNext = stackDetail.frontend === "next";
  const isVite = stackDetail.frontend === "vite";

  if (sequence === "prd") {
    return [
      "mkdir -p my-project && cd my-project",
      isNext ? "npx create-next-app@latest . --typescript --tailwind --app" : isVite ? "npm create vite@latest . -- --template react-ts" : "npm init -y",
      stackDetail.database === "firebase" ? "npm install firebase" : stackDetail.database === "supabase" ? "npm install @supabase/supabase-js" : "npm install",
      stackDetail.styling === "shadcn" ? "npx shadcn@latest init" : "",
      "mkdir -p docs/features",
      'echo "# CLAUDE.md" > CLAUDE.md && echo "" > .cursorrules',
      "code .",
    ].filter(Boolean);
  }
  return [
    "node -v && git --version",
    "git init",
    'git commit --allow-empty -m "init"',
    "npm install -g @anthropic-ai/claude-code",
    "code .",
  ];
}

function getFolderStructure(stackDetail: ForgeStack, sequence: string) {
  const isNext = stackDetail.frontend === "next";
  if (sequence === "prd") {
    return [
      { depth: 0, icon: "📂", name: "my-project/", highlight: false },
      ...(isNext ? [
        { depth: 1, icon: "📂", name: "app/", highlight: false },
        { depth: 1, icon: "📂", name: "components/", highlight: false },
      ] : [{ depth: 1, icon: "📂", name: "src/", highlight: false }]),
      { depth: 1, icon: "📂", name: "docs/features/", highlight: false },
      { depth: 1, icon: "📄", name: "CLAUDE.md", highlight: true },
      { depth: 1, icon: "📄", name: ".cursorrules", highlight: true },
      { depth: 1, icon: "📄", name: ".env.local", highlight: false },
    ];
  }
  return [
    { depth: 0, icon: "📂", name: "my-project/", highlight: false },
    { depth: 1, icon: "📂", name: ".git/", highlight: true },
    { depth: 1, icon: "📄", name: "CLAUDE.md", highlight: true },
    { depth: 1, icon: "📄", name: ".cursorrules", highlight: true },
    { depth: 1, icon: "📄", name: ".env.local", highlight: false },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StackGroup({
  title, options, selected, onSelect,
}: {
  title: string;
  options: typeof FRONTEND_OPTIONS;
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const active = selected === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onSelect(o.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: active ? "var(--primary)" : "var(--border)",
                background: active ? "var(--primary-light)" : "var(--bg)",
                cursor: "pointer",
                transition: "all 0.12s",
                boxShadow: active ? "0 0 0 3px rgba(59,130,246,0.1)" : "var(--shadow-sm)",
              }}
            >
              <span style={{ fontSize: 16 }}>{o.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: active ? "var(--primary)" : "var(--text)", lineHeight: 1.2 }}>
                  {o.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.2 }}>
                  {o.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  project: Project;
  onUpdate: (forge: ForgeState) => void;
  onComplete: () => void;
}

const DEFAULT_STACK_DETAIL: ForgeStack = { frontend: "next", database: "firebase", styling: "tailwind" };

export default function ForgeLaunch({ project, onUpdate, onComplete }: Props) {
  const forge = project.forge ?? {
    step: 1, stack: "next",
    stackDetail: DEFAULT_STACK_DETAIL,
    sequence: "prd", cloudDone: {},
  };
  const stackDetail: ForgeStack = forge.stackDetail ?? DEFAULT_STACK_DETAIL;

  const [copied, setCopied] = useState(false);
  const [envCopied, setEnvCopied] = useState(false);
  const [cloudDone, setCloudDone] = useState<Record<number, boolean>>(forge.cloudDone ?? {});

  function setForge(partial: Partial<ForgeState>) {
    onUpdate({ ...forge, ...partial });
  }

  function setStep(step: 1 | 2 | 3 | 4) { setForge({ step }); }

  function updateStack(field: keyof ForgeStack, value: string) {
    setForge({ stackDetail: { ...stackDetail, [field]: value } });
  }

  function applyPreset(p: typeof PRESETS[0]) {
    setForge({ stackDetail: { frontend: p.frontend, database: p.database, styling: p.styling } });
  }

  function handleCopyTerminal() {
    navigator.clipboard.writeText(getTerminalCommands(stackDetail, forge.sequence).join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyEnv() {
    navigator.clipboard.writeText(ENV_TEMPLATE);
    setEnvCopied(true); setTimeout(() => setEnvCopied(false), 2000);
  }

  function handleCloudAction(i: number, url: string) {
    window.open(url, "_blank");
    const next = { ...cloudDone, [i]: true };
    setCloudDone(next);
    setForge({ cloudDone: next });
  }

  const steps = [
    { n: 1, label: "환경 설정" },
    { n: 2, label: "워크스페이스" },
    { n: 3, label: "클라우드" },
    { n: 4, label: "환경변수" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          ForgeLaunch Engine
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          프로젝트 시작 준비
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-sub)" }}>개발 환경을 진단하고 최적의 시작 경로를 설정합니다.</p>
      </div>

      {/* Step tabs */}
      <div style={{
        display: "flex", gap: 4, background: "var(--bg2)",
        border: "1px solid var(--border)", borderRadius: 14,
        padding: 4, marginBottom: 28, width: "fit-content",
      }}>
        {steps.map((s) => (
          <button
            key={s.n}
            onClick={() => setStep(s.n as 1 | 2 | 3 | 4)}
            style={{
              padding: "7px 18px", borderRadius: 10, border: "none",
              background: forge.step === s.n ? "var(--bg)" : "transparent",
              color: forge.step === s.n ? "var(--primary)" : "var(--text-sub)",
              fontWeight: forge.step === s.n ? 600 : 400,
              fontSize: 13, cursor: "pointer",
              boxShadow: forge.step === s.n ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s",
            }}
          >
            {s.n}. {s.label}
          </button>
        ))}
      </div>

      {/* ── STEP 1 ─────────────────────────────────────────── */}
      {forge.step === 1 && (
        <div>
          {/* Presets */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
              추천 조합 빠른 선택
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map((p) => {
                const active =
                  stackDetail.frontend === p.frontend &&
                  stackDetail.database === p.database &&
                  stackDetail.styling === p.styling;
                return (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 10,
                      border: "1.5px solid",
                      borderColor: active ? "var(--primary)" : "var(--border)",
                      background: active ? "var(--primary-light)" : "var(--bg2)",
                      fontSize: 12, fontWeight: 500,
                      color: active ? "var(--primary)" : "var(--text-sub)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: active ? "var(--primary)" : "var(--text-muted)" }}>{p.tag}</span>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected summary */}
          <div style={{
            padding: "10px 16px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            marginBottom: 24,
            fontSize: 12,
            color: "var(--text-sub)",
            display: "flex",
            gap: 16,
          }}>
            <span>선택된 스택:</span>
            <strong style={{ color: "var(--primary)" }}>
              {FRONTEND_OPTIONS.find(o => o.key === stackDetail.frontend)?.label || "-"}
            </strong>
            <span>+</span>
            <strong style={{ color: "var(--primary)" }}>
              {DATABASE_OPTIONS.find(o => o.key === stackDetail.database)?.label || "-"}
            </strong>
            <span>+</span>
            <strong style={{ color: "var(--primary)" }}>
              {STYLING_OPTIONS.find(o => o.key === stackDetail.styling)?.label || "-"}
            </strong>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>직접 선택</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <StackGroup title="프론트엔드 프레임워크" options={FRONTEND_OPTIONS} selected={stackDetail.frontend} onSelect={(v) => updateStack("frontend", v)} />
          <StackGroup title="데이터베이스 / 백엔드" options={DATABASE_OPTIONS} selected={stackDetail.database} onSelect={(v) => updateStack("database", v)} />
          <StackGroup title="UI 스타일링" options={STYLING_OPTIONS} selected={stackDetail.styling} onSelect={(v) => updateStack("styling", v)} />

          {/* Sequence */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, marginTop: 8 }}>
            빌드 시작 순서
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            {SEQUENCES.map((s) => (
              <button
                key={s.key}
                onClick={() => setForge({ sequence: s.key })}
                style={{
                  padding: "18px 20px",
                  borderRadius: 16,
                  border: "1.5px solid",
                  borderColor: forge.sequence === s.key ? "var(--primary)" : "var(--border)",
                  background: forge.sequence === s.key ? "var(--primary-light)" : "var(--bg)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  boxShadow: forge.sequence === s.key ? "0 0 0 3px rgba(59,130,246,0.08)" : "var(--shadow-sm)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: forge.sequence === s.key ? "var(--primary)" : "var(--text)", marginBottom: 6 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: s.tagColor }}>{s.tag}</div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setStep(2)} style={btnPrimary}>다음: 워크스페이스 구축 →</button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ─────────────────────────────────────────── */}
      {forge.step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>필수 도구 설치 확인</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 16 }}>아래 도구들이 설치되어 있어야 합니다.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { icon: "💻", name: "VS Code", desc: "코드 편집기", url: "https://code.visualstudio.com/" },
              { icon: "🐙", name: "Git", desc: "버전 관리", url: "https://git-scm.com/downloads" },
              { icon: "🟩", name: "Node.js LTS", desc: "런타임", url: "https://nodejs.org/" },
            ].map((tool) => (
              <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)",
                  background: "var(--bg)", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ fontSize: 22 }}>{tool.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tool.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--primary)" }}>설치 →</div>
              </a>
            ))}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>로컬 워크스페이스 설정</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 16 }}>터미널에 아래 명령어를 붙여넣으세요.</p>

          <div style={{ background: "#0F172A", borderRadius: 16, padding: "18px 22px", marginBottom: 20, position: "relative" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>TERMINAL</div>
            {getTerminalCommands(stackDetail, forge.sequence).map((cmd, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "var(--primary)", fontFamily: "monospace", fontSize: 12 }}>$</span>
                <span style={{ color: "#22C55E", fontFamily: "monospace", fontSize: 12 }}>{cmd}</span>
              </div>
            ))}
            <button onClick={handleCopyTerminal} style={{
              position: "absolute", top: 14, right: 14,
              background: copied ? "#22C55E" : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
            }}>
              {copied ? "✓ 복사됨" : "📋 복사"}
            </button>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "var(--text)" }}>생성될 폴더 구조</h3>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
            {getFolderStructure(stackDetail, forge.sequence).map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                paddingLeft: item.depth * 18, marginBottom: 6, fontSize: 12,
                fontFamily: "monospace",
                color: item.highlight ? "var(--primary)" : "var(--text-sub)",
              }}>
                {item.icon} {item.name}
                {item.highlight && (
                  <span style={{ fontSize: 9, background: "var(--primary-light)", color: "var(--primary)", padding: "1px 5px", borderRadius: 4, fontFamily: "sans-serif" }}>
                    AI 연동
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={btnSecondary}>← 이전</button>
            <button onClick={() => setStep(3)} style={btnPrimary}>다음: 클라우드 연동 →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ─────────────────────────────────────────── */}
      {forge.step === 3 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>클라우드 인프라 연동</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 24 }}>각 버튼을 클릭해 설정을 완료하세요.</p>

          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
            {CLOUD_STEPS.map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: i < CLOUD_STEPS.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 22 }}>{step.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{step.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-sub)" }}>{step.desc}</div>
                  </div>
                </div>
                <button onClick={() => handleCloudAction(i, step.url)} style={cloudDone[i] ? btnSuccess : btnPrimary}>
                  {cloudDone[i] ? "✓ 완료" : step.label}
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={btnSecondary}>← 이전</button>
            <button onClick={() => setStep(4)} style={btnPrimary}>다음: 환경변수 →</button>
          </div>
        </div>
      )}

      {/* ── STEP 4 ─────────────────────────────────────────── */}
      {forge.step === 4 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>환경변수 설정</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 24 }}>
            아래 내용을 복사해 <code style={{ background: "var(--bg2)", padding: "2px 6px", borderRadius: 4 }}>.env.local</code>에 붙여넣고 값을 채우세요.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>.env.local 템플릿</span>
                <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 400 }}>Vercel 일괄 붙여넣기 가능</span>
              </div>
              <textarea readOnly value={ENV_TEMPLATE} style={{
                width: "100%", height: 200, background: "#0F172A", border: "none",
                borderRadius: 14, padding: "14px 16px", fontFamily: "monospace",
                fontSize: 12, color: "#22C55E", resize: "none", lineHeight: 1.8,
              }} />
              <button onClick={handleCopyEnv} style={{ ...btnPrimary, marginTop: 10, width: "100%" }}>
                {envCopied ? "✓ 복사됨" : "⚡ 환경변수 일괄 복사"}
              </button>
            </div>

            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>💡 Vercel 배포 팁</div>
                <p style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 1.8 }}>
                  Vercel → Environment Variables 칸에 포커스 두고 <strong>Ctrl+V</strong>로 붙여넣으면 Key·Value 자동 파싱됩니다.
                </p>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
                Firebase 콘솔 → 프로젝트 설정 → 웹 앱 → SDK 설정에서 값을 확인하세요.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(3)} style={btnSecondary}>← 이전</button>
            <button onClick={onComplete} style={{
              padding: "11px 28px", background: "var(--success)", color: "#fff",
              border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              🎉 설정 완료 — PMF 검증으로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "9px 20px", background: "var(--primary)", color: "#fff",
  border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "9px 20px", background: "var(--bg)", color: "var(--text-sub)",
  border: "1px solid var(--border)", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer",
};

const btnSuccess: React.CSSProperties = {
  padding: "9px 20px", background: "var(--success-light)", color: "var(--success)",
  border: "1px solid var(--success)", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "default",
};
