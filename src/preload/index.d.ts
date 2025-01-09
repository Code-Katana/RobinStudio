import { ElectronAPI } from "@electron-toolkit/preload";
import { ParseRequest, ParseResponse, TokenizeRequest, TokenizeResponse } from "@shared/channels";
import { OpenFolderResponse } from "@shared/channels/file-system";

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
      openFileByPath: (OpenFileRequest) => Promise<OpenFileResponse | null>;
      saveFile: (SaveFileRequest) => Promise<void>;
      openFolder: () => Promise<OpenFolderResponse | null>;
    };
  }
}
