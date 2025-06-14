import { useOutput } from "@renderer/hooks/use-output";
import { TokensPanel } from "./tokens-panel.component";
import { CompilerPhase } from "@renderer/types";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { AstPanel } from "./ast-panel.component";

export const OutputPanel = () => {
  const { output } = useOutput();

  const renderPanel = () => {
    switch (output.data) {
      case CompilerPhase.Tokenize:
        return <TokensPanel />;
      case CompilerPhase.Parse:
        return <AstPanel />;
      default:
        return <ComingSoon />;
    }
  };

  return <ScrollArea className="h-full">{renderPanel()}</ScrollArea>;
};

const ComingSoon = () => {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">Coming Soon 🤝</div>
        <div className="text-sm text-muted-foreground">We are working on it</div>
      </div>
    </div>
  );
};
