"use client";

import { useEffect, useRef, useState } from "react";
import { Project, GraphNode, ChatMessage } from "@/types";

const IMPACT_MAP: Record<string, string[]> = {
  db: ["api", "test", "cursor"],
  api: ["prd", "test", "claude"],
  prd: ["flow", "api"],
  flow: ["prd"],
  test: ["api", "db"],
  claude: ["cursor"],
  cursor: ["claude"],
};

const NODE_ANGLES = [0, 51, 102, 153, 204, 255, 306];

interface Props {
  project: Project;
  onDocUpdate: (nodeId: string, doc: string) => void;
}

export default function KnowledgeGraph({ project, onDocUpdate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [impacted, setImpacted] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatNode, setChatNode] = useState<GraphNode | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const nodes = project.nodes ?? [];

  useEffect(() => {
    function calc() {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.32;

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
  }, [nodes]);

  function handleNodeClick(node: GraphNode) {
    if (activeNode === node.id) {
      reset();
      return;
    }
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
      content: `**${node.emoji} ${node.label}** 문서를 생성할게요.\n\n이 기능에 대해 간략히 설명해주세요. 어떤 서비스인가요?`,
    }]);
    setChatOpen(true);
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
        body: JSON.stringify({ messages: newMsgs, nodeType: chatNode.type, nodeLabel: chatNode.label }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.content }]);
      if (data.document) {
        onDocUpdate(chatNode.id, data.document);
      }
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "오류가 발생했습니다." }]);
    } finally {
      setLoading(false);
    }
  }

  const { width: cw = 0, height: ch = 0 } = containerRef.current?.getBoundingClientRect() ?? {};

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Graph area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg)",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>Product Knowledge Graph</div>
            <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 2 }}>
              노드를 클릭해 영향도를 확인하거나 문서를 생성하세요
            </div>
          </div>
          {activeNode && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{
                padding: "6px 14px",
                background: "var(--danger-light)",
                color: "var(--danger)",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
              }}>
                ⚠️ {impacted.length}개 노드 영향 감지
              </div>
              <button onClick={reset} style={{
                padding: "6px 14px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                color: "var(--text-sub)",
              }}>
                리셋
              </button>
            </div>
          )}
        </div>

        {/* Graph canvas */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--bg2)" }}>
          {/* SVG connections */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {nodes.map((node) => {
              const pos = positions[node.id];
              const cx = (containerRef.current?.getBoundingClientRect().width ?? 0) / 2;
              const cy = (containerRef.current?.getBoundingClientRect().height ?? 0) / 2;
              if (!pos) return null;
              const isImpacted = impacted.includes(node.id);
              const isActive = activeNode === node.id;
              return (
                <line
                  key={node.id}
                  x1={cx} y1={cy}
                  x2={pos.x} y2={pos.y}
                  stroke={isActive ? "#3B82F6" : isImpacted ? "#EF4444" : "#E5E7EB"}
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
              left: "50%",
              top: "50%",
              background: "var(--bg)",
              border: "2px solid var(--primary)",
              borderRadius: 20,
              padding: "16px 24px",
              cursor: "pointer",
              boxShadow: "0 0 0 6px rgba(59,130,246,0.1), var(--shadow-md)",
              textAlign: "center",
              minWidth: 140,
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.06em", marginBottom: 4 }}>
              FEATURE
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              {project.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Core Feature</div>
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
                  left: pos.x,
                  top: pos.y,
                  background: isImpacted ? "var(--danger-light)" : isActive ? "var(--primary-light)" : "var(--bg)",
                  border: "2px solid",
                  borderColor: isImpacted ? "var(--danger)" : isActive ? "var(--primary)" : "var(--border)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(59,130,246,0.15), var(--shadow-md)"
                    : isImpacted
                    ? "0 0 0 4px rgba(239,68,68,0.1), var(--shadow-sm)"
                    : "var(--shadow-sm)",
                  textAlign: "center",
                  minWidth: 100,
                  transition: "all 0.2s",
                  zIndex: 5,
                }}
                onClick={() => handleNodeClick(node)}
                onDoubleClick={() => openDocGen(node)}
              >
                {isImpacted && (
                  <div style={{
                    position: "absolute",
                    top: -10,
                    right: -8,
                    background: "var(--danger)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 4,
                  }}>
                    ! 변경감지
                  </div>
                )}
                {hasDoc && (
                  <div style={{
                    position: "absolute",
                    top: -8,
                    left: -6,
                    background: "var(--success)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 4,
                  }}>
                    ✓ 문서
                  </div>
                )}
                <div style={{ fontSize: 20, marginBottom: 4 }}>{node.emoji}</div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isImpacted ? "var(--danger)" : isActive ? "var(--primary)" : "var(--text)",
                }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{node.type}</div>
              </div>
            );
          })}

          {/* Impact report */}
          {activeNode && impacted.length > 0 && (
            <div style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--bg)",
              border: "1px solid var(--danger)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--shadow-lg)",
              minWidth: 360,
              maxWidth: 560,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--danger)", marginBottom: 10 }}>
                ⚠️ 영향도 분석 리포트
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {impacted.map((id) => {
                  const n = nodes.find((x) => x.id === id);
                  if (!n) return null;
                  return (
                    <div key={id} style={{
                      padding: "8px 12px",
                      background: "var(--danger-light)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--text-sub)",
                    }}>
                      {n.emoji} <strong style={{ color: "var(--text)" }}>{n.label}</strong> — 연관 내용 검토 및 동기화 필요
                    </div>
                  );
                })}
              </div>
              <button
                onClick={reset}
                style={{ marginTop: 12, padding: "7px 16px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}
              >
                원클릭 동기화 완료
              </button>
            </div>
          )}

          {/* Hint */}
          {!activeNode && (
            <div style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 11,
              color: "var(--text-muted)",
              boxShadow: "var(--shadow-sm)",
            }}>
              클릭: 영향도 분석 &nbsp;·&nbsp; 더블클릭: 문서 생성
            </div>
          )}
        </div>
      </div>

      {/* Doc gen side panel */}
      {chatOpen && chatNode && (
        <div style={{
          width: 360,
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          flexShrink: 0,
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                {chatNode.emoji} {chatNode.label} 생성
              </div>
              <div style={{ fontSize: 11, color: "var(--text-sub)", marginTop: 2 }}>AI 문서 생성기</div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)", padding: 4 }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: m.role === "user" ? "var(--primary)" : "var(--text-muted)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}>
                  {m.role === "user" ? "나" : "SpecForge"}
                </div>
                <div style={{
                  fontSize: 13,
                  color: "var(--text)",
                  lineHeight: 1.7,
                  background: m.role === "user" ? "var(--primary-light)" : "var(--bg2)",
                  border: "1px solid",
                  borderColor: m.role === "user" ? "rgba(59,130,246,0.2)" : "var(--border)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "8px 0" }}>생성 중...</div>
            )}
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="답변을 입력하세요..."
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 13,
                  background: "var(--bg2)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: "9px 16px",
                  background: loading || !input.trim() ? "var(--bg3)" : "var(--primary)",
                  color: loading || !input.trim() ? "var(--text-muted)" : "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading || !input.trim() ? "default" : "pointer",
                }}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
