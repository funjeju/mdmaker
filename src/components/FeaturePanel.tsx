"use client";

import { useState } from "react";
import { Feature, FeatureStatus, FeatureType, FeaturePriority } from "@/types";

const STATUS_CONFIG: Record<FeatureStatus, { label: string; color: string; bg: string }> = {
  idea:        { label: "아이디어",  color: "#64748B", bg: "#F1F5F9" },
  validated:   { label: "검증됨",   color: "#F59E0B", bg: "#FFFBEB" },
  designed:    { label: "설계됨",   color: "#3B82F6", bg: "#EFF6FF" },
  specified:   { label: "명세됨",   color: "#8B5CF6", bg: "#F5F3FF" },
  implemented: { label: "구현됨",   color: "#22C55E", bg: "#F0FDF4" },
  released:    { label: "출시됨",   color: "#10B981", bg: "#ECFDF5" },
};

const STATUS_ORDER: FeatureStatus[] = ["idea", "validated", "designed", "specified", "implemented", "released"];

const TYPE_CONFIG: Record<FeatureType, { label: string; color: string }> = {
  core:        { label: "Core",        color: "#3B82F6" },
  supporting:  { label: "Supporting",  color: "#8B5CF6" },
  operational: { label: "Operational", color: "#F59E0B" },
};

const PRIORITY_CONFIG: Record<FeaturePriority, { label: string; color: string }> = {
  p0: { label: "P0 긴급", color: "#EF4444" },
  p1: { label: "P1 높음", color: "#F59E0B" },
  p2: { label: "P2 보통", color: "#3B82F6" },
  p3: { label: "P3 낮음", color: "#94A3B8" },
};

interface Props {
  features: Feature[];
  onUpdate: (features: Feature[]) => void;
}

function createFeature(): Feature {
  return {
    id: crypto.randomUUID(),
    name: "",
    type: "core",
    status: "idea",
    priority: "p1",
    description: "",
    dependencies: [],
    createdAt: Date.now(),
  };
}

