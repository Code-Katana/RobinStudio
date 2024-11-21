import { app, protocol, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { AssetUrl } from "@shared/protocols/asset-url";
import { AssetServer } from "@shared/protocols/asset-server";
import { Channels, TokenizeRequest, TokenizeResponse } from "@shared/channels";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 992,
    height: 560,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app-asset",
    privileges: {
      standard: true,
      supportFetchAPI: true,
      bypassCSP: true,
    },
  },
]);

const server = new AssetServer();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  protocol.handle("app-asset", (request) => {
    const asset = new AssetUrl(request.url);

    if (asset.isNodeModule) {
      return server.fromNodeModules(asset.relativeUrl);
    } else {
      return server.fromPublic(asset.relativeUrl);
    }
  });
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// todo: call the wasm instance and get the tokens stream
ipcMain.handle(
  Channels.tokenize,
  async (_event, request: TokenizeRequest): Promise<TokenizeResponse> => {
    console.log("request tokenizer:");
    console.log(request);

    return {
      tokens: [],
    };
  },
);
