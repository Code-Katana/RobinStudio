import { contextBridge, ipcRenderer } from "electron";
import { electronAPI as electronToolkit } from "@electron-toolkit/preload";
import {
  Channels,
  ParseRequest,
  ParseResponse,
  TokenizeRequest,
  TokenizeResponse,
} from "@shared/channels";
import {
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  SaveFileRequest,
} from "@shared/channels/file-system";

// Custom APIs for renderer
const api = {
  tokenize: (request: TokenizeRequest): Promise<TokenizeResponse> =>
    ipcRenderer.invoke(Channels.wrenLang.tokenize, request),

  parse: (request: ParseRequest): Promise<ParseResponse> =>
    ipcRenderer.invoke(Channels.wrenLang.parse, request),
};

const fileSystem = {
  openFile: (): Promise<OpenFileResponse | null> => ipcRenderer.invoke(Channels.fileChannels.open),

  openFileByPath: (request: OpenFileRequest): Promise<OpenFileResponse | null> =>
    ipcRenderer.invoke(Channels.fileChannels.openByPath, request),

  openFolder: (): Promise<OpenFolderResponse | null> =>
    ipcRenderer.invoke(Channels.folderChannels.open),

  saveFile: (request: SaveFileRequest): Promise<void> =>
    ipcRenderer.invoke(Channels.fileChannels.save, request),
};

const electronAPI = {
  ...electronToolkit,
  closeWindow: (): void => ipcRenderer.send(Channels.browserWindowActions.closeWindow),
  minimizeWindow: (): void => ipcRenderer.send(Channels.browserWindowActions.minimizeWindow),
  maximizeWindow: (): void => ipcRenderer.send(Channels.browserWindowActions.maximizeWindow),
};

// TODO: Add types for the json-rpc params.
const languageServer = {
  sendRequest: (method: string, params?: object | object[]) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once(Channels.lsp.response, (_, response) => resolve(response));
      ipcRenderer.once(Channels.lsp.error, (_, error) => reject(new Error(error)));
      ipcRenderer.send(Channels.lsp.request, { method, params });
    });
  },

  onNotification: (callback: (method: string, params: object | object[]) => void) => {
    ipcRenderer.on(Channels.lsp.notification, (_, { method, params }) => {
      callback(method, params);
    });

    return () => ipcRenderer.removeAllListeners(Channels.lsp.notification);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld("electronToolkit", electronToolkit);
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("fs", fileSystem);
    contextBridge.exposeInMainWorld("languageServer", languageServer);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
