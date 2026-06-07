"use client";

import { useState } from "react";
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

interface Props {
  pmf: PMFState;
  projectName: string;
  onUpdate: (pmf: PMFState) => void;
  onComplete: () => void;
}

export default function PMFStage({ pmf, projectName, onUpdate, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const allFilled = QUESTIONS.every((q) => (pmf[q.key] ?? "").trim().length > 0);

  function handleNext() {
    if (isLast) {
      onUpdate({ ...pmf, validated: true });
      onComplete();
    } else {
      setStep(step + 1);
    }
  }

  const progress = ((step) / QUESTIONS.length) * 100;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          PMF Validation Engine
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          제품·시장 적합성 검증
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-sub)" }}>
          <strong style={{ color: "var(--text)" }}>{projectName || "프로젝트"}</strong>의 PMF를 검증합니다. 구현 전에 반드시 통과해야 합니다.
        </p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-sub)" }}>{step + 1} / {QUESTIONS.length}</span>
          <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div style={{ height: 4, background: "var(--bg3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            background: "var(--primary)",
            borderRadius: 99,
            transition: "width 0.3s ease",
          }} />
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                flex: 1,
                padding: "6px 4px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: i === step ? "var(--primary)" : (pmf[q.key] ? "var(--success)" : "var(--border)"),
                background: i === step ? "var(--primary-light)" : (pmf[q.key] ? "var(--success-light)" : "var(--bg)"),
                fontSize: 10,
                fontWeight: 600,
                color: i === step ? "var(--primary)" : (pmf[q.key] ? "var(--success)" : "var(--text-muted)"),
                cursor: "pointer",
              }}
            >
              {pmf[q.key] ? "✓" : (i + 1)} {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current question card */}
      <div style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: "32px",
        boxShadow: "var(--shadow-md)",
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.1em", marginBottom: 12 }}>
          {current.tag}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
          {current.title}
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 20, lineHeight: 1.7 }}>
          {current.desc}
        </p>
        <textarea
          value={pmf[current.key]}
          onChange={(e) => onUpdate({ ...pmf, [current.key]: e.target.value })}
          placeholder={current.placeholder}
          rows={4}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid var(--border)",
            borderRadius: 14,
            fontSize: 14,
            background: "var(--bg2)",
            color: "var(--text)",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.7,
            fontFamily: "inherit",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* All answers summary */}
      {step > 0 && (
        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", marginBottom: 14 }}>지금까지 입력한 내용</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QUESTIONS.slice(0, step).map((q) => (
              pmf[q.key] && (
                <div key={q.key}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", marginBottom: 3 }}>{q.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{pmf[q.key]}</div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: "11px 24px",
            background: step === 0 ? "var(--bg3)" : "var(--bg)",
            color: step === 0 ? "var(--text-muted)" : "var(--text-sub)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            cursor: step === 0 ? "default" : "pointer",
          }}
        >
          ← 이전
        </button>

        <button
          onClick={handleNext}
          disabled={!pmf[current.key]?.trim()}
          style={{
            padding: "11px 28px",
            background: !pmf[current.key]?.trim() ? "var(--bg3)" : (isLast ? "var(--success)" : "var(--primary)"),
            color: !pmf[current.key]?.trim() ? "var(--text-muted)" : "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: !pmf[current.key]?.trim() ? "default" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {isLast ? "✓ PMF 검증 완료 — Product Graph로 이동" : "다음 →"}
        </button>
      </div>
    </div>
  );
}