export default function FeaturePanel({ features, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Feature | null>(null);
  const [filter, setFilter] = useState<FeatureStatus | "all">("all");

  const filtered = filter === "all" ? features : features.filter((f) => f.status === filter);

  function startNew() {
    const f = createFeature();
    setDraft(f);
    setEditingId(f.id);
  }

  function startEdit(f: Feature) {
    setDraft({ ...f });
    setEditingId(f.id);
  }

  function cancelEdit() {
    setDraft(null);
    setEditingId(null);
  }

  function saveEdit() {
    if (!draft || !draft.name.trim()) return;
    const exists = features.find((f) => f.id === draft.id);
    if (exists) {
      onUpdate(features.map((f) => (f.id === draft.id ? draft : f)));
    } else {
      onUpdate([...features, draft]);
    }
    setDraft(null);
    setEditingId(null);
  }

  function deleteFeature(id: string) {
    onUpdate(features.filter((f) => f.id !== id));
  }

  function advanceStatus(f: Feature) {
    const idx = STATUS_ORDER.indexOf(f.status);
    if (idx < STATUS_ORDER.length - 1) {
      onUpdate(features.map((x) => x.id === f.id ? { ...x, status: STATUS_ORDER[idx + 1] } : x));
    }
  }

  const statusCounts = STATUS_ORDER.map((s) => ({
    status: s,
    count: features.filter((f) => f.status === s).length,
  }));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Feature Management</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
              총 {features.length}개 기능
            </div>
          </div>
          <button
            onClick={startNew}
            style={{
              padding: "7px 14px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + 추가
          </button>
        </div>

        {/* Status pipeline */}
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid",
              borderColor: filter === "all" ? "var(--primary)" : "var(--border)",
              background: filter === "all" ? "var(--primary-light)" : "transparent",
              color: filter === "all" ? "var(--primary)" : "var(--text-muted)",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            전체 {features.length}
          </button>
          {statusCounts.map(({ status, count }) => {
            const cfg = STATUS_CONFIG[status];
            const active = filter === status;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: active ? cfg.color : "var(--border)",
                  background: active ? cfg.bg : "transparent",
                  color: active ? cfg.color : "var(--text-muted)",
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: count === 0 ? 0.4 : 1,
                }}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {/* New / edit form */}
        {draft && !features.find((f) => f.id === draft.id) && (
          <FeatureForm draft={draft} setDraft={setDraft} onSave={saveEdit} onCancel={cancelEdit} />
        )}

        {filtered.length === 0 && !draft && (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)", fontSize: 13 }}>
            기능이 없습니다. + 추가를 눌러 시작하세요.
          </div>
        )}

        {filtered.map((f) => {
          const isEditing = editingId === f.id;
          const scfg = STATUS_CONFIG[f.status];
          const tcfg = TYPE_CONFIG[f.type];
          const pcfg = PRIORITY_CONFIG[f.priority];
          const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(f.status) + 1];

          if (isEditing && draft) {
            return <FeatureForm key={f.id} draft={draft} setDraft={setDraft} onSave={saveEdit} onCancel={cancelEdit} />;
          }

          return (
            <div
              key={f.id}
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                    {f.name}
                  </div>
                  {f.description && (
                    <div style={{ fontSize: 11, color: "var(--text-sub)", lineHeight: 1.5, marginBottom: 6 }}>
                      {f.description}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                      background: scfg.bg, color: scfg.color,
                    }}>
                      {scfg.label}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                      background: "var(--bg2)", color: tcfg.color,
                    }}>
                      {tcfg.label}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                      background: "var(--bg2)", color: pcfg.color,
                    }}>
                      {pcfg.label}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, marginLeft: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(f)}
                    style={{ padding: "4px 8px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10, cursor: "pointer", color: "var(--text-sub)" }}
                  >
                    편집
                  </button>
                  <button
                    onClick={() => deleteFeature(f.id)}
                    style={{ padding: "4px 8px", background: "none", border: "none", borderRadius: 6, fontSize: 10, cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Advance status button */}
              {nextStatus && (
                <button
                  onClick={() => advanceStatus(f)}
                  style={{
                    width: "100%",
                    padding: "5px",
                    background: STATUS_CONFIG[nextStatus].bg,
                    color: STATUS_CONFIG[nextStatus].color,
                    border: `1px solid ${STATUS_CONFIG[nextStatus].color}40`,
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: 6,
                  }}
                >
                  → {STATUS_CONFIG[nextStatus].label}로 이동
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Feature Form ─────────────────────────────────────────────────────────────
function FeatureForm({ draft, setDraft, onSave, onCancel }: {
  draft: Feature;
  setDraft: (f: Feature) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      background: "var(--primary-light)",
      border: "1px solid rgba(59,130,246,0.3)",
      borderRadius: 12,
      padding: "14px",
      marginBottom: 10,
    }}>
      <input
        autoFocus
        placeholder="기능 이름 *"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        style={{
          width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8,
          fontSize: 13, marginBottom: 8, background: "var(--bg)", color: "var(--text)", outline: "none",
        }}
      />
      <textarea
        placeholder="기능 설명 (선택)"
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        rows={2}
        style={{
          width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8,
          fontSize: 12, marginBottom: 8, background: "var(--bg)", color: "var(--text)", outline: "none",
          resize: "none", fontFamily: "inherit", lineHeight: 1.5,
        }}
      />
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <select
          value={draft.type}
          onChange={(e) => setDraft({ ...draft, type: e.target.value as FeatureType })}
          style={{ flex: 1, padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, background: "var(--bg)", color: "var(--text)", outline: "none" }}
        >
          <option value="core">Core</option>
          <option value="supporting">Supporting</option>
          <option value="operational">Operational</option>
        </select>
        <select
          value={draft.priority}
          onChange={(e) => setDraft({ ...draft, priority: e.target.value as FeaturePriority })}
          style={{ flex: 1, padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, background: "var(--bg)", color: "var(--text)", outline: "none" }}
        >
          <option value="p0">P0 긴급</option>
          <option value="p1">P1 높음</option>
          <option value="p2">P2 보통</option>
          <option value="p3">P3 낮음</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: "7px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, cursor: "pointer", color: "var(--text-sub)" }}
        >
          취소
        </button>
        <button
          onClick={onSave}
          disabled={!draft.name.trim()}
          style={{
            flex: 2, padding: "7px",
            background: draft.name.trim() ? "var(--primary)" : "var(--bg3)",
            color: draft.name.trim() ? "#fff" : "var(--text-muted)",
            border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: draft.name.trim() ? "pointer" : "default",
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}
