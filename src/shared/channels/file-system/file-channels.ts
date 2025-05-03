import { ChannelNames, HnExpressionNode } from "@shared/types";

export const fileChannels: ChannelNames = {
  create: "file:create",
  open: "file:open",
  save: "file:save",
  openByPath: "file:open-by-path",
};

export type CreateFileRequest = { path: string; name: string };

export type OpenFileRequest = { path: string | undefined };

export type OpenFileResponse = { path: string; content?: string };

export type SaveFileRequest = { path: string; content: string };

export type OpenFolderResponse = {
  folderName: string;
  folderPath: string;
  fileTree: HnExpressionNode;
};
