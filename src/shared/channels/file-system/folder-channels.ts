import { ChannelNames } from "@shared/types";

export const folderChannels: ChannelNames = {
  create: "folder:create",
  open: "folder:open",
};

export type CreateFolderRequest = { path: string; name: string };

export type CreateFolderResponse = { success: boolean; error?: string };
