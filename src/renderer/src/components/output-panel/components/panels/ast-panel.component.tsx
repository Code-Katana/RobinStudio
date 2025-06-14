import { AbstractSyntaxTree } from "@renderer/components/abstract-syntax-tree";
import { useLanguageClient } from "@renderer/hooks/use-languageclient";
import { TreeNode } from "@renderer/types";
import { ParserOptions } from "@shared/types";

type AstResponse = {
  ast: TreeNode;
  parserOption: ParserOptions;
};

export const AstPanel = () => {
  const response = useLanguageClient("compilerAction/parseAst");

  if (!response) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">
          No AST to display yet. Run the parser first.
        </div>
      </div>
    );
  }

  const result = response?.result as AstResponse;

  if (!result || !result.ast) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Failed to load AST. Please try again.</div>
      </div>
    );
  }

  return <AbstractSyntaxTree tree={result?.ast} />;
};
