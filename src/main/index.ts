import fs from "fs";
import { join } from "path";
import { app, protocol, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "@resources/icon.png?asset";
import { AssetUrl } from "@shared/protocols/asset-url";
import { AssetServer } from "@shared/protocols/asset-server";
import {
  Channels,
  ParseRequest,
  ParseResponse,
  TokenizeRequest,
  TokenizeResponse,
} from "@shared/channels";
import { Token } from "@shared/types";
import {
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  SaveFileRequest,
} from "@shared/channels/file-system";
import { getFileTree } from "@main/lib/get-file-tree";
import { lspConnection, lspProcess, startLSP } from "@main/language-server";
import chokidar from "chokidar";

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 992,
    height: 560,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
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

  // Example Usage
  startLSP();
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
    lspProcess?.kill();
    app.quit();
  }
});

// Wren Compiler Actions
ipcMain.handle(
  Channels.wrenLang.tokenize,
  async (_event, request: TokenizeRequest): Promise<TokenizeResponse> => {
    try {
      if (!lspConnection) {
        throw new Error("Language server is down...");
      }

      const { source, scanner } = request;
      const tokens: Token[] = await lspConnection.sendRequest("rbn/tokenize", {
        source,
        scannerOption: scanner,
      });

      console.log(` my tokens from main :${tokens}`);

      return { tokens };
    } catch (error) {
      console.error(error);
      return { tokens: [] };
    }
  },
);

ipcMain.handle(
  Channels.wrenLang.parse,
  async (_event, request: ParseRequest): Promise<ParseResponse> => {
    try {
      if (!lspConnection) {
        throw new Error("Language server is down...");
      }

      const { source } = request;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ast: any = await lspConnection.sendRequest("rbn/parse", { source });

      return { ast };
    } catch (error) {
      console.error(error);
      return { ast: [] };
    }
  },
);

// Browser Window Actions
ipcMain.on(Channels.browserWindowActions.closeWindow, () => {
  mainWindow?.close();
});

ipcMain.on(Channels.browserWindowActions.minimizeWindow, () => {
  mainWindow?.minimize();
});

ipcMain.on(Channels.browserWindowActions.maximizeWindow, () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.restore();
    return;
  }

  mainWindow?.maximize();
});

// File Feature Actions
ipcMain.handle(Channels.fileChannels.open, async (): Promise<OpenFileResponse | null> => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openFile"],
    title: "Select a Robin file",
    message: "Choose a .rbn file to open",
  });

  if (filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], "utf-8");
    return { path: filePaths[0], content };
  }

  return null;
});

ipcMain.handle(
  Channels.fileChannels.openByPath,
  async (_, request: OpenFileRequest): Promise<OpenFileResponse | null> => {
    if (!request.path) {
      return null;
    }

    const content = fs.readFileSync(request.path, "utf-8");
    return { path: request.path, content };
  },
);

ipcMain.handle(Channels.fileChannels.save, async (_, request: SaveFileRequest) => {
  fs.writeFileSync(request.path, request.content, "utf-8");
});

ipcMain.handle(Channels.folderChannels.open, async (): Promise<OpenFolderResponse | null> => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openDirectory"],
    title: "Select a Folder",
    message: "Choose a folder to open",
  });

  if (filePaths.length > 0) {
    const folderPath = filePaths[0];
    const fileTree = getFileTree(folderPath);
    const folderName = fileTree[0].name;

    const watcher = chokidar.watch(folderPath, {
      persistent: true,
      ignoreInitial: true,
      ignored: /(^|[\\/\\])\../,
    });

    watcher
      .on("ready", () => console.log("Initial scan complete. Ready for changes"))
      .on("add", (filePath) => {
        console.log(`File added: ${filePath}`);
        mainWindow?.webContents.send("file-event", { type: "add", path: filePath });
      })
      .on("change", (filePath) => {
        console.log(`File changed: ${filePath}`);
        mainWindow?.webContents.send("file-event", { type: "change", path: filePath });
      })
      .on("unlink", (filePath) => {
        console.log(`File removed: ${filePath}`);
        mainWindow?.webContents.send("file-event", { type: "remove", path: filePath });
      })
      .on("addDir", (filePath) => {
        console.log(`Directory added: ${filePath}`);
        mainWindow?.webContents.send("file-event", { type: "addDir", path: filePath });
      })
      .on("unlinkDir", (filePath) => {
        console.log(`Directory removed: ${filePath}`);
        mainWindow?.webContents.send("file-event", { type: "unlinkDir", path: filePath });
      })
      .on("error", (error) => {
        console.error(`Watcher error: ${error}`);
      });

    return { folderName, folderPath, fileTree };
  }

  return null;
});
