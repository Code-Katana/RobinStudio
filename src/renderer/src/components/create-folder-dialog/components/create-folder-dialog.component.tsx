import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { useCurrentProjectStore } from "@renderer/stores/current-project.store";
import { useState } from "react";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFolderDialog = ({ isOpen, onOpenChange }: CreateFolderDialogProps) => {
  const { currentFolder, onSetCurrentFolder, onCreateFolder } = useCurrentProjectStore();

  const [newFolderName, setNewFolderName] = useState("");

  async function handleCreateNewFolder() {
    if (!newFolderName.trim()) return;
    console.log("newFolderName", newFolderName);
    console.log("currentFolder", currentFolder);
    const newFolderPath = window.fs.resolvePath(currentFolder!.path, newFolderName);

    try {
      await onCreateFolder(newFolderName);
      setNewFolderName("");
      onOpenChange(false);
      onSetCurrentFolder(newFolderName, newFolderPath);
    } catch (error) {
      console.error("Failed to create folder:", error);
      alert("Failed to create folder. Please try again.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateNewFolder} disabled={!newFolderName.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
