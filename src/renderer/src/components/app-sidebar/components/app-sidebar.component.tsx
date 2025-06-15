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
import { CollapseAll, NewFile, NewFolder, RefreshTree } from "@renderer/assets/icons";
import { useCurrentProjectStore } from "@renderer/stores/current-project.store";

import { useState } from "react";
import { CreateFileDialog } from "@renderer/components/create-file";
import { CreateFolderDialog } from "@renderer/components/create-folder-dialog";

export const AppSidebar = ({ fileTree, ...props }: AppSidebarProps) => {
  const { onOpenProject } = useCurrentProject();
  const { currentFolder, onSetCurrentFolder, rootPath } = useCurrentProjectStore();
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

  const [collapseAll, setCollapseAll] = useState<"open" | "closed">("open");

  async function handleOpenProject() {
    const res = await window.fs.openFolder();

    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
    }

    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
  }

  async function handleNewFile() {
    if (!currentFolder) return;
    setIsNewFileDialogOpen(true);
  }

  async function handleNewFolder() {
    if (!currentFolder) return;
    setIsNewFolderDialogOpen(true);
  }

  async function handleRefreshTree() {
    if (!rootPath) return;
    try {
      const { tree } = await window.fs.updateTree({ path: rootPath });
      useCurrentProjectStore.setState({ fileTree: tree });
      console.log("tree refreshed");
    } catch (error) {
      console.error("Failed to refresh tree:", error);
      alert("Failed to refresh file tree. Please try again.");
    }
  }

  const handleFolderClick = (path: string) => {
    const name = path.split("/").pop() || "";
    onSetCurrentFolder(name, path);
  };

  // const handleCreateFile = async (fileName: string, content: string) => {
  //   try {
  //     await onCreateFile(fileName, content);
  //     onSetCurrentFolder(fileName, currentFolder!.path);
  //   } catch (error) {
  //     console.error("Failed to create file:", error);
  //     alert("Failed to create file. Please try again.");
  //   }
  // };

  return (
    <>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleRefreshTree}
                    disabled={!rootPath}
                  >
                    <RefreshTree className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setCollapseAll("closed");
                    }}
                    disabled={!rootPath}
                  >
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
                    collapseAll={collapseAll}
                    setCollapseAll={setCollapseAll}
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

      <CreateFileDialog isOpen={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen} />
      <CreateFolderDialog isOpen={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen} />
    </>
  );
};
