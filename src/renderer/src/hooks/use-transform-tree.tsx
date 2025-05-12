/* eslint-disable @typescript-eslint/no-explicit-any */
import { TreeNode } from "@renderer/types";

export function useTransformTree(ast: any): TreeNode {
  const { type, start_line, end_line, node_start, node_end, globals, body, ...rest } = ast;

  const children: TreeNode[] = [];

  if (globals) {
    children.push({
      name: "globals",
      type: "array",
      children:
        globals.length > 0
          ? globals.map((global: any) => useTransformTree(global))
          : [
              {
                name: "empty",
                type: "leaf",
              },
            ],
    });
  }
  if (body && body.length > 0) {
    children.push({
      name: "body",
      type: "array",
      children: body.map((item: any) => useTransformTree(item)),
    });
  }

  for (const key of Object.keys(rest)) {
    const value = rest[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      children.push(useTransformTree(value));
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        children.push({
          name: key,
          type: "array",
          children: [
            {
              name: "empty",
              type: "leaf",
            },
          ],
        });
      } else {
        children.push({
          name: key,
          type: "array",
          children: value.map((item: any) =>
            item && typeof item === "object"
              ? useTransformTree(item)
              : {
                  name: String(item),
                  type: "leaf",
                },
          ),
        });
      }
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      children.push({
        name: key,
        type: "leaf",
        children: [
          {
            name: String(value),
            type: "value",
          },
        ],
      });
    }
  }

  return {
    name: type,
    type: "node",
    attributes: {
      start_line,
      end_line,
      node_start,
      node_end,
    },
    children: children.length > 0 ? children : undefined,
  } as TreeNode;
}
