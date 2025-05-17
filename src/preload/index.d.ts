/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElectronAPI } from "@electron-toolkit/preload";
import {
  SaveFileRequest,
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  UpdateTreeRequest,
  UpdateTreeResponse,
} from "@shared/channels/file-system";

declare global {
  interface Window {
    electron: ElectronAPI & {
      closeWindow: () => void;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
    };

    lsp: {
      request: (method: string, params: any) => Promise<void>;
      onResponse: (callback: (value: string) => void) => any;
      onMethod: (method: Method, callback: (value: string) => void) => any;
    };

    fs: {
      createFile: (req: CreateFileRequest) => Promise<void>;
      openFile: () => Promise<OpenFileResponse | null>;
      openFileByPath: (req: OpenFileRequest) => Promise<OpenFileResponse | null>;
      saveFile: (req: SaveFileRequest) => Promise<void>;
      createFolder: (req: CreateFolderRequest) => Promise<{ success: boolean; error?: string }>;
      openFolder: () => Promise<OpenFolderResponse | null>;
      updateTree: (req: UpdateTreeRequest) => Promise<UpdateTreeResponse>;
      resolvePath: (...rest: string[]) => string;
    };

    electronWatcher: {
      onFileEvent: (callback: (data: { type: string; path: string }) => void) => void;
    };
  }
}
