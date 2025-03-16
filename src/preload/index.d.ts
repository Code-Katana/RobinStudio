import { ElectronAPI } from "@electron-toolkit/preload";
import { ParseRequest, ParseResponse, TokenizeRequest, TokenizeResponse } from "@shared/channels";
import {
  SaveFileRequest,
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
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
      openFile: () => Promise<OpenFileResponse | null>;
      openFileByPath: (req: OpenFileRequest) => Promise<OpenFileResponse | null>;
      saveFile: (req: SaveFileRequest) => Promise<void>;
      openFolder: () => Promise<OpenFolderResponse | null>;
    };

    languageServer: {
      sendRequest: (method: string, params?: object | object[]) => Promise<void>;
      onNotification: (
        callback: (method: string, params: object | object[]) => void,
      ) => () => Electron.IpcRenderer;
    };
  }
}
