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

    electronWatcher: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFileEvent: (callback: (event: any, data: { type: string; path: string }) => void) => void;
    };
  }
}
