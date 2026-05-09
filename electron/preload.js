const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("skillsApp", {
  scan(options = {}) {
    return ipcRenderer.invoke("skills:scan", options);
  }
});
