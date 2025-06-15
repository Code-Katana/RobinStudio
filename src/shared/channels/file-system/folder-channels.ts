import { ChannelNames } from "@shared/types";

export const folderChannels: ChannelNames = {
  create: "folder:create",
  open: "folder:open",
  delete: "folder:delete",
};

export type CreateFolderRequest = { path: string; name: string };
export type DeleteFolderRequest = { path: string };

export type CreateFolderResponse = { success: boolean; error?: string };
export type DeleteFolderResponse = { success: boolean; error?: string };
