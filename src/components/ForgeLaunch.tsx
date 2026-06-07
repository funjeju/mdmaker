"use client";

import { useState } from "react";
import { Project, ForgeState } from "@/types";

const STACKS = [
  { key: "next", icon: "⚛️", label: "Next.js + Firebase" },
  { key: "react", icon: "⚡", label: "React + Supabase" },
  { key: "vue", icon: "💚", label: "Vue + Node Express" },
  { key: "skip", icon: "⏭️", label: "잘 모름 / 스킵" },
] as const;

const SEQUENCES = [
  {
    key: "prd",
    title: "기획(PRD) 먼저",
    desc: "아이디어와 기능 설계를 먼저 완성한 뒤, 확정된 내용으로 개발환경을 자동 구성합니다.",
    tag: "AI-NATIVE FLOW · 권장",
    tagColor: "var(--success)",
  },
  {
    key: "env",
    title: "개발환경 먼저",
    desc: "Git, VS Code, Firebase, Vercel 등 기본 인프라를 먼저 설정하고 기획을 진행합니다.",
    tag: "STANDARD FLOW",
    tagColor: "var(--text-muted)",
  },
] as const;

const CLOUD_STEPS = [
  {
    icon: "🔥",
    title: "Firebase 프로젝트 생성",
    desc: "Firebase 콘솔로 이동해 새 프로젝트를 추가합니다.",
    label: "콘솔 이동",
    url: "https://console.firebase.google.com/",
  },
  {
    icon: "🔑",
    title: "인증(Auth) 활성화",
    desc: "Anonymous / Google OAuth 인증을 활성화합니다.",
    label: "인증 설정",
    url: "https://console.firebase.google.com/project/_/authentication/providers",
  },
  {
    icon: "💾",
    title: "Firestore 데이터베이스 생성",
    desc: "Cloud Firestore를 생성하고 보안 규칙을 설정합니다.",
    label: "Firestore 생성",
    url: "https://console.firebase.google.com/project/_/firestore",
  },
];

const ENV_TEMPLATE = `NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=`;

interface Props {
  project: Project;
  onUpdate: (forge: ForgeState) => void;
  onComplete: () => void;
}

function getTerminalCommands(stack: string, sequence: string) {
  if (sequence === "prd") {
    return [
      "mkdir -p my-project && cd my-project",
      "npm init -y && npm i firebase",
      "mkdir -p docs/features",
      'echo "# CLAUDE.md" > CLAUDE.md',
      'echo "" > .cursorrules',
      "code .",
    ];
  }
  return [
    "node -v && git --version",
    "git init",
    'git commit --allow-empty -m "init"',
    "npm install -g @anthropic-ai/claude-code",
    "code .",
  ];
}

function getFolderStructure(stack: string, sequence: string) {
  if (sequence === "prd") {
    return [
      { depth: 0, icon: "📂", name: "my-project/", highlight: false },
      { depth: 1, icon: "📂", name: "docs/", highlight: false },
      { depth: 2, icon: "📂", name: "features/", highlight: false },
      { depth: 1, icon: "📄", name: "CLAUDE.md", highlight: true },
      { depth: 1, icon: "📄", name: ".cursorrules", highlight: true },
      { depth: 1, icon: "📄", name: ".env.local", highlight: false },
      { depth: 1, icon: "📄", name: "package.json", highlight: false },
    ];
  }
  return [
    { depth: 0, icon: "📂", name: "my-project/", highlight: false },
    { depth: 1, icon: "📂", name: ".git/", highlight: true },
    { depth: 1, icon: "📄", name: "CLAUDE.md", highlight: true },
    { depth: 1, icon: "📄", name: ".cursorrules", highlight: true },
    { depth: 1, icon: "📄", name: ".env.local", highlight: false },
    { depth: 1, icon: "📄", name: "package.json", highlight: false },
  ];
}

