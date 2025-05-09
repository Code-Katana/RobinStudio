import { wrenLang } from "./wren-lang";
import { browserWindowActions } from "./browser-window-actions";
import { fileChannels, folderChannels, treeChannels } from "./file-system";

export const Channels = {
  wrenLang,
  browserWindowActions,
  fileChannels,
  folderChannels,
  treeChannels,
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];
