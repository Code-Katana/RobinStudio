import fs from "fs";
import { HnExpressionNode, HnNode } from "@shared/types";
import path from "path";

export function getFileTree(dirPath: string): HnExpressionNode {
  const rootStat = fs.statSync(dirPath);

  const rootNode: HnNode = {
    name: path.basename(dirPath),
    type: rootStat.isDirectory() ? "folder" : "file",
    path: dirPath,
    size: rootStat.isDirectory() ? undefined : rootStat.size,
  };

  if (rootNode.type === "file") {
    return [rootNode];
  }

  const rootContent = fs.readdirSync(dirPath);
  const files: string[] = [];
  const folders: string[] = [];

  for (const item of rootContent) {
    fs.statSync(path.join(dirPath, item)).isDirectory() ? folders.push(item) : files.push(item);
  }

  const children = [...folders, ...files].map((item) => {
    const itemPath = path.join(dirPath, item);
    return getNode(itemPath);
  }) as HnExpressionNode[];

  return [rootNode, children];
}

function getNode(itemPath: string): HnExpressionNode | HnNode {
  const stat = fs.statSync(itemPath);

  if (stat.isDirectory()) {
    return getFileTree(itemPath);
  }

  return {
    name: path.basename(itemPath),
    type: "file",
    path: itemPath,
    size: stat.size,
  };
}
