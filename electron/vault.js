// API 키 로컬 금고 — OS 암호화 저장소(safeStorage/DPAPI)로 평문 노출 없이 보관
const { app, safeStorage, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

function vaultPath() {
  return path.join(app.getPath("userData"), "keys.vault");
}
function configPath() {
  return path.join(app.getPath("userData"), "devenv.json");
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath(), "utf8"));
  } catch {
    return {};
  }
}
function writeConfig(cfg) {
  fs.writeFileSync(configPath(), JSON.stringify(cfg, null, 2), "utf8");
}

// 키 저장: 암호화 가능하면 암호화, 아니면 평문(경고용)으로 폴백
function setKeys(keys) {
  const json = JSON.stringify(keys);
  if (safeStorage.isEncryptionAvailable()) {
    const enc = safeStorage.encryptString(json);
    fs.writeFileSync(vaultPath(), enc);
    return { ok: true, encrypted: true };
  }
  fs.writeFileSync(vaultPath(), json, "utf8");
  return { ok: true, encrypted: false };
}

function getKeys() {
  try {
    if (!fs.existsSync(vaultPath())) return {};
    const buf = fs.readFileSync(vaultPath());
    if (safeStorage.isEncryptionAvailable()) {
      try {
        return JSON.parse(safeStorage.decryptString(buf));
      } catch {
        // 평문으로 저장됐던 경우
        return JSON.parse(buf.toString("utf8"));
      }
    }
    return JSON.parse(buf.toString("utf8"));
  } catch {
    return {};
  }
}

// 프로젝트 폴더 선택 (마지막 선택 폴더 기억)
async function pickFolder() {
  const cfg = readConfig();
  const res = await dialog.showOpenDialog({
    title: "프로젝트 폴더 선택 (.env.local을 만들 위치)",
    defaultPath: cfg.lastDir || app.getPath("home"),
    properties: ["openDirectory"],
  });
  if (res.canceled || !res.filePaths.length) return null;
  const dir = res.filePaths[0];
  writeConfig({ ...cfg, lastDir: dir });
  return dir;
}

// .env.local에 키 병합 기록 (기존 줄은 교체, 없으면 추가)
function writeEnv(dir, vars) {
  const file = path.join(dir, ".env.local");
  let lines = [];
  if (fs.existsSync(file)) {
    lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  }
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined || value === null || value === "") continue;
    const idx = lines.findIndex((l) => l.trim().startsWith(`${key}=`));
    const entry = `${key}=${value}`;
    if (idx >= 0) lines[idx] = entry;
    else lines.push(entry);
  }
  // 빈 줄 정리
  const out = lines.filter((l, i) => !(l === "" && lines[i - 1] === "")).join("\n");
  fs.writeFileSync(file, out.endsWith("\n") ? out : out + "\n", "utf8");
  return file;
}

module.exports = { setKeys, getKeys, pickFolder, writeEnv };
