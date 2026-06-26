const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");
const { detectAll, detectTool } = require("./detect");
const vault = require("./vault");

// 개발: next dev 서버 / 배포: 내장 standalone 서버를 직접 띄움
const DEV_URL = process.env.ELECTRON_START_URL || "http://localhost:3000";
const PROD_PORT = 41234;

let serverProc = null;

// 배포 모드: resources/standalone/server.js 를 내장 node로 실행하고 준비될 때까지 대기
// HOSTNAME은 localhost로 — Firebase Auth 승인 도메인 기본값이 localhost라 127.0.0.1은 거부됨
function startStandaloneServer() {
  return new Promise((resolve, reject) => {
    const dir = path.join(process.resourcesPath, "standalone");
    const serverJs = path.join(dir, "server.js");
    serverProc = spawn(process.execPath, [serverJs], {
      cwd: dir,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1",
        PORT: String(PROD_PORT),
        HOSTNAME: "localhost",
      },
    });
    serverProc.on("error", reject);

    const url = `http://localhost:${PROD_PORT}`;
    const deadline = Date.now() + 20000;
    const ping = () => {
      http
        .get(url, () => resolve(url))
        .on("error", () => {
          if (Date.now() > deadline) reject(new Error("standalone server timeout"));
          else setTimeout(ping, 300);
        });
    };
    setTimeout(ping, 500);
  });
}

function createWindow(targetUrl) {
  const win = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0b0d12",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(targetUrl);

  win.webContents.setWindowOpenHandler(({ url }) => {
    // Firebase/Google 로그인 팝업은 앱 내부 창으로 허용 (외부 브라우저로 보내면 인증이 깨짐)
    if (/(firebaseapp\.com|accounts\.google\.com|google\.com\/o\/oauth2|googleapis\.com)/.test(url)) {
      return { action: "allow" };
    }
    // 그 외 외부 링크(다운로드·접속 버튼 등)는 기본 브라우저로
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// ─── IPC 핸들러 ───────────────────────────────────────────────
ipcMain.handle("detect:all", () => detectAll());
ipcMain.handle("detect:one", (_e, id) => detectTool(id));
ipcMain.handle("keys:get", () => vault.getKeys());
ipcMain.handle("keys:set", (_e, keys) => vault.setKeys(keys));
ipcMain.handle("env:pick", () => vault.pickFolder());
ipcMain.handle("env:write", async (_e, { dir, vars }) => {
  const target = dir || (await vault.pickFolder());
  if (!target) return { ok: false, canceled: true };
  const file = vault.writeEnv(target, vars);
  return { ok: true, file, dir: target };
});
ipcMain.handle("open:external", (_e, url) => shell.openExternal(url));

app.whenReady().then(async () => {
  let targetUrl = DEV_URL;
  if (app.isPackaged) {
    try {
      targetUrl = await startStandaloneServer();
    } catch (e) {
      console.error("내장 서버 시작 실패:", e);
    }
  }
  createWindow(targetUrl);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(targetUrl);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  if (serverProc) serverProc.kill();
});
