"use client";

import { useState, useRef, useEffect } from "react";
import { PMFState } from "@/types";

const QUESTIONS = [
  {
    key: "problem" as const,
    label: "Problem",
    title: "어떤 문제를 해결하나요?",
    desc: "사용자가 겪는 핵심 불편함이나 해결되지 않은 문제를 구체적으로 설명하세요.",
    placeholder: "예: 기획자와 개발자 사이에서 문서가 항상 outdated 되어 있어 개발이 지연됩니다.",
    tag: "01 // Problem",
  },
  {
    key: "customer" as const,
    label: "Customer",
    title: "누가 이 문제를 겪나요?",
    desc: "이 문제를 가장 심각하게 겪는 구체적인 사용자 그룹을 정의하세요.",
    placeholder: "예: MVP를 처음 만드는 1인 또는 소규모 스타트업 창업자",
    tag: "02 // Customer",
  },
  {
    key: "value" as const,
    label: "Value",
    title: "왜 이 솔루션을 써야 하나요?",
    desc: "기존 대안 대비 이 제품이 제공하는 차별화된 가치를 설명하세요.",
    placeholder: "예: AI가 아이디어를 바로 PRD, API 명세, DB 스키마로 자동 변환해줘 개발 시간을 80% 단축합니다.",
    tag: "03 // Value",
  },
  {
    key: "market" as const,
    label: "Market",
    title: "시장이 존재하나요?",
    desc: "타겟 시장의 규모와 성장성, 경쟁 상황을 간략히 설명하세요.",
    placeholder: "예: 국내 스타트업 10만+ 개, AI 개발 도구 시장 연 40% 성장 중",
    tag: "04 // Market",
  },
  {
    key: "timing" as const,
    label: "Timing",
    title: "지금 해야 하는 이유는?",
    desc: "왜 지금이 최적의 타이밍인지 설명하세요.",
    placeholder: "예: LLM 품질이 실용 수준에 도달했고, 비개발자 창업이 급증하는 시점",
    tag: "05 // Timing",
  },
];

interface AIMessage {
  role: "user" | "ai";
  text: string;
}

interface Props {
  pmf: PMFState;
  projectName: string;
  onUpdate: (pmf: PMFState) => void;
  onComplete: () => void;
}

