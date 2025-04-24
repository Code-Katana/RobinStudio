import { DraggableTab } from "@renderer/components/draggable-tabs";
import { TabsList } from "@renderer/components/ui/tabs";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useFileWatcher } from "@renderer/hooks/use-file-watcher";
import { DndProvider } from "react-dnd/dist";
import { HTML5Backend } from "react-dnd-html5-backend";

export const TabsBar = () => {
  const { openedFiles, onOpenFile, onCloseFile, moveTab } = useCurrentProject();
  const fileStatuses = useFileWatcher();

  const handleMoveTab = (dragIndex: number, hoverIndex: number) => {
    moveTab(dragIndex, hoverIndex);
  };

  function getFileIndicator(path: string): React.ReactNode | null {
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
    <DndProvider backend={HTML5Backend}>
      <TabsList className="flex justify-start w-full p-0 overflow-auto rounded-none h-fit bg-secondary text-secondary-foreground">
        {[...openedFiles.values()].map((file, index) => (
          <DraggableTab
            key={file.path}
            file={file}
            index={index}
            value={file.path}
            fileIndicator={getFileIndicator(file.path)}
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
