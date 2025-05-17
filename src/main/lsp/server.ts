/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-condition */
import { Channels } from "@shared/channels";
import { spawn } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";

let lspServer: ReturnType<typeof spawn> | null = null;

export function startServer(mainWindow: BrowserWindow): void {
  let id = 0;

  lspServer = spawn(join(app.getAppPath(), "resources", "bin", "rbn.exe"), ["--lsp"], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  lspServer.stdout?.on("data", (data: Buffer) => {
    const message = data.toString().trim();
    console.log("lsp-response", message);
    mainWindow.webContents.send(Channels.lsp.response, message);
  });

  lspServer.on("error", (err) => {
    console.error("LSP process error:", err);
  });

  lspServer.on("exit", (code) => {
    console.log(`LSP process exited with code ${code}`);
  });

  ipcMain.handle(Channels.lsp.request, async (_, req: any) => {
    return writeMessage(id++, req.method, req.params);
  });
}

function writeMessage(id: number, method: string, params: any): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!lspServer || !lspServer.stdin || !lspServer.stdin.writable)
      return reject(new Error("lspServer stdin not writable"));

    const message = JSON.stringify({ jsonrpc: "2.0", id, method, params });
    console.log("lsp-request", message);

    const flushed = lspServer.stdin.write(
      `Content-Length: ${message.length}\r\n\r\n${message}`,
      "utf8",
      (err) => {
        if (err) return reject(err);
        resolve();
      },
    );

    if (!flushed) {
      lspServer.stdin.once("drain", resolve);
    }
  });
}
