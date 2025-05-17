import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import RobinLogo from "@renderer/assets/images/rbnLogo.jpg";
import { Separator, Run, Phases } from "@renderer/assets/icons";
import { useState } from "react";
import { FileFinder } from "@renderer/components/file-finder";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { FileOperations } from "@renderer/components/file-operation";
import { TitleBarAction } from "./title-bar-action.component";
import { CompilerPhase } from "@renderer/types";
import { useOutput } from "@renderer/hooks/use-output";

export const TitleBar: React.FC = () => {
  const { projectName, currentFile } = useCurrentProject();
  const [isPhasesOpen, setIsPhasesOpen] = useState(false);
  const { output, setPhase } = useOutput();

  const iconSize = "w-5 h-5";

  const handlePhaseSelect = (phase: CompilerPhase) => {
    setPhase(phase);
    setIsPhasesOpen(false);
  };

  const handleRun = () => {
    if (!output.data) {
      alert("Please select a phase first");
      return;
    }
    if (output.panelType === "phase" && output.data === CompilerPhase.Tokenize) {
      if (!currentFile) {
        alert("Please select a file first");
        return;
      }

      window.lsp.request("tokenize", {
        scannerOption: 1,
        textDocument: currentFile.path,
      });
    }
  };

  return (
    <nav className="z-50 flex w-full items-start justify-between gap-4 shadow-md app-drag *:app-no-drag">
      <div className="flex items-center justify-center gap-4 p-2">
        <div className="flex items-center gap-2 text-sm">
          <img src={RobinLogo} alt="Robin Logo" className="h-6 w-6 rounded-sm" />
          <span>
            <p>{projectName || "RobinStudio"}</p>
          </span>
          <div
            className={cn(
              "flex items-center",
              !projectName && "pointer-events-none select-none opacity-0",
            )}
          >
            <FileOperations />
          </div>

          <div
            className={cn(
              "flex items-center gap-2",
              !projectName && "pointer-events-none select-none opacity-0",
            )}
          >
            <Separator className={cn("text-neutral-600", iconSize)} />
            <FileFinder />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "m-2 flex gap-[2px] overflow-hidden rounded-lg border",
          !projectName && "pointer-events-none select-none opacity-0",
        )}
      >
        <Button className="flex rounded-none border-none bg-secondary/50" onClick={handleRun}>
          <Run />
          <span>Run</span>
        </Button>
        <Popover open={isPhasesOpen} onOpenChange={setIsPhasesOpen}>
          <PopoverTrigger asChild>
            <Button className="rounded-none border-none bg-secondary/50">
              <Phases />
              <span>{output.data}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="space-y-1">
              <Button
                variant={output.data === CompilerPhase.Tokenize ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect(CompilerPhase.Tokenize)}
              >
                <span>Tokenize</span>
                <span className="text-xs text-muted-foreground">Lexical Analysis</span>
              </Button>
              <Button
                variant={output.data === CompilerPhase.Parse ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect(CompilerPhase.Parse)}
              >
                <span>Parse</span>
                <span className="text-xs text-muted-foreground">Syntax Analysis</span>
              </Button>
              <Button
                variant={output.data === CompilerPhase.Typecheck ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect(CompilerPhase.Typecheck)}
              >
                <span>Typecheck</span>
                <span className="text-xs text-muted-foreground">Semantic Analysis</span>
              </Button>
              <Button
                variant={output.data === CompilerPhase.IrGeneration ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect(CompilerPhase.IrGeneration)}
              >
                <span>IR Generation</span>
                <span className="text-xs text-muted-foreground">intermediate represenation</span>
              </Button>
              <Button
                variant={output.data === CompilerPhase.IrOptimization ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect(CompilerPhase.IrOptimization)}
              >
                <span>IR Optimization</span>
                <span className="text-xs text-muted-foreground">Optimize the IR Code</span>
              </Button>
              <Button
                variant={output.data === CompilerPhase.Compile ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect(CompilerPhase.Compile)}
              >
                <span>Compile</span>
                <span className="text-xs text-muted-foreground">Get Executable</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <TitleBarAction />
    </nav>
  );
};
