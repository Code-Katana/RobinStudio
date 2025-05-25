import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@renderer/components/ui/sidebar";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useFileWatcher } from "@renderer/hooks/use-file-watcher";
import { HnExpressionNode, HnNode } from "@shared/types";
import { Folder, Plus, Trash2, FileText } from "lucide-react";
import { FileTextIcon } from "@radix-ui/react-icons";
import { OpenFileResponse } from "@shared/channels/file-system";
import { useState, useEffect } from "react";
import { Arrow, Delete, NewFile, NewFolder } from "@renderer/assets/icons";

import { cn } from "@renderer/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@renderer/components/ui/context-menu";

interface FileTreeProps {
  item: HnExpressionNode;
  currentFolder?: string | null;
  onFolderClick?: (path: string) => void;
  collapseAll?: "open" | "closed" | null;
  setCollapseAll?: (collapseAll: "open" | "closed") => void;
}

export const FileTree = ({
  item,
  currentFolder,
  onFolderClick,
  collapseAll,
  setCollapseAll,
}: FileTreeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [node, children] = item;
  const { name, path } = node;

  useEffect(() => {
    if (collapseAll === "closed") {
      setIsOpen(false);
    }
  }, [collapseAll]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFolderClick?.(path);
    setIsOpen(!isOpen);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggle(e);
    onFolderClick?.(path);
    setCollapseAll?.("open");
  };

  const handleNewFile = async () => {
    // TODO: Implement new file creation
    console.log("Create new file in:", path);
  };

  const handleNewFolder = async () => {
    // TODO: Implement new folder creation
    console.log("Create new folder in:", path);
  };

  const handleDelete = async () => {
    // TODO: Implement folder deletion
    console.log("Delete folder:", path);
  };

  return (
    <SidebarMenuItem>
      <ContextMenu>
        <ContextMenuTrigger>
          <Collapsible open={isOpen} className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full" onClick={handleClick}>
                <div className="flex w-full items-center justify-between">
                  <div className="flex cursor-pointer items-center gap-1">
                    <Arrow
                      onClick={handleToggle}
                      className={cn(
                        isOpen ? "rotate-0" : "-rotate-90",
                        "h-5 w-5 transition-transform",
                      )}
                    />
                    <Folder
                      className={cn(
                        "h-5 w-5",
                        currentFolder === path ? "text-primary" : "text-amber-400",
                      )}
                    />
                    <span className={cn("truncate", currentFolder === path && "text-primary")}>
                      {name}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <SidebarMenuSub>
                {children?.map((subItem, index) =>
                  Array.isArray(subItem) ? (
                    <FileTree
                      key={index}
                      item={subItem}
                      currentFolder={currentFolder}
                      onFolderClick={onFolderClick}
                      collapseAll={collapseAll}
                    />
                  ) : (
                    <FileNode
                      key={index}
                      file={subItem as HnNode}
                      parentPath={path}
                      onFileClick={onFolderClick}
                    />
                  ),
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={handleNewFile}>
            <NewFile className="mr-2 h-4 w-4" />
            New File
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewFolder}>
            <NewFolder className="mr-2 h-4 w-4" />
            New Folder
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleDelete} className="text-destructive">
            <Delete className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </SidebarMenuItem>
  );
};

interface FileNodeProps {
  file: HnNode;
  parentPath: string;
  onFileClick?: (path: string) => void;
}

const FileNode = ({ file, parentPath, onFileClick }: FileNodeProps) => {
  const { onOpenFile } = useCurrentProject();
  const fileStatuses = useFileWatcher();

  async function handleOpenFile() {
    const response = (await window.fs.openFileByPath({ path: file.path })) as OpenFileResponse;

    if (response === null) {
      return;
    }
    if (!response.content) {
      response.content = "";
    }
    onOpenFile(file.name, file.path, response.content);
    onFileClick?.(parentPath);
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

  const fileIndicator = getFileIndicator(file.path);

  return (
    <SidebarMenuButton
      className="truncate data-[active=true]:bg-transparent"
      onClick={handleOpenFile}
    >
      <FileTextIcon className="shrink-0 text-primary" />
      <span className="flex min-w-0 items-center gap-1">
        <span className="truncate">{file.name}</span>
        {fileIndicator}
      </span>
    </SidebarMenuButton>
  );
};
