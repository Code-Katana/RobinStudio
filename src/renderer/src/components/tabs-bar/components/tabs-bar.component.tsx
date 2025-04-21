import { DraggableTab } from "@renderer/components/draggable-tabs";
import { TabsList } from "@renderer/components/ui/tabs";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { DndProvider } from "react-dnd/dist";
import { HTML5Backend } from "react-dnd-html5-backend";

export const TabsBar = () => {
  const { openedFiles, onOpenFile, onCloseFile, moveTab } = useCurrentProject();

  const handleMoveTab = (dragIndex: number, hoverIndex: number) => {
    moveTab(dragIndex, hoverIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <TabsList className="flex h-fit w-full justify-start overflow-auto rounded-none bg-secondary p-0 text-secondary-foreground">
        {[...openedFiles.values()].map((file: OpenFileType) => (
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
      </TabsList> */}

      <TabsList className="flex h-fit w-full justify-start overflow-auto rounded-none bg-secondary p-0 text-secondary-foreground">
        {[...openedFiles.values()].map((file, index) => (
          <DraggableTab
            key={file.path}
            file={file}
            index={index}
            value={file.path}
            onClick={() => onOpenFile(file.name, file.path, file.content)}
            onClose={(e) => {
              e.stopPropagation();
              onCloseFile(file.path);
            }}
            onMoveTab={handleMoveTab}
          />
        ))}
      </TabsList>
    </DndProvider>
  );
};
