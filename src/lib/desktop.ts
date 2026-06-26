// 데스크톱(Electron) 브리지 래퍼 — 웹에서는 안전한 폴백으로 동작
"use client";

export interface ToolStatus {
  id: string;
  installed: boolean;
  version?: string;
  source?: "command" | "path";
  path?: string;
}

export type DetectMap = Record<string, ToolStatus>;
export type KeyMap = Record<string, string>;

interface DesktopAPI {
  isDesktop: true;
  platform: string;
  detectAll: () => Promise<DetectMap>;
  detectOne: (id: string) => Promise<ToolStatus>;
  getKeys: () => Promise<KeyMap>;
  setKeys: (keys: KeyMap) => Promise<{ ok: boolean; encrypted: boolean }>;
  pickFolder: () => Promise<string | null>;
  writeEnv: (
    dir: string | null,
    vars: KeyMap
  ) => Promise<{ ok: boolean; file?: string; dir?: string; canceled?: boolean }>;
  openExternal: (url: string) => Promise<void>;
}

function api(): DesktopAPI | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { desktop?: DesktopAPI }).desktop ?? null;
}

export function isDesktop(): boolean {
  return !!api();
}

const LS_KEYS = "specforge_apikeys";

export const bridge = {
  async detectAll(): Promise<DetectMap | null> {
    const d = api();
    return d ? d.detectAll() : null;
  },

  async getKeys(): Promise<KeyMap> {
    const d = api();
    if (d) return d.getKeys();
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(LS_KEYS) || "{}");
    } catch {
      return {};
    }
  },

  async setKeys(keys: KeyMap): Promise<void> {
    const d = api();
    if (d) {
      await d.setKeys(keys);
      return;
    }
    if (typeof window !== "undefined") localStorage.setItem(LS_KEYS, JSON.stringify(keys));
  },

  // .env.local 주입 — 데스크톱에서만 실제 파일 기록, 웹에서는 null 반환
  async writeEnv(vars: KeyMap): Promise<{ ok: boolean; file?: string; canceled?: boolean } | null> {
    const d = api();
    if (!d) return null;
    return d.writeEnv(null, vars);
  },

  openExternal(url: string) {
    const d = api();
    if (d) d.openExternal(url);
    else if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  },
};
