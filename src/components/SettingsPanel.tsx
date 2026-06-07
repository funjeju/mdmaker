"use client";

import { useState } from "react";
import { AccountInfo } from "@/types";

const TABS = ["계정 & 서비스", "API 키", "기본 스택", "자동 시작"] as const;
type Tab = typeof TABS[number];

interface Props {
  account: AccountInfo;
  onSave: (account: AccountInfo) => void;
  onClose: () => void;
}

function Field({
  label, value, onChange, placeholder, type = "text", mono = false, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  const inputType = type === "password" ? (show ? "text" : "password") : type;
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: 5, letterSpacing: "0.04em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: type === "password" ? "9px 36px 9px 12px" : "9px 12px",
            border: "1px solid var(--border)", borderRadius: 10,
            fontSize: 13, background: "var(--bg2)", color: "var(--text)", outline: "none",
            fontFamily: mono ? "monospace" : "inherit",
          }}
        />
        {type === "password" && (
          <button
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-muted)",
            }}
          >
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {hint && <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const FRONTEND_OPTIONS = ["next", "vite", "react", "vue", "nuxt", "svelte"];
const DATABASE_OPTIONS = ["firebase", "supabase", "mongodb", "prisma", "planetscale"];
const STYLING_OPTIONS  = ["tailwind", "shadcn", "mui", "chakra", "styled", "vanilla"];

export default function SettingsPanel({ account, onSave, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("계정 & 서비스");
  const [draft, setDraft] = useState<AccountInfo>({ ...account });
  const [saved, setSaved] = useState(false);

  function update(path: string, value: unknown) {
    const parts = path.split(".");
    setDraft((prev) => {
      const next = { ...prev } as Record<string, unknown>;
      if (parts.length === 2) {
        next[parts[0]] = { ...(next[parts[0]] as Record<string, unknown>), [parts[1]]: value };
      } else {
        next[parts[0]] = value;
      }
      return next as unknown as AccountInfo;
    });
  }

  function handleSave() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "stretch", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div
        style={{
          width: 480, background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(15,23,42,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>⚙️ 계정 설정</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              계정 정보, API 키, 기본값을 관리합니다
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text-muted)" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "10px 4px", border: "none",
                background: "transparent",
                borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
                color: tab === t ? "var(--primary)" : "var(--text-muted)",
                fontWeight: tab === t ? 600 : 400,
                fontSize: 11, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* ── 계정 & 서비스 ─────────────────────── */}
          {tab === "계정 & 서비스" && (
            <div>
              <Section title="개발 도구 (설치된 버전 입력)">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field label="Node.js 버전" value={draft.tools.node} onChange={(v) => update("tools.node", v)} placeholder="예: 20.11.0" mono />
                  <Field label="Git 버전" value={draft.tools.git} onChange={(v) => update("tools.git", v)} placeholder="예: 2.44.0" mono />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-sub)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={draft.tools.vscode}
                      onChange={(e) => update("tools.vscode", e.target.checked)}
                      style={{ width: 14, height: 14 }}
                    />
                    VS Code 설치됨
                  </label>
                </div>
              </Section>

              <Section title="GitHub">
                <Field label="GitHub 유저네임" value={draft.github.username} onChange={(v) => update("github.username", v)} placeholder="예: funjeju" />
                <Field label="리포지토리 URL" value={draft.github.repoUrl} onChange={(v) => update("github.repoUrl", v)} placeholder="https://github.com/funjeju/my-project" />
              </Section>

              <Section title="Firebase">
                <Field label="프로젝트 ID" value={draft.firebase.projectId} onChange={(v) => update("firebase.projectId", v)} placeholder="예: myname-3f6e3" mono />
              </Section>

              <Section title="Vercel">
                <Field label="프로젝트 URL" value={draft.vercel.projectUrl} onChange={(v) => update("vercel.projectUrl", v)} placeholder="https://my-project.vercel.app" />
              </Section>
            </div>
          )}

          {/* ── API 키 ───────────────────────────── */}
          {tab === "API 키" && (
            <div>
              <div style={{
                padding: "10px 14px", background: "#FFFBEB", border: "1px solid #F59E0B40",
                borderRadius: 10, fontSize: 11, color: "#92400E", marginBottom: 20, lineHeight: 1.7,
              }}>
                🔒 API 키는 브라우저 로컬에만 저장되며 서버로 전송되지 않습니다. 공용 PC에서는 주의하세요.
              </div>
              <Field
                label="Gemini API Key"
                value={draft.geminiKey}
                onChange={(v) => update("geminiKey", v)}
                placeholder="AIza..."
                type="password"
                mono
                hint="Google AI Studio에서 발급 · 문서 생성 AI에 사용"
              />
              <Field
                label="Anthropic API Key"
                value={draft.anthropicKey}
                onChange={(v) => update("anthropicKey", v)}
                placeholder="sk-ant-..."
                type="password"
                mono
                hint="claude.ai에서 발급 · Claude Code 사용 시 필요"
              />
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-sub)", marginBottom: 10 }}>빠른 이동</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "Google AI Studio (Gemini 키 발급)", url: "https://aistudio.google.com/app/apikey" },
                    { label: "Anthropic Console (Claude 키 발급)", url: "https://console.anthropic.com/settings/keys" },
                  ].map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      ↗ {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 기본 스택 ─────────────────────────── */}
          {tab === "기본 스택" && (
            <div>
              <div style={{ fontSize: 12, color: "var(--text-sub)", marginBottom: 20, lineHeight: 1.7 }}>
                새 프로젝트 생성 시 기본으로 선택될 스택입니다.
              </div>
              {[
                { key: "frontend", label: "프론트엔드", options: FRONTEND_OPTIONS },
                { key: "database", label: "데이터베이스", options: DATABASE_OPTIONS },
                { key: "styling",  label: "UI 스타일링",  options: STYLING_OPTIONS },
              ].map(({ key, label, options }) => (
                <div key={key} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-sub)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {options.map((o) => {
                      const active = (draft.defaultStack as Record<string, string>)[key] === o;
                      return (
                        <button
                          key={o}
                          onClick={() => update(`defaultStack.${key}`, o)}
                          style={{
                            padding: "6px 12px", borderRadius: 8, border: "1.5px solid",
                            borderColor: active ? "var(--primary)" : "var(--border)",
                            background: active ? "var(--primary-light)" : "var(--bg2)",
                            color: active ? "var(--primary)" : "var(--text-sub)",
                            fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer",
                          }}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── 자동 시작 ─────────────────────────── */}
          {tab === "자동 시작" && (
            <div>
              <div style={{ fontSize: 12, color: "var(--text-sub)", marginBottom: 20, lineHeight: 1.7 }}>
                PC 시작 시 SpecForge dev 서버가 자동으로 실행되도록 설정합니다.
              </div>

              <Section title="Windows — 시작 프로그램 등록">
                <div style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 12 }}>
                  아래 내용을 복사해 <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: 4 }}>start-specforge.bat</code> 파일로 저장하고,<br />
                  <strong>Win+R → shell:startup</strong> 폴더에 넣으세요.
                </div>
                <div style={{
                  background: "#0F172A", borderRadius: 12, padding: "14px 16px",
                  fontFamily: "monospace", fontSize: 12, color: "#22C55E", lineHeight: 1.8,
                }}>
                  <div>@echo off</div>
                  <div>cd /d "C:\Users\funjeju\Desktop\aiproject\0_mdmaker"</div>
                  <div>start "" cmd /k "npx next dev"</div>
                  <div>timeout /t 3</div>
                  <div>start "" "http://localhost:3000"</div>
                </div>
                <button
                  onClick={() => {
                    const script = `@echo off\ncd /d "C:\\Users\\funjeju\\Desktop\\aiproject\\0_mdmaker"\nstart "" cmd /k "npx next dev"\ntimeout /t 3\nstart "" "http://localhost:3000"`;
                    navigator.clipboard.writeText(script);
                  }}
                  style={{ ...btnSmall, marginTop: 10 }}
                >
                  📋 배치 파일 내용 복사
                </button>
              </Section>

              <Section title="등록 방법">
                <ol style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 2, paddingLeft: 18 }}>
                  <li>위 내용을 <code style={{ background: "var(--bg3)", padding: "1px 4px", borderRadius: 3 }}>start-specforge.bat</code> 로 저장</li>
                  <li><strong>Win + R</strong> 키 누르기</li>
                  <li><code style={{ background: "var(--bg3)", padding: "1px 4px", borderRadius: 3 }}>shell:startup</code> 입력 후 엔터</li>
                  <li>열린 폴더에 bat 파일 붙여넣기</li>
                  <li>PC 재시작 시 자동으로 서버가 시작됩니다</li>
                </ol>
              </Section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0,
          background: "var(--bg2)",
        }}>
          <button onClick={onClose} style={btnSecondary}>취소</button>
          <button onClick={handleSave} style={btnPrimary}>
            {saved ? "✓ 저장됨" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-sub)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "9px 20px", background: "var(--primary)", color: "#fff",
  border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  padding: "9px 20px", background: "var(--bg)", color: "var(--text-sub)",
  border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer",
};
const btnSmall: React.CSSProperties = {
  padding: "6px 12px", background: "var(--bg2)", color: "var(--text-sub)",
  border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, cursor: "pointer",
};
