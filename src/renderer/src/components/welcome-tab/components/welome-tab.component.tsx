import { NewFile, OpenFile, OpenFolder } from "@renderer/assets/icons";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { TabsContent } from "@renderer/components/ui/tabs";
import { cn } from "@renderer/lib/utils";
import { useCurrentProjectStore } from "@renderer/stores/current-project.store";
import { useRecentFoldersStore } from "@renderer/stores/recent-folder.strore";
import { useState } from "react";

interface WelcomeTabProps {
  value: string;
  className?: string;
}

export const WelcomeTab = ({ value, className }: WelcomeTabProps) => {
  const { currentFolder, onSetCurrentFolder, onCreateFile, onOpenFile, onOpenProject } =
    useCurrentProjectStore();

  const { recentFolders } = useRecentFoldersStore();

  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  async function handleNewFile() {
    if (!currentFolder) return;
    setIsNewFileDialogOpen(true);
  }

  async function handleCreateNewFile() {
    if (!newFileName.trim()) return;

    try {
      await onCreateFile(newFileName);
      setNewFileName("");
      setIsNewFileDialogOpen(false);
      onSetCurrentFolder(newFileName, currentFolder!.path);
    } catch (error) {
      console.error("Failed to create file:", error);
      alert("Failed to create file. Please try again.");
    }
  }

  async function handleOpenFile() {
    const res = await window.fs.openFile();

    if (res == null) {
      alert("Oops, cant open this file, please try again.");
      return;
    }

    const fileName = res.path.split(/[\\/]/).pop() ?? res.path;
    onOpenFile(fileName, res.path, res.content!);
  }

  async function handleOpenProject() {
    const res = await window.fs.openFolder();

    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
      return;
    }

    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
  }

  return (
    <TabsContent value={value} className={cn("flex h-full w-full flex-grow", className)}>
      <div className="flex h-full w-full flex-col items-center justify-start p-2">
        <div className="flex flex-col items-start justify-center">
          <p className="mb-2 text-lg font-bold">Start building your project</p>
          <div className="mb-8 ml-3 flex flex-col items-center justify-center text-primary">
            <Button
              variant="ghost"
              size="icon"
              className="w-full justify-start"
              onClick={handleNewFile}
            >
              <NewFile className="h-4 w-4" /> New File
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full justify-start"
              onClick={handleOpenFile}
            >
              <OpenFile className="h-4 w-4" /> Open File
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full justify-start"
              onClick={handleOpenProject}
            >
              <OpenFolder className="h-4 w-4" /> Open Folder
            </Button>
          </div>
          <p className="mb-2 text-lg font-bold">Recent Projects</p>
          <div className="mt-2 flex flex-col gap-2">
            {recentFolders.length > 0 ? (
              recentFolders.map((folder) => (
                <div className="ml-3" key={folder.path}>
                  <span
                    className="mr-2 cursor-pointer text-primary"
                    onClick={() => handleOpenProject()}
                  >
                    {folder.name}
                  </span>
                  <span className="truncate text-sm text-gray-500">{folder.path}</span>
                </div>
              ))
            ) : (
              <p className="text-md text-gray-500">No recent projects</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter file name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateNewFile();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewFile} disabled={!newFileName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
};
