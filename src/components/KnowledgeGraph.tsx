"use client";

import { useEffect, useRef, useState } from "react";
import { Project, GraphNode, ChatMessage, Feature } from "@/types";
import FeaturePanel from "./FeaturePanel";

const IMPACT_MAP: Record<string, string[]> = {
  db:     ["api", "test", "cursor"],
  api:    ["prd", "test", "claude"],
  prd:    ["flow", "api"],
  flow:   ["prd"],
  test:   ["api", "db"],
  claude: ["cursor"],
  cursor: ["claude"],
};

const NODE_ANGLES = [0, 51, 102, 153, 204, 255, 306];

interface Props {
  project: Project;
  onDocUpdate: (nodeId: string, doc: string) => void;
  onFeaturesUpdate?: (features: Feature[]) => void;
  onStackUpdate?: (stackUpdate: Record<string, string>) => void;
}

export default function KnowledgeGraph({ project, onDocUpdate, onFeaturesUpdate, onStackUpdate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [impacted, setImpacted] = useState<string[]>([]);

  // Right panel: "chat" = doc gen, "doc" = view doc
  const [rightPanel, setRightPanel] = useState<"chat" | "doc" | null>(null);
  const [chatNode, setChatNode] = useState<GraphNode | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stackNotice, setStackNotice] = useState<Record<string, string> | null>(null);

  // Left panel: feature management
  const [showFeatures, setShowFeatures] = useState(true);

  const nodes = project.nodes ?? [];

  useEffect(() => {
    function calc() {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.33;
      const pos: Record<string, { x: number; y: number }> = {};
      nodes.forEach((node, i) => {
        const angle = ((NODE_ANGLES[i] ?? i * 51) * Math.PI) / 180;
        pos[node.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      });
      setPositions(pos);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [nodes, showFeatures, rightPanel]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleNodeClick(node: GraphNode) {
    if (activeNode === node.id) { reset(); return; }
    setActiveNode(node.id);
    setImpacted(IMPACT_MAP[node.id] ?? []);
  }

  function reset() {
    setActiveNode(null);
    setImpacted([]);
  }

  function openDocGen(node: GraphNode) {
    setChatNode(node);
    setMessages([{
      role: "assistant",
      content: `**${node.emoji} ${node.label}** 문서를 생성할게요.\n\n${project.name}의 ${node.label}에 대해 설명해주세요. 어떤 기능인가요?`,
    }]);
    setInput("");
    setRightPanel("chat");
  }

  function viewDoc(node: GraphNode) {
    setChatNode(node);
    setRightPanel("doc");
  }

  async function sendMessage() {
    if (!input.trim() || loading || !chatNode) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs,
          nodeType: chatNode.type,
          nodeLabel: chatNode.label,
          projectName: project.name,
          projectIdea: project.idea,
        }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.content }]);
      if (data.document) {
        onDocUpdate(chatNode.id, data.document);
      }
      if (data.stackUpdate && Object.keys(data.stackUpdate).length > 0) {
        onStackUpdate?.(data.stackUpdate);
        setStackNotice(data.stackUpdate);
        setTimeout(() => setStackNotice(null), 5000);
      }
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* ── LEFT: Feature Panel ─────────────────────────────── */}
      {showFeatures && (
        <div style={{
          width: 260,
          borderRight: "1px solid var(--border)",
          background: "var(--bg2)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}>
          <FeaturePanel
            features={project.features ?? []}
            onUpdate={(features) => onFeaturesUpdate?.(features)}
          />
        </div>
      )}

      {/* ── CENTER: Graph ────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              style={{
                padding: "5px 10px",
                background: showFeatures ? "var(--primary-light)" : "var(--bg2)",
                color: showFeatures ? "var(--primary)" : "var(--text-sub)",
                border: "1px solid",
                borderColor: showFeatures ? "var(--primary)" : "var(--border)",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ☰ Features
            </button>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Product Knowledge Graph</div>
              <div style={{ fontSize: 11, color: "var(--text-sub)" }}>
                클릭: 영향도 분석 · 더블클릭: 문서 생성
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {activeNode && (
              <>
                <div style={{
                  padding: "5px 12px",
                  background: "var(--danger-light)",
                  color: "var(--danger)",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  ⚠️ {impacted.length}개 영향
                </div>
                <button onClick={reset} style={{
                  padding: "5px 10px", background: "var(--bg2)",
                  border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, cursor: "pointer", color: "var(--text-sub)",
                }}>
                  리셋
                </button>
              </>
            )}
            {/* Legend */}
            <div style={{ display: "flex", gap: 6 }}>
              {nodes.filter((n) => n.document).map((n) => (
                <button
                  key={n.id}
                  onClick={() => viewDoc(n)}
                  title={`${n.label} 문서 보기`}
                  style={{
                    padding: "4px 8px",
                    background: "var(--success-light)",
                    color: "var(--success)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✓ {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph canvas */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--bg2)" }}>
          {/* SVG lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {nodes.map((node) => {
              const pos = positions[node.id];
              const bRect = containerRef.current?.getBoundingClientRect();
              if (!pos || !bRect) return null;
              const cx = bRect.width / 2;
              const cy = bRect.height / 2;
              const isActive = activeNode === node.id;
              const isImpacted = impacted.includes(node.id);
              return (
                <line
                  key={node.id}
                  x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                  stroke={isActive ? "#3B82F6" : isImpacted ? "#EF4444" : "#E2E8F0"}
                  strokeWidth={isActive || isImpacted ? 2 : 1.5}
                  strokeDasharray={isImpacted ? "5,4" : "none"}
                />
              );
            })}
          </svg>

          {/* Center master node */}
          <div
            onClick={reset}
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              left: "50%", top: "50%",
              background: "var(--bg)",
              border: "2px solid var(--primary)",
              borderRadius: 20,
              padding: "16px 24px",
              cursor: "pointer",
              boxShadow: "0 0 0 8px rgba(59,130,246,0.08), var(--shadow-md)",
              textAlign: "center",
              minWidth: 150,
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.08em", marginBottom: 4 }}>
              CORE FEATURE
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
              {project.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              더블클릭: 문서 생성
            </div>
          </div>

          {/* Surrounding nodes */}
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;
            const isActive = activeNode === node.id;
            const isImpacted = impacted.includes(node.id);
            const hasDoc = !!node.document;

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  left: pos.x, top: pos.y,
                  background: isImpacted ? "#FEF2F2" : isActive ? "var(--primary-light)" : "var(--bg)",
                  border: "2px solid",
                  borderColor: isImpacted ? "var(--danger)" : isActive ? "var(--primary)" : hasDoc ? "var(--success)" : "var(--border)",
                  borderRadius: 16,
                  padding: "12px 16px",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(59,130,246,0.15), var(--shadow-md)"
                    : isImpacted
                    ? "0 0 0 3px rgba(239,68,68,0.08)"
                    : "var(--shadow-sm)",
                  textAlign: "center",
                  minWidth: 100,
                  transition: "all 0.2s",
                  zIndex: 5,
                  userSelect: "none",
                }}
                onClick={() => handleNodeClick(node)}
                onDoubleClick={() => openDocGen(node)}
              >
                {/* Impact badge */}
                {isImpacted && (
                  <div style={{
                    position: "absolute", top: -10, right: -6,
                    background: "var(--danger)", color: "#fff",
                    fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 4,
                  }}>
                    변경감지
                  </div>
                )}
                {/* Doc badge */}
                {hasDoc && !isImpacted && (
                  <div style={{
                    position: "absolute", top: -8, left: -6,
                    background: "var(--success)", color: "#fff",
                    fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 4,
                  }}>
                    ✓
                  </div>
                )}
                <div style={{ fontSize: 22, marginBottom: 4 }}>{node.emoji}</div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: isImpacted ? "var(--danger)" : isActive ? "var(--primary)" : "var(--text)",
                }}>
                  {node.label}
                </div>
                {hasDoc && (
                  <div
                    onClick={(e) => { e.stopPropagation(); viewDoc(node); }}
                    style={{
                      fontSize: 9, color: "var(--success)", marginTop: 3, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    보기 →
                  </div>
                )}
              </div>
            );
          })}

          {/* Impact report */}
          {activeNode && impacted.length > 0 && (
            <div style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              background: "var(--bg)", border: "1px solid var(--danger)",
              borderRadius: 16, padding: "16px 20px",
              boxShadow: "var(--shadow-lg)", minWidth: 340, maxWidth: 520, zIndex: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)", marginBottom: 10 }}>
                ⚠️ 영향도 분석 리포트
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {impacted.map((id) => {
                  const n = nodes.find((x) => x.id === id);
                  if (!n) return null;
                  return (
                    <div key={id} style={{
                      padding: "8px 12px", background: "var(--danger-light)",
                      borderRadius: 8, fontSize: 12, color: "var(--text-sub)",
                    }}>
                      {n.emoji} <strong style={{ color: "var(--text)" }}>{n.label}</strong> — 검토 및 동기화 필요
                    </div>
                  );
                })}
              </div>
              <button
                onClick={reset}
                style={{
                  width: "100%", padding: "8px", background: "var(--primary)",
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                ✓ 동기화 완료
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Doc Gen Chat / Doc Viewer ────────────────── */}
      {rightPanel && chatNode && (
        <div style={{
          width: 380,
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          flexShrink: 0,
        }}>
          {/* Stack update toast */}
          {stackNotice && (
            <div style={{
              position: "absolute", bottom: 80, right: 400, zIndex: 50,
              background: "var(--bg)", border: "1.5px solid var(--primary)",
              borderRadius: 14, padding: "12px 16px",
              boxShadow: "var(--shadow-lg)", maxWidth: 280,
              animation: "fadeIn 0.2s ease",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", marginBottom: 6 }}>
                ⚡ AI가 스택을 감지했습니다
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {Object.entries(stackNotice).map(([k, v]) => (
                  <div key={k} style={{ fontSize: 12, color: "var(--text)" }}>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{k}: </span>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>
                → ForgeLaunch 스택 설정에 자동 반영됨
              </div>
            </div>
          )}

          {/* Panel header */}
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setRightPanel("chat")}
                style={{
                  padding: "5px 10px", borderRadius: 8, border: "1px solid",
                  borderColor: rightPanel === "chat" ? "var(--primary)" : "var(--border)",
                  background: rightPanel === "chat" ? "var(--primary-light)" : "transparent",
                  color: rightPanel === "chat" ? "var(--primary)" : "var(--text-sub)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}
              >
                AI 생성
              </button>
              {chatNode.document && (
                <button
                  onClick={() => setRightPanel("doc")}
                  style={{
                    padding: "5px 10px", borderRadius: 8, border: "1px solid",
                    borderColor: rightPanel === "doc" ? "var(--success)" : "var(--border)",
                    background: rightPanel === "doc" ? "var(--success-light)" : "transparent",
                    color: rightPanel === "doc" ? "var(--success)" : "var(--text-sub)",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  ✓ 문서 보기
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                {chatNode.emoji} {chatNode.label}
              </div>
              <button
                onClick={() => setRightPanel(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          </div>

          {rightPanel === "chat" ? (
            <>
              {/* Chat messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                      color: m.role === "user" ? "var(--primary)" : "var(--text-muted)",
                      marginBottom: 4,
                    }}>
                      {m.role === "user" ? "나" : "SpecForge AI"}
                    </div>
                    <div style={{
                      fontSize: 13, color: "var(--text)", lineHeight: 1.7,
                      background: m.role === "user" ? "var(--primary-light)" : "var(--bg2)",
                      border: "1px solid",
                      borderColor: m.role === "user" ? "rgba(59,130,246,0.2)" : "var(--border)",
                      borderRadius: 12, padding: "10px 14px", whiteSpace: "pre-wrap",
                    }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
                    생성 중...
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
                {chatNode.document && (
                  <div style={{
                    fontSize: 11, color: "var(--success)", background: "var(--success-light)",
                    border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8,
                    padding: "6px 10px", marginBottom: 8, fontWeight: 600,
                  }}>
                    ✓ 문서가 생성됐습니다 — "문서 보기" 탭에서 확인하세요
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="답변 또는 추가 요청..."
                    style={{
                      flex: 1, padding: "9px 14px",
                      border: "1px solid var(--border)", borderRadius: 10,
                      fontSize: 13, background: "var(--bg2)", color: "var(--text)", outline: "none",
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    style={{
                      padding: "9px 16px",
                      background: loading || !input.trim() ? "var(--bg3)" : "var(--primary)",
                      color: loading || !input.trim() ? "var(--text-muted)" : "#fff",
                      border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      cursor: loading || !input.trim() ? "default" : "pointer",
                    }}
                  >
                    전송
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Doc viewer */
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)" }}>
                  생성된 문서
                </div>
                <button
                  onClick={() => {
                    if (chatNode.document) {
                      navigator.clipboard.writeText(chatNode.document);
                    }
                  }}
                  style={{
                    padding: "5px 10px", background: "var(--bg2)",
                    border: "1px solid var(--border)", borderRadius: 8,
                    fontSize: 11, cursor: "pointer", color: "var(--text-sub)",
                  }}
                >
                  복사
                </button>
              </div>
              <pre style={{
                fontSize: 12,
                lineHeight: 1.8,
                color: "var(--text)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "16px",
                fontFamily: "'Pretendard', monospace",
              }}>
                {chatNode.document}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
