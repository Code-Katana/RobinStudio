import { CompilerPhase } from "@renderer/types";
import { TokensPanel } from "../components/panels/tokens-panel.component";
import { useOutput } from "@renderer/hooks/use-output";

export const usePanel = (): React.ReactNode => {
  const { output } = useOutput();

  switch (output.data) {
    case CompilerPhase.Tokenize:
      return <TokensPanel />;
  }

  return <></>;
};
