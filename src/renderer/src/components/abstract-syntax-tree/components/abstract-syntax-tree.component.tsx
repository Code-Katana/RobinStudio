/* eslint-disable @typescript-eslint/no-explicit-any */
import Tree from "react-d3-tree";

interface props {
  ast: any;
}

export const AbstractSyntaxTree: React.FC<props> = ({ ast }) => {
  const tree = transformTree(ast);

  return (
    <section id="treeWrapper" className="h-svh bg-secondary">
      <Tree
        data={tree}
        draggable
        orientation="vertical"
        initialDepth={2}
        rootNodeClassName="ast-root"
        branchNodeClassName="ast-node"
        leafNodeClassName="ast-leaf"
        enableLegacyTransitions
        transitionDuration={500}
        pathFunc="diagonal"
        nodeSize={{ x: 250, y: 150 }}
        translate={{ x: 100, y: 100 }}
      />
    </section>
  );
};

type TreeNode = {
  name: string;
  type?: string;
  attributes?: Record<string, string | number | boolean>;
  children?: TreeNode[];
};

function transformTree(ast: any): TreeNode {
  const { type, start_line, end_line, node_start, node_end, globals, body, ...rest } = ast;

  const children: TreeNode[] = [];

  if (globals) {
    children.push({
      name: "globals",
      type: "array",
      children:
        globals.length > 0
          ? globals.map((global: any) => transformTree(global))
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
      children: body.map((item: any) => transformTree(item)),
    });
  }

  for (const key of Object.keys(rest)) {
    const value = rest[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      children.push(transformTree(value));
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
              ? transformTree(item)
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
