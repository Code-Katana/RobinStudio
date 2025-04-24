import path from "path";
import { ChildProcess, spawn } from "child_process";
import {
  createMessageConnection,
  MessageConnection,
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-jsonrpc/node";
import { BrowserWindow, ipcMain } from "electron";
import { Channels } from "@shared/channels";

let lspProcess: ChildProcess | null;
let lspConnection: MessageConnection | null = null;

function startLSP() {
  console.log("Starting LSP...");

  const lspPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, "../language-server/index.js")
      : path.join(__dirname, "language-server", "index.js");

  lspProcess = spawn("node", [lspPath, "--stdio"], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  if (!lspProcess || !lspProcess.stdout || !lspProcess.stdin) {
    console.error("Failed to spawn LSP process.");
    return;
  }

  lspConnection = createMessageConnection(
    new StreamMessageReader(lspProcess.stdout),
    new StreamMessageWriter(lspProcess.stdin),
  );

  lspConnection.listen();

  lspConnection.onNotification((method, params) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(Channels.lsp.notification, { method, params });
    });
  });

  // Handle LSP requests from the renderer
  ipcMain.on(Channels.lsp.request, (event, msg) => {
    lspConnection
      ?.sendRequest(msg.method, msg.params)
      .then((response) => {
        event.reply(Channels.lsp.response, { method: msg.method, response });
      })
      .catch((err) => {
        console.error("LSP Request Error:", err);
        event.reply(Channels.lsp.error, err.message);
      });
  });

  lspProcess.stdout?.on("data", (data) => {
    console.log(`LSP Response: ${data.toString()}`);
  });

  lspProcess.stderr?.on("data", (data) => {
    console.error(`LSP stderr: ${data.toString()}`);
  });

  lspProcess.on("exit", (code) => {
    console.log(`LSP process exited with code ${code}`);
    lspProcess = null;
    lspConnection = null;

    setTimeout(startLSP, 3000);
  });

  lspProcess.on("error", (error) => {
    console.error(`Failed to start LSP process: ${error.message}`);
    lspProcess = null;
  });
}

export { lspProcess, startLSP, lspConnection };
