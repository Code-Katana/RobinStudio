/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTransformTree } from "@renderer/hooks/use-transform-tree";
import Tree from "react-d3-tree";

interface props {
  ast: any;
}

export const AbstractSyntaxTree: React.FC<props> = ({ ast }) => {
  const tree = useTransformTree(ast);

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
