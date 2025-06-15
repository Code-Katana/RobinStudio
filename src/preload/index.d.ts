import { ElectronAPI } from "@electron-toolkit/preload";
import {
  SaveFileRequest,
  OpenFileRequest,
  OpenFileResponse,
  OpenFolderResponse,
  UpdateTreeRequest,
  UpdateTreeResponse,
  DeleteFolderRequest,
} from "@shared/channels/file-system";
import { ResponseMessage, RequestMessage, NotificationMessage, RequestMethod } from "@shared/types";

declare global {
  interface Window {
    electron: ElectronAPI & {
      closeWindow: () => void;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
    };

    lsp: {
      send: (message: RequestMessage | NotificationMessage) => Promise<void>;
      onResponse: (callback: (value: string) => void) => void;
      onMethod: (method: RequestMethod, callback: (value: ResponseMessage) => void) => void;
    };

    fs: {
      createFile: (req: CreateFileRequest) => Promise<void>;
      openFile: () => Promise<OpenFileResponse | null>;
      openFileByPath: (req: OpenFileRequest) => Promise<OpenFileResponse | null>;
      saveFile: (req: SaveFileRequest) => Promise<void>;
      createFolder: (req: CreateFolderRequest) => Promise<{ success: boolean; error?: string }>;
      openFolder: () => Promise<OpenFolderResponse | null>;
      deleteFolder: (req: DeleteFolderRequest) => Promise<{ success: boolean; error?: string }>;
      updateTree: (req: UpdateTreeRequest) => Promise<UpdateTreeResponse>;
      resolvePath: (...rest: string[]) => string;
      launch: (exePath: string, args: string[] = []) => Promise<number | null>;
    };

    electronWatcher: {
      onFileEvent: (callback: (data: { type: string; path: string }) => void) => void;
    };
  }
}
