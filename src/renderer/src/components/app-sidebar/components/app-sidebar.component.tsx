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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { useState } from "react";
import { FileTextIcon } from "lucide-react";
import { cn } from "@renderer/lib/utils";

export const AppSidebar = ({ fileTree, ...props }: AppSidebarProps) => {
  const { onOpenProject } = useCurrentProject();
  const { currentFolder, onSetCurrentFolder, onCreateFile, onCreateFolder, rootPath } =
    useCurrentProjectStore();
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [collapseAll, setCollapseAll] = useState<"open" | "closed">("open");
  const [selectedFileType, setSelectedFileType] = useState<"empty" | "binary-search">("empty");

  const getFileContent = (type: "empty" | "binary-search") => {
    switch (type) {
      case "binary-search":
        return `func integer binary_search has
  var arr: [integer];
  var target: integer;
begin
  var x : integer = -1;
  for i=0;i<#arr; ++i do
    if arr[i] == target then
      x =i;
    end if
  end for
  return x;
end func

program binarySearch is
begin
  var arr: [integer] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  write binary_search(arr, 7);
end`;
      case "empty":
      default:
        return "";
    }
  };

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

  async function handleCreateNewFile() {
    if (!newFileName.trim()) return;

    try {
      if (!newFileName.endsWith(".rbn")) {
        alert("File must end with .rbn extension.");
        setIsNewFileDialogOpen(false);
        return;
      }
      const content = getFileContent(selectedFileType);
      await onCreateFile(newFileName, content);
      setNewFileName("");
      setIsNewFileDialogOpen(false);
      onSetCurrentFolder(newFileName, currentFolder!.path);
    } catch (error) {
      console.error("Failed to create file:", error);
      alert("Failed to create file. Please try again.");
    }
  }

  async function handleNewFolder() {
    if (!currentFolder) return;
    setIsNewFolderDialogOpen(true);
  }

  async function handleCreateNewFolder() {
    if (!newFolderName.trim()) return;
    console.log("newFolderName", newFolderName);
    console.log("currentFolder", currentFolder);
    const newFolderPath = window.fs.resolvePath(currentFolder!.path, newFolderName);

    try {
      await onCreateFolder(newFolderName);
      setNewFolderName("");
      setIsNewFolderDialogOpen(false);
      onSetCurrentFolder(newFolderName, newFolderPath);
    } catch (error) {
      console.error("Failed to create folder:", error);
      alert("Failed to create folder. Please try again.");
    }
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

      <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
        <DialogContent className="min-w-fit">
          <DialogHeader>
            <DialogTitle className="border-b border-border pb-4">Create New File</DialogTitle>
          </DialogHeader>

          <div className="my-3 flex flex-col items-start gap-1">
            <Button
              variant={"ghost"}
              className={cn(
                "flex w-full items-center justify-start gap-1.5",
                selectedFileType === "empty" && "bg-accent text-accent-foreground",
              )}
              onClick={() => setSelectedFileType("empty")}
            >
              <FileTextIcon className="text-primary" /> Empty File
              <span className="text-sm text-muted-foreground">
                - Create a new file with no content.
              </span>
            </Button>
            <Button
              variant={"ghost"}
              className={cn(
                "flex w-full items-center justify-start gap-1.5",
                selectedFileType === "binary-search" && "bg-accent text-accent-foreground",
              )}
              onClick={() => setSelectedFileType("binary-search")}
            >
              <FileTextIcon className="text-primary" /> Binary Search
              <span className="text-sm text-muted-foreground">
                - Create a new file with a binary search algorithm.
              </span>
            </Button>
          </div>
          <DialogFooter className="flex items-center justify-between gap-2">
            <Input
              placeholder="Enter file name"
              className="px-2"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateNewFile();
                }
              }}
            />
            <Button variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewFile} disabled={!newFileName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateNewFolder();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewFolder} disabled={!newFolderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
