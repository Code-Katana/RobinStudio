import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@renderer/components/ui/sidebar";

import { FileTree } from "./file-tree.component";
import { AppSidebarProps } from "../types/app-sidebar.props";
import { Button } from "@renderer/components/ui/button";
import { useCurrentProject } from "@renderer/hooks/use-current-project";

export const AppSidebar = ({ rootPath, fileTree, ...props }: AppSidebarProps) => {
  const { onOpenProject } = useCurrentProject();

  async function handleOpenProject() {
    const res = await window.fs.openFolder();

    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
    }

    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
  }

  return (
    <Sidebar {...props}>
      {fileTree ? (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <FileTree item={fileTree} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      ) : (
        <SidebarContent className="flex flex-col items-center justify-center h-full p-3 space-y-4">
          <p className="text-sm text-gray-600">
            You didn&apos;t open a folder yet. Please open one.
          </p>
          <Button className="w-full max-w-xs" onClick={handleOpenProject}>
            Open
          </Button>
        </SidebarContent>
      )}
      <SidebarRail />
    </Sidebar>
  );
};
