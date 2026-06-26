"use client";

import { useEffect, useState, useCallback } from "react";
import { bridge, isDesktop, type DetectMap, type KeyMap } from "@/lib/desktop";
import { LOCAL_TOOLS, ACCESS_LINKS, API_KEYS } from "@/lib/devenv";

// ─── 신호등 점 ────────────────────────────────────────────────
function Dot({ color }: { color: string }) {
  return (
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 0 3px ${color}33`, flexShrink: 0 }} />
  );
}

export default function DevEnvPanel() {
  const desktop = isDesktop();
  const [detect, setDetect] = useState<DetectMap | null>(null);
  const [scanning, setScanning] = useState(false);
  const [keys, setKeys] = useState<KeyMap>({});
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [envMsg, setEnvMsg] = useState<string | null>(null);

  const scan = useCallback(async () => {
    if (!desktop) return;
    setScanning(true);
    const result = await bridge.detectAll();
    setDetect(result);
    setScanning(false);
  }, [desktop]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (desktop) {
        const result = await bridge.detectAll();
        if (alive) setDetect(result);
      }
      const k = await bridge.getKeys();
      if (alive) setKeys(k);
    })();
    return () => {
      alive = false;
    };
  }, [desktop]);

  function updateKey(id: string, value: string) {
    setKeys((prev) => {
      const next = { ...prev, [id]: value };
      bridge.setKeys(next);
      return next;
    });
  }

  async function copyKey(id: string) {
    const v = keys[id];
    if (!v) return;
    await navigator.clipboard.writeText(v);
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  }

  async function injectEnv() {
    // 입력된 키만 envName으로 매핑해서 .env.local에 기록
    const vars: KeyMap = {};
    for (const k of API_KEYS) {
      if (keys[k.id]) vars[k.envName] = keys[k.id];
    }
    if (Object.keys(vars).length === 0) {
      setEnvMsg("입력된 API 키가 없습니다.");
      return;
    }
    const res = await bridge.writeEnv(vars);
    if (!res) {
      setEnvMsg("⚠️ .env.local 자동 기록은 데스크톱 앱에서만 가능합니다. (웹에서는 복사 버튼 사용)");
      return;
    }
    if (res.canceled) return;
    setEnvMsg(res.ok ? `✅ .env.local 에 저장됨: ${res.file}` : "저장 실패");
  }

  const card = { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" } as const;
  const head = { padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "space-between" } as const;
  const headTitle = { fontSize: 13, fontWeight: 700, color: "var(--text)" } as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 데스크톱/웹 모드 안내 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
        background: desktop ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
        border: `1px solid ${desktop ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
        fontSize: 12, color: desktop ? "#16A34A" : "#B45309",
      }}>
        {desktop
          ? "🖥 데스크톱 모드 — 설치 감지·버전·키 암호화·.env.local 주입이 모두 자동입니다."
          : "🌐 웹 모드 — 자동 감지는 데스크톱 앱(exe)에서만. 지금은 다운로드·접속 링크와 키 복사를 사용하세요."}
      </div>

      {/* ── 1. 로컬 설치 감지 ───────────────────────────── */}
      <div style={card}>
        <div style={head}>
          <span style={headTitle}>🖥 로컬 개발 도구 — 설치 감지 & 버전</span>
          {desktop && (
            <button onClick={scan} disabled={scanning} style={{
              padding: "4px 12px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--bg)", color: "var(--text-sub)", fontSize: 11, fontWeight: 600,
              cursor: scanning ? "default" : "pointer",
            }}>
              {scanning ? "스캔 중…" : "🔄 다시 스캔"}
            </button>
          )}
        </div>
        {LOCAL_TOOLS.map((t) => {
          const st = detect?.[t.id];
          const installed = st?.installed;
          const dotColor = !desktop ? "#9CA3AF" : installed ? "#22C55E" : "#EF4444";
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: "1px solid var(--bg2)" }}>
              <Dot color={dotColor} />
              <div style={{ fontSize: 18 }}>{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.desc}</div>
              </div>

              {/* 상태 표시 */}
              {desktop && installed ? (
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: "#F0FDF4", color: "#16A34A", whiteSpace: "nowrap" }}>
                  설치됨 {st?.version && st.version !== "unknown" ? `v${st.version}` : ""}
                </div>
              ) : desktop ? (
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: "#FEF2F2", color: "#DC2626", whiteSpace: "nowrap" }}>
                  미설치
                </div>
              ) : (
                <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8, background: "var(--bg2)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  감지 불가
                </div>
              )}

              {/* 다운로드 버튼 — 미설치/웹일 때 강조 */}
              <button
                onClick={() => bridge.openExternal(t.downloadUrl)}
                style={{
                  padding: "5px 12px", borderRadius: 8, border: "none", flexShrink: 0,
                  fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  background: desktop && installed ? "var(--bg2)" : t.accent,
                  color: desktop && installed ? "var(--text-muted)" : "#fff",
                }}
              >
                다운로드 ↗
              </button>
            </div>
          );
        })}
      </div>

      {/* ── 2. 접속 & 생성 다이렉트 링크 ─────────────────── */}
      <div style={card}>
        <div style={head}><span style={headTitle}>🔗 접속 & 생성 — 로그인 후 바로 만들기</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
          {ACCESS_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => bridge.openExternal(l.url)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
                borderRight: "1px solid var(--bg2)", borderBottom: "1px solid var(--bg2)",
                background: "var(--bg)", cursor: "pointer", textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg)")}
            >
              <div style={{ fontSize: 20 }}>{l.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{l.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{l.desc}</div>
              </div>
              <span style={{ fontSize: 12, color: l.accent, fontWeight: 700 }}>↗</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. API 키 금고 + .env.local 주입 ──────────────── */}
      <div style={card}>
        <div style={head}>
          <span style={headTitle}>🔑 API 키 금고 {desktop ? "(로컬 암호화 저장)" : "(브라우저 로컬 저장)"}</span>
          <button onClick={injectEnv} style={{
            padding: "5px 12px", borderRadius: 8, border: "none", background: "var(--primary)",
            color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
            📄 .env.local 에 넣기
          </button>
        </div>

        {API_KEYS.map((k) => {
          const val = keys[k.id] || "";
          const shown = reveal[k.id];
          return (
            <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--bg2)" }}>
              <div style={{ fontSize: 16 }}>{k.icon}</div>
              <div style={{ width: 116, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{k.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{k.envName}</div>
              </div>
              <input
                type={shown ? "text" : "password"}
                value={val}
                onChange={(e) => updateKey(k.id, e.target.value)}
                placeholder="키 붙여넣기…"
                style={{
                  flex: 1, minWidth: 0, padding: "6px 10px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--bg2)",
                  color: "var(--text)", fontSize: 12, fontFamily: "monospace",
                }}
              />
              <button onClick={() => setReveal((r) => ({ ...r, [k.id]: !r[k.id] }))} title="보기/숨기기"
                style={{ padding: "5px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", fontSize: 12 }}>
                {shown ? "🙈" : "👁"}
              </button>
              <button onClick={() => copyKey(k.id)} disabled={!val} title="복사"
                style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid var(--border)", background: copied === k.id ? "#F0FDF4" : "var(--bg)", color: copied === k.id ? "#16A34A" : "var(--text-sub)", cursor: val ? "pointer" : "default", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                {copied === k.id ? "복사됨 ✓" : "복사"}
              </button>
              <button onClick={() => bridge.openExternal(k.issueUrl)} title="키 발급"
                style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: k.accent, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                발급 ↗
              </button>
            </div>
          );
        })}

        {envMsg && (
          <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-sub)", wordBreak: "break-all" }}>{envMsg}</div>
        )}
      </div>
    </div>
  );
}
