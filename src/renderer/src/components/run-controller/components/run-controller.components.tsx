import { Button } from "@renderer/components/ui/button";
import { CompilerPhase } from "@renderer/types";
import { Run } from "@renderer/assets/icons";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@renderer/components/ui/select";
import { useRunController } from "../hooks/use-run-controller.hook";

export const RunController: React.FC = () => {
  const { projectName, currentFile } = useCurrentProject();
  const controller = useRunController();

  if (!projectName) {
    return <></>;
  }

  return (
    <div className="m-2 flex gap-[2px] overflow-hidden rounded-lg border">
      <Button
        className="flex rounded-none border-none bg-secondary/50"
        onClick={controller.takeAction}
        disabled={!currentFile}
      >
        <Run />
        <span>Run</span>
      </Button>
      <Select value={controller.current} onValueChange={controller.onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a phase" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Phases</SelectLabel>
            <SelectItem value={CompilerPhase.Tokenize}>Tokenize</SelectItem>
            <SelectItem value={CompilerPhase.Parse}>Parse</SelectItem>
            <SelectItem value={CompilerPhase.Typecheck}>Type Check</SelectItem>
            <SelectItem value={CompilerPhase.IrGeneration}>IR Generation</SelectItem>
            <SelectItem value={CompilerPhase.IrOptimization}>Code Optimization</SelectItem>
            <SelectItem value={CompilerPhase.Compile}>Compile</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