export default function ForgeLaunch({ project, onUpdate, onComplete }: Props) {
  const forge = project.forge ?? { step: 1, stack: "next", sequence: "prd", cloudDone: {} };
  const [copied, setCopied] = useState(false);
  const [envCopied, setEnvCopied] = useState(false);
  const [cloudDone, setCloudDone] = useState<Record<number, boolean>>(forge?.cloudDone ?? {});

  function setForge(partial: Partial<ForgeState>) {
    onUpdate({ ...forge, ...partial });
  }

  function setStep(step: 1 | 2 | 3 | 4) {
    setForge({ step });
  }

  function handleCopyTerminal() {
    const cmds = getTerminalCommands(forge.stack, forge.sequence).join("\n");
    navigator.clipboard.writeText(cmds);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyEnv() {
    navigator.clipboard.writeText(ENV_TEMPLATE);
    setEnvCopied(true);
    setTimeout(() => setEnvCopied(false), 2000);
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
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          ForgeLaunch Engine
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          프로젝트 시작 준비
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.7 }}>
          개발 환경을 진단하고 최적의 시작 경로를 설정합니다.
        </p>
      </div>

      {/* Step tabs */}
      <div style={{
        display: "flex",
        gap: 4,
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 4,
        marginBottom: 32,
        width: "fit-content",
      }}>
        {steps.map((s) => (
          <button
            key={s.n}
            onClick={() => setStep(s.n as 1 | 2 | 3 | 4)}
            style={{
              padding: "7px 18px",
              borderRadius: 10,
              border: "none",
              background: forge.step === s.n ? "var(--bg)" : "transparent",
              color: forge.step === s.n ? "var(--primary)" : "var(--text-sub)",
              fontWeight: forge.step === s.n ? 600 : 400,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: forge.step === s.n ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s",
            }}
          >
            {s.n}. {s.label}
          </button>
        ))}
      </div>

      {/* Step 1 */}
      {forge.step === 1 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>기술 스택 선택</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 20 }}>익숙한 개발 스택을 선택하세요. 모르시면 스킵해도 됩니다.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 36 }}>
            {STACKS.map((s) => (
              <button
                key={s.key}
                onClick={() => setForge({ stack: s.key })}
                style={{
                  padding: "20px 16px",
                  borderRadius: 16,
                  border: "2px solid",
                  borderColor: forge.stack === s.key ? "var(--primary)" : "var(--border)",
                  background: forge.stack === s.key ? "var(--primary-light)" : "var(--bg)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                  boxShadow: forge.stack === s.key ? "0 0 0 4px rgba(59,130,246,0.1)" : "var(--shadow-sm)",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: forge.stack === s.key ? "var(--primary)" : "var(--text)" }}>
                  {s.label}
                </div>
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>빌드 시작 순서</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 20 }}>어떤 순서로 시작할지 선택하세요.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
            {SEQUENCES.map((s) => (
              <button
                key={s.key}
                onClick={() => setForge({ sequence: s.key })}
                style={{
                  padding: "24px",
                  borderRadius: 20,
                  border: "2px solid",
                  borderColor: forge.sequence === s.key ? "var(--primary)" : "var(--border)",
                  background: forge.sequence === s.key ? "var(--primary-light)" : "var(--bg)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  boxShadow: forge.sequence === s.key ? "0 0 0 4px rgba(59,130,246,0.1)" : "var(--shadow-sm)",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: forge.sequence === s.key ? "var(--primary)" : "var(--text)", marginBottom: 8 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 16 }}>
                  {s.desc}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.tagColor }}>
                  {s.tag}
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setStep(2)} style={btnPrimary}>
              다음: 워크스페이스 구축 →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {forge.step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>필수 도구 설치 확인</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 16 }}>
            아래 도구들이 설치되어 있어야 합니다. 없으면 링크를 클릭해 먼저 설치하세요.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { icon: "💻", name: "VS Code", desc: "코드 편집기", url: "https://code.visualstudio.com/" },
              { icon: "🐙", name: "Git", desc: "버전 관리", url: "https://git-scm.com/downloads" },
              { icon: "🟩", name: "Node.js", desc: "런타임 (LTS)", url: "https://nodejs.org/" },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "16px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 24 }}>{tool.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tool.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--primary)" }}>설치 →</div>
              </a>
            ))}
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>로컬 워크스페이스 설정</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 24 }}>
            도구 설치 후 아래 명령어를 VS Code 터미널에 붙여넣으면 프로젝트 폴더가 자동으로 생성됩니다.
          </p>

          {/* Terminal */}
          <div style={{
            background: "#0F172A",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 24,
            position: "relative",
          }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              TERMINAL
            </div>
            {getTerminalCommands(forge.stack, forge.sequence).map((cmd, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--primary)", fontFamily: "monospace", fontSize: 13, userSelect: "none" }}>$</span>
                <span style={{ color: "#22C55E", fontFamily: "monospace", fontSize: 13 }}>{cmd}</span>
              </div>
            ))}
            <button
              onClick={handleCopyTerminal}
              style={{
                position: "absolute", top: 16, right: 16,
                background: copied ? "#22C55E" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", fontSize: 11, padding: "4px 10px",
                borderRadius: 6, cursor: "pointer",
              }}
            >
              {copied ? "✓ 복사됨" : "📋 복사"}
            </button>
          </div>

          {/* Folder structure */}
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>생성될 폴더 구조</h3>
          <div style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 32,
          }}>
            {getFolderStructure(forge.stack, forge.sequence).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingLeft: item.depth * 20,
                  marginBottom: 8,
                  fontSize: 13,
                  fontFamily: "monospace",
                  color: item.highlight ? "var(--primary)" : "var(--text-sub)",
                }}
              >
                {item.icon} {item.name}
                {item.highlight && (
                  <span style={{ fontSize: 10, background: "var(--primary-light)", color: "var(--primary)", padding: "1px 6px", borderRadius: 4, fontFamily: "sans-serif" }}>
                    AI 에이전트 연동
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

      {/* Step 3 */}
      {forge.step === 3 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>클라우드 인프라 연동</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 24 }}>
            각 버튼을 클릭해 Firebase 설정을 완료하세요.
          </p>

          <div style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 32,
            boxShadow: "var(--shadow-sm)",
          }}>
            {CLOUD_STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: i < CLOUD_STEPS.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 24 }}>{step.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-sub)" }}>{step.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCloudAction(i, step.url)}
                  style={cloudDone[i] ? {
                    ...btnSuccess,
                  } : btnPrimary}
                >
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

      {/* Step 4 */}
      {forge.step === 4 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>환경변수 설정</h2>
          <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 24 }}>
            아래 내용을 복사해 <code style={{ background: "var(--bg2)", padding: "2px 6px", borderRadius: 4 }}>.env.local</code> 파일에 붙여넣고 값을 채우세요.
            Vercel 배포 시 Environment Variables 칸에 통째로 붙여넣으면 자동 파싱됩니다.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>.env.local 템플릿</span>
                <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 400 }}>Vercel 일괄 붙여넣기 가능</span>
              </div>
              <textarea
                readOnly
                value={ENV_TEMPLATE}
                style={{
                  width: "100%",
                  height: 200,
                  background: "#0F172A",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 18px",
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#22C55E",
                  resize: "none",
                  lineHeight: 1.8,
                }}
              />
              <button
                onClick={handleCopyEnv}
                style={{ ...btnPrimary, marginTop: 10, width: "100%" }}
              >
                {envCopied ? "✓ 복사됨" : "⚡ 환경변수 일괄 복사"}
              </button>
            </div>

            <div style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>💡 Vercel 배포 팁</div>
                <p style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 1.8 }}>
                  Vercel 프로젝트 설정의 <strong>Environment Variables</strong> 페이지에서
                  첫 번째 Name 칸에 포커스를 두고 복사한 내용을 <strong>Ctrl+V</strong>로 붙여넣으면
                  모든 Key·Value가 자동으로 파싱됩니다.
                </p>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
                Firebase 콘솔 → 프로젝트 설정 → 웹 앱 → SDK 설정에서 값을 확인하세요.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStep(3)} style={btnSecondary}>← 이전</button>
            <button
              onClick={onComplete}
              style={{
                padding: "11px 28px",
                background: "var(--success)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🎉 설정 완료 — Product Graph로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "10px 22px",
  background: "var(--primary)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 22px",
  background: "var(--bg)",
  color: "var(--text-sub)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};

const btnSuccess: React.CSSProperties = {
  padding: "10px 22px",
  background: "var(--success-light)",
  color: "var(--success)",
  border: "1px solid var(--success)",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  cursor: "default",
};
