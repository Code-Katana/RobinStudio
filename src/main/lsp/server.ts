/* eslint-disable no-constant-condition */
import { Channels } from "@shared/channels";
import { NotificationMessage, RequestMessage, RequestMethod, ResponseMessage } from "@shared/types";
import { spawn } from "child_process";
import { BrowserWindow, ipcMain } from "electron";

let lspServer: ReturnType<typeof spawn> | null = null;

export function startServer(mainWindow: BrowserWindow): void {
  const methodByRequestId: Record<number, RequestMethod> = {};

  lspServer = spawn("rbn", ["--lsp"], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  lspServer.stdout?.on("data", (data: Buffer) => {
    const message = data.toString().trim();
    readMessage(mainWindow, methodByRequestId, message);
  });

  lspServer.on("error", (err) => {
    console.error("LSP process error:", err);
  });

  lspServer.on("exit", (code) => {
    console.log(`LSP process exited with code ${code}`);
    setTimeout(() => {
      console.log("restarting lsp server in 3s...");
      startServer(mainWindow);
    }, 3000);
  });

  ipcMain.handle(Channels.lsp.request, async (_, message: RequestMessage | NotificationMessage) => {
    // console.log("message", message);
    if ("id" in message && message.id) {
      methodByRequestId[message.id] = message.method as RequestMethod;
      console.log("methodByRequestId", methodByRequestId);
    }
    return writeMessage(message);
  });
}

function writeMessage(message: RequestMessage | NotificationMessage): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!lspServer || !lspServer.stdin || !lspServer.stdin.writable)
      return reject(new Error("lspServer stdin not writable"));

    const stringifiedMessage = JSON.stringify(message);
    // console.log("lsp-request", stringifiedMessage);

    const flushed = lspServer.stdin.write(
      `Content-Length: ${stringifiedMessage.length}\r\n\r\n${stringifiedMessage}`,
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

function readMessage(
  mainWindow: BrowserWindow,
  methodByRequestId: Record<number, RequestMethod>,
  message: string,
): void {
  const contentLength = message.match(/Content-Length: (\d+)/)?.[1];
  const messageStart = message.indexOf("{");
  const messageEnd = messageStart + Number(contentLength);
  const response: ResponseMessage = JSON.parse(message.slice(messageStart, messageEnd));

  console.log("Received response:", response);

  // Handle notifications (messages without an id)
  if (response.id === null || response.id === undefined) {
    mainWindow.webContents.send(Channels.lsp.notification, response);
    return;
  }

  // Handle responses with methods
  const expectedMethod = methodByRequestId[response.id];
  console.log("Expected method for response", response.id, ":", expectedMethod);

  if (expectedMethod && Channels.lsp.methods[expectedMethod]) {
    console.log("Sending response to method channel:", expectedMethod);
    mainWindow.webContents.send(Channels.lsp.methods[expectedMethod], response);
    // Clean up the map after handling the response
    delete methodByRequestId[response.id];
  } else {
    console.log(
      "No method found for response",
      response.id,
      ", sending to default response channel",
    );
    // Fallback for responses without a specific method channel
    mainWindow.webContents.send(Channels.lsp.response, response);
  }
}
