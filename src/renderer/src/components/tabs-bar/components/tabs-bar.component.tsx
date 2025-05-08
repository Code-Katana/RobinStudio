import { DraggableTab } from "@renderer/components/draggable-tabs";
import { TabsList } from "@renderer/components/ui/tabs";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useFileWatcher } from "@renderer/hooks/use-file-watcher";

export const TabsBar = () => {
  const { openedFiles, onOpenFile, onCloseFile, moveTab } = useCurrentProject();
  const fileStatuses = useFileWatcher();

  const handleMoveTab = (dragIndex: number, hoverIndex: number) => {
    moveTab(dragIndex, hoverIndex);
  };

  function getFileIndicator(path: string): JSX.Element | null {
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
    <TabsList className="mb-2 flex h-fit w-full justify-start overflow-auto rounded-none border-b-2 border-background bg-secondary px-0 py-1 text-secondary-foreground">
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
  );
};
