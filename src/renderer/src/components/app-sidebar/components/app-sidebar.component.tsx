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
import { CollapseAll, NewFile, NewFolder } from "@renderer/assets/icons";
import { useCurrentProjectStore } from "@renderer/stores/current-project.store";

export const AppSidebar = ({ rootPath, fileTree, ...props }: AppSidebarProps) => {
  const { onOpenProject } = useCurrentProject();
  const { currentFolder, onSetCurrentFolder } = useCurrentProjectStore();

  async function handleOpenProject() {
    const res = await window.fs.openFolder();

    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
    }

    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
  }

  async function handleNewFile() {
    if (!currentFolder) return;
    // TODO: Implement new file creation
    console.log("Creating new file in:", currentFolder.path);
  }

  async function handleNewFolder() {
    if (!currentFolder) return;
    // TODO: Implement new folder creation
    console.log("Creating new folder in:", currentFolder.path);
  }

  const handleFolderClick = (path: string) => {
    const name = path.split("/").pop() || "";
    onSetCurrentFolder(name, path);
  };

  return (
    <Sidebar {...props}>
      {fileTree ? (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Files</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleNewFile}
                  disabled={!currentFolder}
                >
                  <NewFile className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleNewFolder}
                  disabled={!currentFolder}
                >
                  <NewFolder className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <CollapseAll className="h-4 w-4" />
                </Button>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <FileTree
                  item={fileTree}
                  currentFolder={currentFolder?.path}
                  onFolderClick={handleFolderClick}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      ) : (
        <SidebarContent className="flex h-full flex-col items-center justify-center space-y-4 p-3">
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
