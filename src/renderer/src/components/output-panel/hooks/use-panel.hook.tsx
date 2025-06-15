import { CompilerPhase } from "@renderer/types";
import { useOutput } from "@renderer/hooks/use-output";
import { TokensPanel } from "../components/panels/tokens-panel.component";
import { AstPanel } from "../components/panels/ast-panel.component";
import { IntermediateRepresentationPanel } from "../components/panels/ir-panel.component";
import { CodeOptimizationPanel } from "../components/panels/code-optimization-panel.component";
import { CompilePanel } from "../components/panels/compile-panel.component";

export const usePanel = (): React.ReactNode => {
  const { output } = useOutput();

  switch (output.data) {
    case CompilerPhase.Tokenize:
      return <TokensPanel />;

    case CompilerPhase.Parse:
      return <AstPanel />;

    case CompilerPhase.IrGeneration:
      return <IntermediateRepresentationPanel />;

    case CompilerPhase.IrOptimization:
      return <CodeOptimizationPanel />;

    case CompilerPhase.Compile:
      return <CompilePanel />;
  }

  return <></>;
};
