const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { detectAll, detectTool } = require("./detect");
const vault = require("./vault");

// 개발 모드: next dev 서버, 배포 모드: 호스팅된 URL(필요 시 교체)
const DEV_URL = process.env.ELECTRON_START_URL || "http://localhost:3000";
const PROD_URL = process.env.ELECTRON_PROD_URL || "http://localhost:3000";

function createWindow() {
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

  win.loadURL(app.isPackaged ? PROD_URL : DEV_URL);

  // 외부 링크(target=_blank)는 기본 브라우저로
  win.webContents.setWindowOpenHandler(({ url }) => {
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

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
