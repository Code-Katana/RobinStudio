import { useState } from "react";
import { FileTextIcon } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@renderer/components/ui/dialog";
import { cn } from "@renderer/lib/utils";
import { useCurrentProjectStore } from "@renderer/stores/current-project.store";

interface CreateFileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFileDialog = ({ isOpen, onOpenChange }: CreateFileDialogProps) => {
  const { onCreateFile } = useCurrentProjectStore();

  const [newFileName, setNewFileName] = useState("");
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

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;

    try {
      if (!newFileName.endsWith(".rbn")) {
        alert("File must end with .rbn extension.");
        onOpenChange(false);
        return;
      }
      const content = getFileContent(selectedFileType);
      await onCreateFile(newFileName, content);
      setNewFileName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create file:", error);
      alert("Failed to create file. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="border-b border-border pb-4">Create New File</DialogTitle>
          <DialogDescription>
            Choose a file type and enter a name for your new file. The file must end with .rbn
            extension.
          </DialogDescription>
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
                handleCreateFile();
              }
            }}
          />
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFile} disabled={!newFileName.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
