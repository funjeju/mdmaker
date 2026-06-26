// 로컬 개발 도구 설치 감지 + 버전 추출 (Windows 기준, 다른 OS도 명령 기반으로 동작)
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// 환경변수(%LOCALAPPDATA% 등)를 실제 경로로 치환
function expand(p) {
  return p
    .replace(/%([^%]+)%/g, (_, name) => process.env[name] || "")
    .replace(/^~/, os.homedir());
}

function run(cmd, timeout = 5000) {
  return new Promise((resolve) => {
    exec(cmd, { timeout, windowsHide: true }, (err, stdout, stderr) => {
      if (err) return resolve(null);
      resolve(`${stdout || ""}\n${stderr || ""}`.trim());
    });
  });
}

function extractVersion(text) {
  if (!text) return null;
  const m = text.match(/(\d+\.\d+(?:\.\d+)?)/);
  return m ? m[1] : null;
}

// VS Code 등 설치 폴더 안 package.json에서 버전 읽기 시도
function versionFromPackageJson(exePath) {
  try {
    const dir = path.dirname(exePath);
    const candidates = [
      path.join(dir, "resources", "app", "package.json"),
      path.join(dir, "package.json"),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        const json = JSON.parse(fs.readFileSync(c, "utf8"));
        if (json.version) return json.version;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

// Windows exe 파일 메타데이터(ProductVersion)에서 버전 읽기 — asar로 패킹된 앱(Antigravity 등) 대응
async function versionFromExe(exePath) {
  if (process.platform !== "win32") return null;
  const safe = exePath.replace(/'/g, "''");
  const out = await run(
    `powershell -NoProfile -Command "(Get-Item '${safe}').VersionInfo.ProductVersion"`,
    6000
  );
  return extractVersion(out);
}

// 도구별 감지 설정: 명령 우선, 없으면 설치 경로 스캔
const TOOLS = {
  node: {
    commands: ["node --version"],
    paths: ["%ProgramFiles%/nodejs/node.exe", "%LOCALAPPDATA%/Programs/nodejs/node.exe"],
  },
  git: {
    commands: ["git --version"],
    paths: ["%ProgramFiles%/Git/cmd/git.exe", "%ProgramFiles%/Git/bin/git.exe"],
  },
  vscode: {
    commands: ["code --version"],
    paths: [
      "%LOCALAPPDATA%/Programs/Microsoft VS Code/Code.exe",
      "%ProgramFiles%/Microsoft VS Code/Code.exe",
    ],
  },
  claude: {
    commands: ["claude --version", "claude-code --version"],
    paths: [
      "%LOCALAPPDATA%/Programs/claude/Claude.exe",
      "%APPDATA%/npm/claude.cmd",
    ],
  },
  codex: {
    commands: ["codex --version"],
    paths: ["%APPDATA%/npm/codex.cmd", "%LOCALAPPDATA%/Programs/codex/codex.exe"],
  },
  antigravity: {
    commands: ["antigravity --version"],
    paths: [
      "%LOCALAPPDATA%/Programs/Antigravity/Antigravity.exe",
      "%LOCALAPPDATA%/Programs/antigravity/Antigravity.exe",
    ],
  },
};

async function detectTool(id) {
  const cfg = TOOLS[id];
  if (!cfg) return { id, installed: false };

  // 1) 명령 실행으로 감지
  for (const cmd of cfg.commands || []) {
    const out = await run(cmd);
    if (out) {
      return { id, installed: true, version: extractVersion(out) || "unknown", source: "command" };
    }
  }

  // 2) 설치 경로 스캔
  for (const raw of cfg.paths || []) {
    const full = expand(raw);
    if (full && fs.existsSync(full)) {
      let version = versionFromPackageJson(full);
      if (!version && /\.exe$/i.test(full)) version = await versionFromExe(full);
      return {
        id,
        installed: true,
        version: version || "unknown",
        source: "path",
        path: full,
      };
    }
  }

  return { id, installed: false };
}

async function detectAll() {
  const ids = Object.keys(TOOLS);
  const results = await Promise.all(ids.map(detectTool));
  const map = {};
  for (const r of results) map[r.id] = r;
  return map;
}

module.exports = { detectAll, detectTool };
