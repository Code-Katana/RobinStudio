import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { OpenFileType } from "@renderer/providers/current-project.provider";
import { MouseEvent } from "react";
import { useFileWatcher } from "@renderer/hooks/use-file-watcher";

export const TabsBar = () => {
  const { openedFiles, onOpenFile, onCloseFile } = useCurrentProject();
  const fileStatuses = useFileWatcher();

  function handleOpenTab(file: OpenFileType) {
    onOpenFile(file.name, file.path, file.content);
  }

  function handleCloseTab(e: MouseEvent, file: OpenFileType) {
    e.stopPropagation();
    onCloseFile(file.path);
  }

  function getFileIndicator(path: string) {
    const statusMap: Record<string, { label: string; color: string }> = {
      change: { label: "M", color: "text-yellow-500" },
      remove: { label: "D", color: "text-red-500" },
      add: { label: "+", color: "text-green-500" },
    };

    const status = fileStatuses[path];
    return status ? (
      <span className={`${statusMap[status]?.color}`}>{statusMap[status]?.label}</span>
    ) : null;
  }

  return (
    <TabsList className="flex h-fit w-full justify-start overflow-auto rounded-none bg-secondary p-0 text-secondary-foreground">
      {[...openedFiles.values()].map((file: OpenFileType) => {
        const fileIndicator = getFileIndicator(file.path);
        return (
          <TabsTrigger
            key={file.path}
            value={file.path}
            className="flex gap-1 rounded-none border-r p-2 hover:bg-primary/50"
            onClick={() => handleOpenTab(file)}
          >
            <span className="text-primary">
              <FileTextIcon />
            </span>
            <span className={`flex items-center gap-1 ${fileIndicator?.props.className}`}>
              {file.name} {fileIndicator}
            </span>
            <span>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 p-1 hover:bg-primary-foreground/10"
                onClick={(e) => handleCloseTab(e, file)}
              >
                <Cross2Icon />
              </Button>
            </span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};
