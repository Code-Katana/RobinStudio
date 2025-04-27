import { Arrow } from "@renderer/assets/icons";
import { Button } from "@renderer/components/ui/button";
import { Checkbox } from "@renderer/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useState } from "react";

export const FileOperations = () => {
  const { onOpenProject } = useCurrentProject();
  const [open, setOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [autoSave, setAutoSave] = useState(false);

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
      <PopoverContent className="w-64 rounded-md border bg-background p-2 shadow-md">
        <section className="border-b pb-1">
          <Button variant="ghost" className="w-full justify-start">
            Open File
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleOpenProject}>
            Open Folder
          </Button>
          <Popover open={recentOpen} onOpenChange={setRecentOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                Open Recent
                <Arrow className="h-4 w-4 -rotate-90" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="ml-1.5 w-48 rounded-md border bg-background p-2 shadow-md"
              side="right"
              align="start"
              sideOffset={5}
            >
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Recent File 1
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Recent File 2
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </section>
        <section className="border-b pb-1 pt-1">
          <Button variant="ghost" className="w-full justify-between">
            Save
            <span className="text-xs text-muted-foreground">Ctrl + S</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Save All
          </Button>
          <div className="flex items-center justify-between px-4 py-2">
            <label htmlFor="auto-save" className="text-sm font-medium">
              Auto Save
            </label>
            <Checkbox
              id="auto-save"
              checked={autoSave}
              onCheckedChange={(checked) => setAutoSave(checked as boolean)}
            />
          </div>
        </section>
        <section className="border-b pb-1 pt-1">
          <Button variant="ghost" className="w-full justify-between">
            Close Editor
            <span className="text-xs text-muted-foreground">Ctrl + F4</span>
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            Close Folder
            <span className="text-xs text-muted-foreground">Ctrl + F4</span>
          </Button>
        </section>
        <section className="pt-1">
          <Button variant="ghost" className="w-full justify-between">
            Close All Windows
            <span className="text-xs text-muted-foreground">Ctrl + F4</span>
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
};
