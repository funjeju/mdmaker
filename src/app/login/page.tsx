"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle();
    } catch {
      setError("Google 로그인에 실패했습니다. 다시 시도해주세요.");
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
        width: 400,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 28,
        padding: "44px 36px",
        boxShadow: "var(--shadow-lg)",
        textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          SpecForge
        </div>
        <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 36, lineHeight: 1.6 }}>
          Idea To Product Operating System
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 10,
            fontSize: 12,
            color: "#DC2626",
            marginBottom: 16,
            textAlign: "left",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            padding: "14px",
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            boxShadow: "var(--shadow-sm)",
            transition: "box-shadow 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Google로 계속하기
        </button>

        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 24, lineHeight: 1.7 }}>
          계속 진행하면 서비스 이용약관 및<br />개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
