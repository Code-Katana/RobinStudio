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
import { ChevronRight, Folder } from "lucide-react";
import { FileTextIcon } from "@radix-ui/react-icons";
import { OpenFileResponse } from "@shared/channels/file-system";
import { useRef } from "react";

interface FileTreeProps {
  item: HnExpressionNode;
}

export const FileTree = ({ item }: FileTreeProps) => {
  const [node, children] = item;
  const { name } = node;

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder className="text-amber-400" />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <SidebarMenuSub>
            {children?.map((subItem, index) =>
              Array.isArray(subItem) ? (
                <FileTree key={index} item={subItem} />
              ) : (
                <FileNode key={index} file={subItem as HnNode} />
              ),
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

const FileNode = ({ file }: { file: HnNode }) => {
  const { onOpenFile } = useCurrentProject();
  const fileStatuses = useFileWatcher();
  const ref = useRef<HTMLSpanElement>(null);

  async function handleOpenFile() {
    const response = (await window.fs.openFileByPath({ path: file.path })) as OpenFileResponse;

    if (response === null || !response.content) {
      return;
    }

    onOpenFile(file.name, file.path, response.content);
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

  // useEffect(() => {
  //   if (!ref.current) return;

  //   const el = ref.current;
  //   const char = +window.getComputedStyle(el).fontSize.slice(0, -2);
  //   const width = +getComputedStyle(el).width.slice(0, -2);
  //   const text = el.textContent ?? "";
  //   const charCount = text.length;
  //   const textSize = charCount * char;
  //   if (textSize > width) {
  //     const newCharCount = Math.floor(width / char);
  //     el.innerText = text.slice(0, newCharCount) + "...";
  //   }
  // }, [ref]);

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
