import fs from "fs";
import path, { join } from "path";
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
import { ScannerOptions } from "@shared/types";
import {
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  SaveFileRequest,
} from "@shared/channels/file-system";
import { getFileTree } from "./lib/get-file-tree";
import { executeCompiler } from "./lib/execute-compiler";
import { readCompilerOutput } from "./lib/read-compiler-output";
import WebSocket from "ws";
import { ChildProcess, spawn } from "child_process";

let mainWindow: BrowserWindow | null;
let lspProcess: ChildProcess | null;
let lspSocket: WebSocket | null;

function startLSP() {
  console.log("Starting LSP process...");
  const lspPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, "../language-server/server.js")
      : path.join(__dirname, "language-server", "server.js");

  lspProcess = spawn("node", [lspPath], {
    stdio: ["pipe", "pipe", "inherit"], // Pipe logs to the main process console
  });

  lspProcess.on("exit", (code) => {
    console.log(`LSP Server exited with code ${code}`);
  });

  lspProcess.on("error", (err) => {
    console.error("Failed to start LSP Server:", err);
  });
}

function connectToLSP() {
  console.log("Starting WebSocket connection to LSP...");

  lspSocket = new WebSocket("ws://localhost:8081");

  lspSocket.on("open", () => {
    console.log("Connected to LSP via WebSocket");
  });

  lspSocket.on("message", (message) => {
    console.log("LSP Response:", message.toString());
    mainWindow?.webContents.send("lsp-response", JSON.parse(message.toString()));
  });

  lspSocket.on("close", () => {
    console.log("WebSocket connection to LSP closed.");
    lspSocket = null;
  });

  lspSocket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

function sendLSPRequest(method: string, params: object = {}) {
  if (!lspSocket || lspSocket.readyState !== WebSocket.OPEN) {
    console.error("LSP WebSocket is not connected.");
    return;
  }

  const request = {
    jsonrpc: "2.0",
    id: Date.now(),
    method,
    params,
  };

  lspSocket.send(JSON.stringify(request));
}

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
    return asset.isNodeModule
      ? server.fromNodeModules(asset.relativeUrl)
      : server.fromPublic(asset.relativeUrl);
  });

  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Example Usage
  startLSP();
  connectToLSP();
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
    lspSocket?.close();
    app.quit();
  }
});

// Wren Compiler Actions
ipcMain.handle(
  Channels.wrenLang.tokenize,
  async (_event, request: TokenizeRequest): Promise<TokenizeResponse> => {
    // const { source, scanner } = request;

    // const exePath = path.resolve("./resources/bin", "wren-lang.exe");
    // const inputFilePath = source;
    // const outputFilePath = path.resolve("./resources/debug", "token-stream.json");

    // await executeCompiler(exePath, scanner, "tokenize", inputFilePath, outputFilePath);

    // const jsonData = await readCompilerOutput<Token[]>(outputFilePath);

    // return { tokens: jsonData };

    sendLSPRequest("initialize", {
      processId: process.pid,
      rootUri: request.source,
      capabilities: {},
    });

    return { tokens: [] };
  },
);

ipcMain.handle(
  Channels.wrenLang.parse,
  async (_event, request: ParseRequest): Promise<ParseResponse> => {
    const { source } = request;

    const exePath = path.resolve("./resources/bin", "wren-lang.exe");
    const inputFilePath = source;
    const outputFilePath = path.resolve("./resources/debug", "parse-tree.json");

    await executeCompiler(exePath, ScannerOptions.FA, "parse", inputFilePath, outputFilePath);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonData = await readCompilerOutput<any>(outputFilePath);

    return { ast: jsonData };
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
    const hnExpression = getFileTree(folderPath);
    return { folderPath, fileTree: hnExpression };
  }

  return null;
});
