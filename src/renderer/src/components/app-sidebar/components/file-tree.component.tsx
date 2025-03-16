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
import { HnExpressionNode, HnNode } from "@shared/types";
import { ChevronRight, Folder } from "lucide-react";
import { FileTextIcon } from "@radix-ui/react-icons";
import { OpenFileResponse } from "@shared/channels/file-system";

export const FileTree = ({ item }: { item: HnExpressionNode }) => {
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

  async function handleOpenFile() {
    const response = (await window.fs.openFileByPath({ path: file.path })) as OpenFileResponse;

    if (response === null || !response.content) {
      return;
    }

    onOpenFile(file.name, file.path, response.content);
  }

  return (
    <SidebarMenuButton className="data-[active=true]:bg-transparent" onClick={handleOpenFile}>
      <FileTextIcon className="text-primary" />
      {file.name}
    </SidebarMenuButton>
  );
};
