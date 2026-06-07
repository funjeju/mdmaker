"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth() {
    if (!email || !password) return;
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? "오류가 발생했습니다.";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (msg.includes("email-already-in-use")) {
        setError("이미 사용 중인 이메일입니다.");
      } else if (msg.includes("weak-password")) {
        setError("비밀번호는 6자 이상이어야 합니다.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      setError("Google 로그인에 실패했습니다.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 420,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 28,
        padding: "40px 36px",
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
            SpecForge
          </div>
          <div style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 4 }}>
            Idea To Product Operating System
          </div>
        </div>

        {/* Tab */}
        <div style={{
          display: "flex",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}>
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "none",
                background: tab === t ? "var(--bg)" : "transparent",
                color: tab === t ? "var(--text)" : "var(--text-sub)",
                fontWeight: tab === t ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t === "login" ? "로그인" : "회원가입"}
            </button>
          ))}
        </div>

        {/* Email/PW */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            style={{
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: 14,
              fontSize: 14,
              background: "var(--bg2)",
              color: "var(--text)",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            style={{
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: 14,
              fontSize: 14,
              background: "var(--bg2)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 10,
            fontSize: 12,
            color: "#DC2626",
            marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading || !email || !password}
          style={{
            width: "100%",
            padding: "12px",
            background: loading || !email || !password ? "var(--bg3)" : "var(--primary)",
            color: loading || !email || !password ? "var(--text-muted)" : "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading || !email || !password ? "default" : "pointer",
            marginBottom: 12,
            transition: "all 0.15s",
          }}
        >
          {loading ? "처리 중..." : tab === "login" ? "이메일로 로그인" : "이메일로 회원가입"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>또는</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            padding: "12px",
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Google로 계속하기
        </button>

        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          계속 진행하면 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
