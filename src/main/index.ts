import fs from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "@resources/icon.png?asset";
import { Channels, ParseResponse, TokenizeResponse } from "@shared/channels";
import {
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  SaveFileRequest,
} from "@shared/channels/file-system";
import { getFileTree } from "@main/lib/get-file-tree";
import { createLspMessage } from "./lib/create-lsp-message";

let mainWindow: BrowserWindow | null;
let lspProcess: ReturnType<typeof spawn>;

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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

ipcMain.on("lsp-start", () => {
  console.log("starting lsp...");
  // Launch the custom language server (rbn.exe) via child_process.spawn
  const lspPath = join(app.getAppPath(), "resources", "bin", "namepiece.exe");
  lspProcess = spawn(lspPath, ["--stdio"], { stdio: ["pipe", "pipe", "pipe"] });

  if (!lspProcess || !lspProcess.stdout || !lspProcess.stderr) {
    console.error("Failed to start language server");
    return;
  }

  // Forward LSP stdout to renderer via IPC
  lspProcess.stdout.on("data", (chunk: Buffer) => {
    // Send raw JSON-RPC message bytes to renderer
    const msg = chunk.toString();
    BrowserWindow.getAllWindows().forEach((win) => win.webContents.send("lsp-from-main", msg));
  });

  // Capture LSP stderr if desired (for logs/errors)
  lspProcess.stderr.on("data", (data) => {
    console.error(`LSP stderr: ${data}`);
  });

  // Handle LSP process exit
  lspProcess.on("exit", (code, signal) => {
    BrowserWindow.getAllWindows().forEach((win) =>
      win.webContents.send("lsp-exit", { code, signal }),
    );
  });
});

ipcMain.on("lsp-to-main", (_event, message: string) => {
  console.log("testing...");
  if (lspProcess && lspProcess.stdin?.writable) {
    const lspMessage = createLspMessage(message);
    console.log("from main:" + lspMessage);
    lspProcess.stdin.write(lspMessage);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // lspProcess?.kill();
    app.quit();
  }
});

// Wren Compiler Actions
ipcMain.handle(Channels.wrenLang.tokenize, async (): Promise<TokenizeResponse> => {
  return { tokens: [] };
});

ipcMain.handle(Channels.wrenLang.parse, async (): Promise<ParseResponse> => {
  return { ast: [] };
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
    const hnExpression = getFileTree(folderPath);
    return { folderPath, fileTree: hnExpression };
  }

  return null;
});
