import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HnExpressionNode, HnNode } from "@shared/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

type FileTree = HnExpressionNode | undefined;

export function findFiles(tree: FileTree, target: string, root: string): HnNode[] {
  if (!tree) return [];

  const [, children] = tree;
  const matches: HnNode[] = [];

  if (!children) return matches;

  for (const child of children) {
    if (!Array.isArray(child) && (child as HnNode).type === "file") {
      const file = child as HnNode;
      if (file.name.includes(target)) {
        matches.push({
          ...file,
          path: getRelativePath(root, file.path),
        });
      }
    } else {
      const subMatches = findFiles(child, target, root);
      matches.push(...subMatches);
    }
  }

  return matches;
}

export function getRelativePath(root: string, path: string): string {
  if (!path.includes(root)) return path;

  return path.slice(path.indexOf(root) + root.length + 1);
}