export default function PMFStage({ pmf, projectName, onUpdate, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [followUp, setFollowUp] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  useEffect(() => {
    setMessages([]);
    setFollowUp("");
  }, [step]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  async function requestFeedback(extraMessage?: string) {
    const answer = pmf[current.key]?.trim();
    if (!answer && !extraMessage) return;

    const userText = extraMessage || answer;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setFollowUp("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/pmf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionKey: current.key,
          questionTitle: current.title,
          answer: extraMessage ? `${answer}\n\n추가 답변: ${extraMessage}` : answer,
          projectName,
          allAnswers: {
            problem: pmf.problem,
            customer: pmf.customer,
            value: pmf.value,
            market: pmf.market,
            timing: pmf.timing,
          },
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "ai", text: data.content }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "AI 응답 오류가 발생했습니다." }]);
    } finally {
      setAiLoading(false);
    }
  }

  function handleNext() {
    if (isLast) {
      onUpdate({ ...pmf, validated: true });
      onComplete();
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "24px 40px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          PMF Validation Engine
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 2 }}>
              제품·시장 적합성 검증
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-sub)" }}>
              <strong style={{ color: "var(--text)" }}>{projectName || "프로젝트"}</strong>의 PMF를 검증합니다.
            </p>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)" }}>
            {Math.round(((step + 1) / QUESTIONS.length) * 100)}%
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "var(--bg3)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: "100%", width: `${((step + 1) / QUESTIONS.length) * 100}%`, background: "var(--primary)", borderRadius: 99, transition: "width 0.3s ease" }} />
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 6, marginBottom: 0 }}>
          {QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                flex: 1, padding: "5px 4px", borderRadius: 8, border: "1px solid",
                borderColor: i === step ? "var(--primary)" : (pmf[q.key] ? "#86EFAC" : "var(--border)"),
                background: i === step ? "var(--primary-light)" : (pmf[q.key] ? "#F0FDF4" : "var(--bg)"),
                fontSize: 10, fontWeight: 600,
                color: i === step ? "var(--primary)" : (pmf[q.key] ? "#16A34A" : "var(--text-muted)"),
                cursor: "pointer",
              }}
            >
              {pmf[q.key] ? "✓" : (i + 1)} {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden", padding: "16px 40px 24px" }}>

        {/* Left: Question */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingRight: 20, minWidth: 0 }}>
          <div style={{
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "24px", boxShadow: "var(--shadow-sm)",
            flex: 1, display: "flex", flexDirection: "column",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.1em", marginBottom: 10 }}>
              {current.tag}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
              {current.title}
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-sub)", marginBottom: 16, lineHeight: 1.7 }}>
              {current.desc}
            </p>
            <textarea
              value={pmf[current.key]}
              onChange={(e) => onUpdate({ ...pmf, [current.key]: e.target.value })}
              placeholder={current.placeholder}
              rows={5}
              style={{
                flex: 1, padding: "12px 14px", border: "1px solid var(--border)",
                borderRadius: 12, fontSize: 13, background: "var(--bg2)",
                color: "var(--text)", outline: "none", resize: "none",
                lineHeight: 1.7, fontFamily: "inherit",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />

            {/* AI feedback trigger */}
            <button
              onClick={() => requestFeedback()}
              disabled={!pmf[current.key]?.trim() || aiLoading}
              style={{
                marginTop: 10, padding: "10px 16px",
                background: !pmf[current.key]?.trim() ? "var(--bg3)" : "var(--primary)",
                color: !pmf[current.key]?.trim() ? "var(--text-muted)" : "#fff",
                border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600,
                cursor: !pmf[current.key]?.trim() ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              {aiLoading ? "AI 분석 중..." : "✦ AI 피드백 받기"}
            </button>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              style={{
                padding: "9px 20px", background: step === 0 ? "var(--bg3)" : "var(--bg)",
                color: step === 0 ? "var(--text-muted)" : "var(--text-sub)",
                border: "1px solid var(--border)", borderRadius: 10,
                fontSize: 12, fontWeight: 500, cursor: step === 0 ? "default" : "pointer",
              }}
            >
              ← 이전
            </button>
            <button
              onClick={handleNext}
              disabled={!pmf[current.key]?.trim()}
              style={{
                padding: "9px 22px",
                background: !pmf[current.key]?.trim() ? "var(--bg3)" : (isLast ? "#16A34A" : "var(--primary)"),
                color: !pmf[current.key]?.trim() ? "var(--text-muted)" : "#fff",
                border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600,
                cursor: !pmf[current.key]?.trim() ? "default" : "pointer",
              }}
            >
              {isLast ? "✓ PMF 완료 →" : "다음 →"}
            </button>
          </div>
        </div>

        {/* Right: AI Coach */}
        <div style={{
          width: 340, flexShrink: 0, display: "flex", flexDirection: "column",
          background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20,
          boxShadow: "var(--shadow-sm)", overflow: "hidden",
        }}>
          {/* Coach header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
            background: "var(--primary-light)", flexShrink: 0,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>✦ AI PMF 코치</div>
            <div style={{ fontSize: 10, color: "var(--text-sub)", marginTop: 2 }}>답변을 분석하고 개선을 도와드립니다</div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                  답변을 입력하고<br /><strong>AI 피드백 받기</strong>를 클릭하면<br />분석과 심화 질문을 드립니다
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                padding: "10px 13px", borderRadius: 12, fontSize: 12, lineHeight: 1.75,
                background: msg.role === "user" ? "var(--primary-light)" : "var(--bg2)",
                color: msg.role === "user" ? "var(--primary)" : "var(--text)",
                border: `1px solid ${msg.role === "user" ? "var(--primary)" : "var(--border)"}`,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "90%",
                whiteSpace: "pre-wrap",
              }}>
                {msg.role === "ai" && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>✦ AI 코치</div>
                )}
                {msg.text}
              </div>
            ))}
            {aiLoading && (
              <div style={{ padding: "10px 13px", borderRadius: 12, fontSize: 12, background: "var(--bg2)", border: "1px solid var(--border)", alignSelf: "flex-start" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>✦ AI 코치</div>
                <span style={{ color: "var(--text-muted)" }}>분석 중...</span>
              </div>
            )}
          </div>

          {/* Follow-up input */}
          {messages.length > 0 && (
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", gap: 6 }}>
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && followUp.trim()) requestFeedback(followUp); }}
                placeholder="추가 질문이나 답변..."
                style={{
                  flex: 1, padding: "8px 10px", border: "1px solid var(--border)",
                  borderRadius: 8, fontSize: 12, background: "var(--bg2)",
                  color: "var(--text)", outline: "none", fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => { if (followUp.trim()) requestFeedback(followUp); }}
                disabled={!followUp.trim() || aiLoading}
                style={{
                  padding: "8px 12px", background: "var(--primary)", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600,
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
