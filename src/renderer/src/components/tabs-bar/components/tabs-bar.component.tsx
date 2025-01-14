import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { OpenFileType } from "@renderer/providers/current-project.provider";
import { MouseEvent } from "react";

export const TabsBar = () => {
  const { openedFiles, onOpenFile, onCloseFile } = useCurrentProject();

  function handleOpenTab(file: OpenFileType) {
    onOpenFile(file.name, file.path, file.content);
  }

  function handleCloseTab(e: MouseEvent, file: OpenFileType) {
    e.stopPropagation();
    onCloseFile(file.path);
  }

  return (
    <TabsList className="flex h-fit w-full justify-start overflow-auto rounded-none bg-secondary p-0 text-secondary-foreground">
      {[...openedFiles].map((file: OpenFileType) => (
        <TabsTrigger
          key={file.path}
          value={file.path}
          className="flex gap-1 rounded-none border-r p-2 hover:bg-primary/50"
          onClick={() => handleOpenTab(file)}
        >
          <span className="text-primary">
            <FileTextIcon />
          </span>
          <span>{file.name}</span>
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
      ))}
    </TabsList>
  );
};
