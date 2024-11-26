import { ElectronAPI } from "@electron-toolkit/preload";
import { TokenizeRequest, TokenizeResponse } from "@shared/channels";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      tokenize: (request: TokenizeRequest) => Promise<TokenizeResponse>;
    };
  }
}
