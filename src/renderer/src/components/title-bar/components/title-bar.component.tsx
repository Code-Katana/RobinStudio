import { cn } from "@renderer/lib/utils";
import RobinLogo from "@renderer/assets/images/rbnLogo.jpg";
import { Separator } from "@renderer/assets/icons";
import { FileFinder } from "@renderer/components/file-finder";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { FileOperations } from "@renderer/components/file-operation";
import { TitleBarAction } from "./title-bar-action.component";
import { RunController } from "@renderer/components/run-controller";

export const TitleBar: React.FC = () => {
  const { projectName } = useCurrentProject();

  const iconSize = "w-5 h-5";

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

      <RunController />

      <TitleBarAction />
    </nav>
  );
};
