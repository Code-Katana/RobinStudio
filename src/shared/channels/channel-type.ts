import { browserWindowActions } from "./browser-window-actions";
import { fileChannels, folderChannels, treeChannels } from "./file-system";
import { lsp } from "./language-server";

export const Channels = {
  browserWindowActions,
  fileChannels,
  folderChannels,
  treeChannels,
  lsp,
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];
