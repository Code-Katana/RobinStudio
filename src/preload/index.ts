/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from "electron";
import { electronAPI as electronToolkit } from "@electron-toolkit/preload";
import { Channels } from "@shared/channels";
import {
  CreateFileRequest,
  CreateFolderRequest,
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  SaveFileRequest,
  UpdateTreeRequest,
  UpdateTreeResponse,
} from "@shared/channels/file-system";
import { treeChannels } from "@shared/channels/file-system/tree-channels";
import { FileEvent } from "@shared/types";
import path from "path";

// Custom APIs for renderer
const lsp = {
  request: (method: string, params: any): Promise<void> =>
    ipcRenderer.invoke("lsp-request", { method, params }),

  onResponse: (callback: (value: string) => void): any =>
    ipcRenderer.on("lsp-response", (_, value) => callback(value)),
};

const fileSystem = {
  createFile: (request: CreateFileRequest): Promise<void> =>
    ipcRenderer.invoke(Channels.fileChannels.create, request),

  openFile: (): Promise<OpenFileResponse | null> => ipcRenderer.invoke(Channels.fileChannels.open),

  openFileByPath: (request: OpenFileRequest): Promise<OpenFileResponse | null> =>
    ipcRenderer.invoke(Channels.fileChannels.openByPath, request),

  saveFile: (request: SaveFileRequest): Promise<void> =>
    ipcRenderer.invoke(Channels.fileChannels.save, request),

  createFolder: (request: CreateFolderRequest): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke(Channels.folderChannels.create, request),

  openFolder: (): Promise<OpenFolderResponse | null> =>
    ipcRenderer.invoke(Channels.folderChannels.open),

  updateTree: (request: UpdateTreeRequest): Promise<UpdateTreeResponse> =>
    ipcRenderer.invoke(treeChannels.updateTree, request),

  resolvePath: (...rest: string[]): string => path.resolve(...rest),
};

const electronAPI = {
  ...electronToolkit,
  closeWindow: (): void => ipcRenderer.send(Channels.browserWindowActions.closeWindow),
  minimizeWindow: (): void => ipcRenderer.send(Channels.browserWindowActions.minimizeWindow),
  maximizeWindow: (): void => ipcRenderer.send(Channels.browserWindowActions.maximizeWindow),
};

const electronWatcher = {
  onFileEvent: (callback: (event: FileEvent) => void) => {
    ipcRenderer.on("file-event", (_, data) => callback(data));
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld("electronToolkit", electronToolkit);
    // contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("lsp", lsp);
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("fs", fileSystem);
    contextBridge.exposeInMainWorld("electronWatcher", electronWatcher);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
