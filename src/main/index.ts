import fs from "fs";
import path, { join } from "path";
import { WASI } from "wasi";

import { app, protocol, shell, BrowserWindow, ipcMain } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "@resources/icon.png?asset";

import { AssetUrl } from "@shared/protocols/asset-url";
import { AssetServer } from "@shared/protocols/asset-server";

import { splitSourceCode } from "@main/lib/utils";
import { ScannerOptions, Token } from "@shared/types";
import { Channels, TokenizeRequest, TokenizeResponse } from "@shared/channels";

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

// wasm integration for the wren-lang scanner
const wasmPath = path.resolve(__dirname, "../../resources/wren-lang.wasm");
const wasmBuffer = fs.readFileSync(wasmPath);

app.on("ready", async () => {
  ipcMain.handle(
    Channels.WrenLang.tokenize,
    async (_event, request: TokenizeRequest): Promise<TokenizeResponse> => {
      console.log("TASK: loading wasm instance");

      const envMemory = new WebAssembly.Memory({ initial: 256, maximum: 65536 });

      const wasi = new WASI({
        version: "preview1",
        args: [],
        env: {
          memory: envMemory,
        },
        preopens: {},
      });

      const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
        env: {
          envMemory,
          table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
          __cxa_throw: () => {
            throw new Error("__cxa_throw was called");
          },
          _emscripten_memcpy_js: (dest: number, src: number, num: number) => {
            const memView = new Uint8Array(envMemory.buffer);
            memView.copyWithin(dest, src, src + num);
            return dest;
          },
          emscripten_resize_heap: (requestedSize: number) => {
            // try {
            //   const currentPages = envMemory.buffer.byteLength / 65536;
            //   const requestedPages = Math.ceil(requestedSize / 65536);
            //   if (requestedPages > currentPages) {
            //     envMemory.grow(requestedPages - currentPages);
            //     return 1;
            //   }
            //   return 0;
            // } catch {
            //   return -1;
            // }
            return requestedSize;
          },
          _abort_js: (messagePtr: number) => {
            const memoryView = new Uint8Array(envMemory.buffer);
            let message = "";
            for (let i = messagePtr; memoryView[i] !== 0; i++) {
              message += String.fromCharCode(memoryView[i]);
            }
            console.error("WebAssembly aborted:", message);
            throw new Error(`WebAssembly aborted: ${message}`);
          },
          __assert_fail: (
            messagePtr: number,
            filePtr: number,
            line: number,
            functionPtr: number,
          ) => {
            const memoryView = new Uint8Array(envMemory.buffer);

            const readCString = (ptr: number): string => {
              let str = "";
              for (let i = ptr; memoryView[i] !== 0; i++) {
                str += String.fromCharCode(memoryView[i]);
              }
              return str;
            };

            const message = readCString(messagePtr);
            const file = readCString(filePtr);
            const functionName = readCString(functionPtr);

            console.error(
              `Assertion failed: ${message} at ${file}:${line} in function ${functionName}`,
            );
            throw new Error(
              `Assertion failed: ${message} at ${file}:${line} in function ${functionName}`,
            );
          },
        },
        wasi_snapshot_preview1: wasi.wasiImport,
      });

      if (wasmModule.instance.exports._start) {
        wasi.start(wasmModule.instance);
      }

      console.log("DONE: wasm instance has been leaded successfully");

      const { setup_tokenizer, tokenize, malloc, free, free_result, memory } = wasmModule.instance
        .exports as {
        malloc: (size: number) => number;
        free: (ptr: number) => void;
        free_result: (ptr: number) => void;
        setup_tokenizer: (sourcePtr: number, scOpt: number) => void;
        tokenize: () => number;
        memory: WebAssembly.Memory;
      };

      console.log("memory: \n");

      console.log(JSON.stringify(memory) + "\n");

      const memView = new Uint8Array(memory.buffer);

      const chunks = splitSourceCode(request.source);

      const encoder = new TextEncoder();
      let sourceBytes = encoder.encode(chunks[0] + "\0");
      let sourcePtr = malloc(sourceBytes.length);
      memView.set(sourceBytes, sourcePtr);

      function updateSourcePtr(str: string): void {
        sourceBytes = encoder.encode(str + "\0");
        sourcePtr = malloc(sourceBytes.length);
        memView.set(sourceBytes, sourcePtr);
      }

      let resultPtr: number;
      const tokens: Token[] = [];
      let currentToken: Token | null = null;

      try {
        console.log(
          `TASK: start tokenization using ${request.scanner === ScannerOptions.FA ? "Finite Automaton" : "Hand Coded"}`,
        );

        chunks.forEach((chunk) => {
          updateSourcePtr(chunk);
          setup_tokenizer(sourcePtr, request.scanner);

          do {
            resultPtr = tokenize(); // 84651

            let str = "";

            if (!resultPtr) {
              throw new Error("Tokenize returned a null pointer.");
            }

            console.log(`$resultPtr = ${resultPtr}`);

            for (let i = resultPtr; memView[i] !== 0; i++) {
              str += String.fromCharCode(memView[i]);
            }

            // 84651 84652 84653 84654 84655 84656
            // S     A     M     I     R     0

            console.log(str);
            currentToken = JSON.parse(str) as Token;

            tokens.push(currentToken);

            if (currentToken.value === "$") {
              break;
            }
          } while (currentToken != null);
        });

        console.log(`DONE: Tokenized successfully.`);

        // const tokens: Token[] = JSON.parse(str);
        return { tokens };
      } catch (err) {
        console.log("ERROR: failed to tokenize the source you provided: ");
        console.error(err);

        // todo: change it to undefined or null and handle the case in the frontend.
        return { tokens: [] };
      } finally {
        free(sourcePtr);

        if (typeof free_result === "function") {
          free_result(resultPtr!);
        }

        console.log("NOTE: release the pointer for results from memory.");
      }
    },
  );

  ipcMain.on(Channels.BrowserWindowActions.closeWindow, () => {
    mainWindow?.close();
  });

  ipcMain.on(Channels.BrowserWindowActions.minimizeWindow, () => {
    mainWindow?.minimize();
  });

  ipcMain.on(Channels.BrowserWindowActions.maximizeWindow, () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.restore();
      return;
    }

    mainWindow?.maximize();
  });
});
