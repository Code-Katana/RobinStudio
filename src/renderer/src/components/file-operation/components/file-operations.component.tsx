import { Arrow } from "@renderer/assets/icons";
import { Button } from "@renderer/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useState } from "react";

export const FileOperations = () => {
  const { onOpenProject } = useCurrentProject();
  const [open, setOpen] = useState(false);

  async function handleOpenProject() {
    const res = await window.fs.openFolder();

    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
      return;
    }

    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Arrow className="h-5 w-5 cursor-pointer transition-transform duration-300" />
      </PopoverTrigger>
      <PopoverContent className="w-48 rounded-md border bg-background p-2 shadow-md">
        <Button variant="ghost" className="w-full justify-start">
          New File
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={handleOpenProject}>
          Open Folder
        </Button>
      </PopoverContent>
    </Popover>
  );
};
