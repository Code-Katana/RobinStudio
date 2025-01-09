import { ElectronAPI } from "@electron-toolkit/preload";
import { TokenizeRequest, TokenizeResponse } from "@shared/channels";
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
      // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
      parse: (request: TokenizeRequest) => Promise<{ ast: any }>;
    };

    fs: {
      openFile: () => Promise<OpenFileResponse | null>;
      openFileByPath: (OpenFileRequest) => Promise<OpenFileResponse | null>;
      saveFile: (SaveFileRequest) => Promise<void>;
      openFolder: () => Promise<OpenFolderResponse | null>;
    };
  }
}
