import { ElectronAPI } from "@electron-toolkit/preload";
import { ParseRequest, ParseResponse, TokenizeRequest, TokenizeResponse } from "@shared/channels";
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

    api: {
      tokenize: (request: TokenizeRequest) => Promise<TokenizeResponse>;
      parse: (request: ParseRequest) => Promise<ParseResponse>;
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

    languageServer: {
      sendRequest: (method: string, params?: object | object[]) => Promise<void>;
      onNotification: (
        callback: (method: string, params: object | object[]) => void,
      ) => () => Electron.IpcRenderer;
    };
  }
}
