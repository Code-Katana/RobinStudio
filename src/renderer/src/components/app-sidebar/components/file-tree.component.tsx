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
import { Folder } from "lucide-react";
import { FileTextIcon } from "@radix-ui/react-icons";
import { OpenFileResponse } from "@shared/channels/file-system";
import { useRef, useState } from "react";
import { Arrow } from "@renderer/assets/icons";
import { cn } from "@renderer/lib/utils";

interface FileTreeProps {
  item: HnExpressionNode;
  currentFolder?: string | null;
  onFolderClick?: (path: string) => void;
}

export const FileTree = ({ item, currentFolder, onFolderClick }: FileTreeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [node, children] = item;
  const { name, path } = node;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    onFolderClick?.(path);
  };

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=closed]>button>div>div>svg:first-child]:-rotate-90 [&[data-state=open]>button>div>div>svg:first-child]:rotate-0">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full" onClick={handleClick}>
            <div className="flex w-full items-center justify-between">
              <div className="flex cursor-pointer items-center gap-1">
                <Arrow
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(isOpen ? "rotate-0" : "-rotate-90", "h-5 w-5 transition-transform")}
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
  const ref = useRef<HTMLSpanElement>(null);

  async function handleOpenFile() {
    const response = (await window.fs.openFileByPath({ path: file.path })) as OpenFileResponse;

    if (response === null || !response.content) {
      return;
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
