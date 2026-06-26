// 개발환경 구축 패널 설정 — 감지 도구 / 접속 링크 / API 키 정의

export interface ToolDef {
  id: string;
  icon: string;
  name: string;
  desc: string;
  downloadUrl: string;
  accent: string;
}

// 🖥 로컬에 설치되어야 하는 도구 (설치 감지 + 버전 표시 + 다운로드)
export const LOCAL_TOOLS: ToolDef[] = [
  { id: "vscode",      icon: "💻", name: "VS Code",    desc: "코드 편집기",          downloadUrl: "https://code.visualstudio.com/download",       accent: "#2563EB" },
  { id: "node",        icon: "🟩", name: "Node.js",    desc: "JS 런타임 · LTS",      downloadUrl: "https://nodejs.org/ko/download",               accent: "#16A34A" },
  { id: "git",         icon: "🐙", name: "Git",        desc: "버전 관리",            downloadUrl: "https://git-scm.com/downloads/win",            accent: "#F05133" },
  { id: "claude",      icon: "🟧", name: "클로드코드", desc: "Claude Code 데스크톱", downloadUrl: "https://claude.com/claude-code",               accent: "#D97757" },
  { id: "codex",       icon: "🤖", name: "Codex",      desc: "OpenAI Codex 데스크톱", downloadUrl: "https://developers.openai.com/codex/",        accent: "#10A37F" },
  { id: "antigravity", icon: "🪐", name: "Antigravity", desc: "Google Antigravity",  downloadUrl: "https://antigravity.google/",                  accent: "#4285F4" },
];

export interface LinkDef {
  id: string;
  icon: string;
  name: string;
  desc: string;
  url: string;
  accent: string;
}

// 🔗 웹 접속·로그인 후 바로 생성/발급하는 다이렉트 링크
export const ACCESS_LINKS: LinkDef[] = [
  { id: "vercel",   icon: "▲",  name: "Vercel",       desc: "배포 · 프로젝트 생성",     url: "https://vercel.com/new",                accent: "#000000" },
  { id: "github",   icon: "🐱", name: "GitHub",       desc: "리포지토리 바로 생성",      url: "https://github.com/new",                accent: "#24292F" },
  { id: "firebase", icon: "🔥", name: "Firebase",     desc: "프로젝트 바로 생성",        url: "https://console.firebase.google.com/",  accent: "#F59E0B" },
];

// 🔑 API 키 발급 링크 + 로컬 저장 키
export interface KeyDef {
  id: string;       // localStorage/vault 키 id
  envName: string;  // .env.local 변수명
  icon: string;
  name: string;
  issueUrl: string;
  accent: string;
}

export const API_KEYS: KeyDef[] = [
  { id: "openai",    envName: "OPENAI_API_KEY",    icon: "🤖", name: "OpenAI API 키",  issueUrl: "https://platform.openai.com/api-keys",          accent: "#10A37F" },
  { id: "gemini",    envName: "GEMINI_API_KEY",    icon: "✨", name: "Gemini API 키",  issueUrl: "https://aistudio.google.com/app/apikey",        accent: "#4285F4" },
  { id: "anthropic", envName: "ANTHROPIC_API_KEY", icon: "🟧", name: "Claude API 키",  issueUrl: "https://console.anthropic.com/settings/keys",   accent: "#D97757" },
  { id: "kakao",     envName: "KAKAO_REST_API_KEY", icon: "💛", name: "카카오 REST 키", issueUrl: "https://developers.kakao.com/console/app",      accent: "#FEE500" },
  { id: "naver",     envName: "NAVER_CLIENT_SECRET", icon: "💚", name: "네이버 시크릿",  issueUrl: "https://developers.naver.com/apps/#/register", accent: "#03C75A" },
];
