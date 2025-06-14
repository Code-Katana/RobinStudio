import { useLanguageServer } from "@renderer/hooks/use-langaugeserver";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useOutput } from "@renderer/hooks/use-output";
import { CompilerPhase } from "@renderer/types";
import { ParserOptions, ScannerOptions } from "@shared/types";

export const useRunController = () => {
  const handler = useLanguageServer();
  const { currentFile } = useCurrentProject();
  const { getData, setPhase } = useOutput();

  const current = getData();

  const onChange = (phase: CompilerPhase) => setPhase(phase);

  const takeAction = () => {
    const path = currentFile!.path;
    if (current === CompilerPhase.Tokenize) {
      handler({
        messageType: "request",
        method: "compilerAction/tokenize",
        params: {
          scannerOption: ScannerOptions.FA,
          textDocument: path,
        },
      });
    } else if (current === CompilerPhase.Parse) {
      handler({
        messageType: "request",
        method: "compilerAction/parseAst",
        params: {
          parserOption: ParserOptions.LL1,
          textDocument: path,
        },
      });
    } else if (current === CompilerPhase.IrGeneration) {
      handler({
        messageType: "request",
        method: "compilerAction/ir",
        params: {
          textDocument: path,
          outputDocument: path.slice(0, path.lastIndexOf(".rbn")) + ".ir.ll",
        },
      });
    } else if (current === CompilerPhase.IrOptimization) {
      handler({
        messageType: "request",
        method: "compilerAction/optimization",
        params: {
          textDocument: path,
          outputDocument: path.slice(0, path.lastIndexOf(".rbn")) + ".optimized.ll",
        },
      });
    } else if (current === CompilerPhase.Compile) {
      handler({
        messageType: "request",
        method: "compilerAction/compile",
        params: {
          textDocument: path,
          outputDocument: path.slice(0, path.lastIndexOf(".rbn")),
        },
      });
    }
  };

  return { current, onChange, takeAction };
};
