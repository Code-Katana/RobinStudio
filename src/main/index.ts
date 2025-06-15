import fs from "fs";
import { join } from "path";
import { app, protocol, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "@resources/icon.png?asset";
import { AssetUrl } from "@shared/protocols/asset-url";
import { AssetServer } from "@shared/protocols/asset-server";
import { Channels } from "@shared/channels";
import {
  CreateFileRequest,
  CreateFolderRequest,
  CreateFolderResponse,
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  SaveFileRequest,
  UpdateTreeRequest,
  UpdateTreeResponse,
  DeleteFolderRequest,
  DeleteFolderResponse,
} from "@shared/channels/file-system";
import { getFileTree } from "@main/lib/get-file-tree";
import chokidar from "chokidar";
import { startServer } from "./lsp/server";
import { launchExecutable } from "./lib/launch-executable";

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
      // devTools: process.env.NODE_ENV === "development",
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  startServer(mainWindow);

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
ipcMain.handle(Channels.fileChannels.create, async (_, request: CreateFileRequest) => {
  const { path, name, content } = request;
  const fullPath = join(path, name);

  try {
    fs.writeFileSync(fullPath, content);
    return { success: true, path: fullPath };
  } catch (error) {
    console.error("Error creating file:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
});

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

ipcMain.handle(
  Channels.fileChannels.launchExecutable,
  async (_, request: { exePath: string; args: string[] }): Promise<number | null> => {
    return launchExecutable(request.exePath, request.args);
  },
);

// handle folder actions
ipcMain.handle(
  Channels.folderChannels.create,
  async (_, request: CreateFolderRequest): Promise<CreateFolderResponse> => {
    try {
      if (!request.path || !request.name) {
        return { success: false, error: "Path and name are required" };
      }

      const fullPath = join(request.path, request.name);
      fs.mkdirSync(fullPath, { recursive: true });
      return { success: true };
    } catch (error) {
      console.error("Error creating folder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
);

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

ipcMain.handle(
  Channels.folderChannels.delete,
  async (_, request: DeleteFolderRequest): Promise<DeleteFolderResponse> => {
    try {
      if (!request.path) {
        return { success: false, error: "Path is required" };
      }

      fs.rmSync(request.path, { recursive: true, force: true });
      return { success: true };
    } catch (error) {
      console.error("Error deleting folder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
);

// Tree Feature Actions

ipcMain.handle(
  Channels.treeChannels.updateTree,
  async (_, request: UpdateTreeRequest): Promise<UpdateTreeResponse> => {
    const tree = getFileTree(request.path);
    return { tree };
  },
);
