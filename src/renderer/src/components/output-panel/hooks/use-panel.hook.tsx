import { CompilerPhase } from "@renderer/types";
import { useOutput } from "@renderer/hooks/use-output";
import { TokensPanel } from "../components/panels/tokens-panel.component";
import { AstPanel } from "../components/panels/ast-panel.component";

export const usePanel = (): React.ReactNode => {
  const { output } = useOutput();

  switch (output.data) {
    case CompilerPhase.Tokenize:
      return <TokensPanel />;

    case CompilerPhase.Parse:
      return <AstPanel />;
  }

  return <></>;
};
