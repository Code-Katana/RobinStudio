import { contextBridge, ipcRenderer } from "electron";
import { electronAPI as electronToolkit } from "@electron-toolkit/preload";
import { Channels, TokenizeRequest, TokenizeResponse } from "@shared/channels";

// Custom APIs for renderer
const api = {
  tokenize: (request: TokenizeRequest): Promise<TokenizeResponse> =>
    ipcRenderer.invoke(Channels.WrenLang.tokenize, request),
};

const electronAPI = {
  ...electronToolkit,
  closeWindow: (): void => ipcRenderer.send(Channels.BrowserWindowActions.closeWindow),
  minimizeWindow: (): void => ipcRenderer.send(Channels.BrowserWindowActions.minimizeWindow),
  maximizeWindow: (): void => ipcRenderer.send(Channels.BrowserWindowActions.maximizeWindow),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld("electronToolkit", electronToolkit);
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
