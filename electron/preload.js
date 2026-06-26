const { contextBridge, ipcRenderer } = require("electron");

// 렌더러(웹 화면)에서 window.desktop 으로 접근하는 안전한 브리지
contextBridge.exposeInMainWorld("desktop", {
  isDesktop: true,
  platform: process.platform,
  detectAll: () => ipcRenderer.invoke("detect:all"),
  detectOne: (id) => ipcRenderer.invoke("detect:one", id),
  getKeys: () => ipcRenderer.invoke("keys:get"),
  setKeys: (keys) => ipcRenderer.invoke("keys:set", keys),
  pickFolder: () => ipcRenderer.invoke("env:pick"),
  writeEnv: (dir, vars) => ipcRenderer.invoke("env:write", { dir, vars }),
  openExternal: (url) => ipcRenderer.invoke("open:external", url),
});
