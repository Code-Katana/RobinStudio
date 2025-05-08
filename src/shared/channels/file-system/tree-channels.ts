import { ChannelNames, HnExpressionNode } from "@shared/types";

export const treeChannels: ChannelNames = {
  updateTree: "tree:update-tree",
};

export type UpdateTreeRequest = { path: string };

export type UpdateTreeResponse = { tree: HnExpressionNode };
