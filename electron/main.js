const path = require("node:path");
const { app, BrowserWindow, ipcMain } = require("electron");

const { scanSkills } = require("../src/scanner");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1560,
    height: 980,
    minWidth: 1280,
    minHeight: 780,
    backgroundColor: "#07111f",
    autoHideMenuBar: true,
    title: "Skills Radar",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("skills:scan", async (_event, options = {}) => {
    return scanSkills(options);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
