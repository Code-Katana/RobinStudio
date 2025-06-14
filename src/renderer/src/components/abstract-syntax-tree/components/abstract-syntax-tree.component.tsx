import { TreeNode } from "@renderer/types";
import Tree from "react-d3-tree";

interface AbstractSyntaxTreeProps {
  tree: TreeNode;
}

export const AbstractSyntaxTree: React.FC<AbstractSyntaxTreeProps> = ({ tree }) => {
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
