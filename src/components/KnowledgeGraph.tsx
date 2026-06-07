"use client";

import { useEffect, useRef, useState } from "react";
import { Project, GraphNode, Feature } from "@/types";
import FeaturePanel from "./FeaturePanel";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  project: Project;
  onDocUpdate: (nodeId: string, doc: string) => void;
  onNodesUpdate?: (nodes: GraphNode[]) => void;
  onFeaturesUpdate?: (features: Feature[]) => void;
  onStackUpdate?: (stackUpdate: Record<string, string>) => void;
}

const NODE_COLORS: Record<string, string> = {
  prd: "#3B82F6", api: "#8B5CF6", db: "#10B981",
  test: "#F59E0B", flow: "#EC4899", claude: "#EF4444", cursor: "#6366F1",
};

export default function KnowledgeGraph({ project, onDocUpdate, onNodesUpdate, onFeaturesUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = project.nodes ?? [];

  // Auto-start AI greeting when first entering
  useEffect(() => {
    if (started) return;
    setStarted(true);
    startConversation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startConversation() {
    setLoading(true);
    try {
      const initMsg = "시작";
      const res = await fetch("/api/graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: initMsg }],
          projectName: project.name,
          projectIdea: project.idea,
          pmf: project.pmf,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages([{ role: "assistant", content: data.content }]);
      }
      if (data.docs?.length) addDocs(data.docs);
    } catch {
      setMessages([{ role: "assistant", content: "연결 오류가 발생했습니다. 새로고침 후 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  }

  function addDocs(docs: Array<{ type: string; label: string; emoji: string; markdown: string }>) {
    const current = project.nodes ?? [];
    const newNodes: GraphNode[] = [...current];
    for (const doc of docs) {
      const id = `${doc.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const existing = newNodes.find((n) => n.type === doc.type);
      if (existing) {
        existing.document = doc.markdown;
        onDocUpdate(existing.id, doc.markdown);
      } else {
        const node: GraphNode = {
          id,
          type: doc.type,
          label: doc.label,
          emoji: doc.emoji,
          document: doc.markdown,
        };
        newNodes.push(node);
        onDocUpdate(id, doc.markdown);
      }
    }
    onNodesUpdate?.(newNodes);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs,
          projectName: project.name,
          projectIdea: project.idea,
          pmf: project.pmf,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages([...newMsgs, { role: "assistant", content: data.content }]);
      }
      if (data.docs?.length) addDocs(data.docs);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // Graph node positions
  function getNodePositions() {
    if (!containerRef.current || nodes.length === 0) return {};
    const { width, height } = containerRef.current.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.35;
    const pos: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
      pos[node.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    return pos;
  }

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  useEffect(() => {
    const calc = () => setPositions(getNodePositions());
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  const hasNodes = nodes.length > 0;

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* ── LEFT: Feature Panel (only when docs exist) ───── */}
      {showFeatures && hasNodes && (
        <div style={{ width: 260, borderRight: "1px solid var(--border)", background: "var(--bg2)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          <FeaturePanel
            features={project.features ?? []}
            onUpdate={(features) => onFeaturesUpdate?.(features)}
          />
        </div>
      )}

      {/* ── CENTER: Graph (only when docs exist) ──────────── */}
      {hasNodes && (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            style={{ padding: "5px 12px", background: showFeatures ? "var(--primary-light)" : "var(--bg2)", color: showFeatures ? "var(--primary)" : "var(--text-sub)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
          >
            ☰ Features
          </button>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Product Knowledge Graph</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>· 문서 {nodes.length}개</div>
        </div>

        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--bg2)" }}>
          {nodes.length === 0 ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
                  AI와 대화하면 문서가 여기에 나타납니다
                </div>
              </div>
            </div>
          ) : (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              {nodes.map((node) => {
                const pos = positions[node.id];
                if (!pos) return null;
                return nodes.map((other) => {
                  if (other.id === node.id) return null;
                  const opos = positions[other.id];
                  if (!opos) return null;
                  return (
                    <line key={`${node.id}-${other.id}`}
                      x1={pos.x} y1={pos.y} x2={opos.x} y2={opos.y}
                      stroke="var(--border)" strokeWidth={1} opacity={0.5}
                    />
                  );
                });
              })}
            </svg>
          )}

          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;
            const color = NODE_COLORS[node.type] ?? "#6B7280";
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node)}
                style={{
                  position: "absolute",
                  left: pos.x - 52, top: pos.y - 52,
                  width: 104, height: 104,
                  background: "var(--bg)",
                  border: `2px solid ${isSelected ? color : "var(--border)"}`,
                  borderRadius: 16,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: isSelected ? `0 0 0 3px ${color}33` : "var(--shadow-sm)",
                  transition: "all 0.15s",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 24 }}>{node.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text)", textAlign: "center", padding: "0 6px", lineHeight: 1.3 }}>{node.label}</div>
                {node.document && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} title="문서 완성" />
                )}
              </div>
            );
          })}

          {/* Selected node doc preview */}
          {selectedNode?.document && (
            <div style={{
              position: "absolute", bottom: 16, left: 16, right: 16,
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "14px 16px", maxHeight: 180, overflowY: "auto",
              boxShadow: "var(--shadow-lg)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{selectedNode.emoji} {selectedNode.label}</div>
                <button onClick={() => setSelectedNode(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-muted)" }}>✕</button>
              </div>
              <pre style={{ fontSize: 11, color: "var(--text-sub)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {selectedNode.document.slice(0, 600)}{selectedNode.document.length > 600 ? "\n..." : ""}
              </pre>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── RIGHT: AI Chat ────────────────────────────────── */}
      <div style={{ width: hasNodes ? 380 : undefined, flex: hasNodes ? undefined : 1, borderLeft: hasNodes ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--bg)" }}>
        {/* Chat header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--primary-light)", flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>✦ Product Architect AI</div>
          <div style={{ fontSize: 11, color: "var(--text-sub)", marginTop: 2 }}>
            {project.name}{hasNodes ? ` · 문서 ${nodes.length}개 생성됨` : " · 문서 구성 중"}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>AI가 프로젝트를 분석하고 있습니다...</div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              padding: "10px 13px", borderRadius: 12, fontSize: 12, lineHeight: 1.8,
              background: msg.role === "user" ? "var(--primary-light)" : "var(--bg2)",
              color: msg.role === "user" ? "var(--primary)" : "var(--text)",
              border: `1px solid ${msg.role === "user" ? "var(--primary)" : "var(--border)"}`,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "92%",
              whiteSpace: "pre-wrap",
            }}>
              {msg.role === "assistant" && (
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>✦ AI</div>
              )}
              {msg.content}
            </div>
          ))}
          {loading && messages.length > 0 && (
            <div style={{ padding: "10px 13px", borderRadius: 12, fontSize: 12, background: "var(--bg2)", border: "1px solid var(--border)", alignSelf: "flex-start" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>✦ AI</div>
              <span style={{ color: "var(--text-muted)" }}>분석 중...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="답변 입력..."
            disabled={loading}
            style={{
              flex: 1, padding: "10px 12px", border: "1px solid var(--border)",
              borderRadius: 10, fontSize: 13, background: "var(--bg2)",
              color: "var(--text)", outline: "none", fontFamily: "inherit",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              padding: "10px 16px", background: !input.trim() || loading ? "var(--bg3)" : "var(--primary)",
              color: !input.trim() || loading ? "var(--text-muted)" : "#fff",
              border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: !input.trim() || loading ? "default" : "pointer",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
