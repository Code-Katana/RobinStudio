import { Button } from "@renderer/components/ui/button";
import { Checkbox } from "@renderer/components/ui/checkbox";
import { PopoverContent, Popover, PopoverTrigger } from "@renderer/components/ui/popover";
import { Arrow } from "@renderer/assets/icons";
import { RecentFilesMenu } from "./recent-file-menu";
import { useRecentFilesStore } from "@renderer/stores/recent-files.store";

interface FileOperationsMenuProps {
  onOpenFile: () => Promise<void>;
  onOpenProject: () => Promise<void>;
  onOpenRecentFile: (path: string) => Promise<void>;
  onSaveFile: () => Promise<void>;
  onSaveAll: () => Promise<void>;
  onCloseEditor: () => void;
  onCloseFolder: () => void;
  onCloseAllWindows: () => void;
  autoSave: boolean;
  onAutoSaveChange: (checked: boolean) => void;
  recentFiles: Array<{ path: string; lastOpened: Date }>;
  isRecentOpen: boolean;
  onRecentOpenChange: (open: boolean) => void;
}

export const FileOperationsMenu = ({
  onOpenFile,
  onOpenProject,
  onOpenRecentFile,
  onSaveFile,
  onSaveAll,
  onCloseEditor,
  onCloseFolder,
  onCloseAllWindows,
  autoSave,
  onAutoSaveChange,
  isRecentOpen,
  onRecentOpenChange,
}: FileOperationsMenuProps) => {
  const { recentFiles } = useRecentFilesStore();

  return (
    <PopoverContent className="w-64 rounded-md border bg-background p-2 shadow-md">
      <section className="border-b pb-1">
        <Button variant="ghost" className="w-full justify-start" onClick={onOpenFile}>
          Open File
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={onOpenProject}>
          Open Folder
        </Button>
        <Popover open={isRecentOpen} onOpenChange={onRecentOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              Open Recent
              <Arrow className="h-4 w-4 -rotate-90" />
            </Button>
          </PopoverTrigger>
          <RecentFilesMenu onOpenRecentFile={onOpenRecentFile} recentFiles={recentFiles} />
        </Popover>
      </section>
      <section className="border-b pb-1 pt-1">
        <Button variant="ghost" className="w-full justify-between" onClick={onSaveFile}>
          Save
          <span className="text-xs text-muted-foreground">Ctrl + S</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={onSaveAll}>
          Save All
        </Button>
        <div className="flex items-center justify-between px-4 py-2">
          <label htmlFor="auto-save" className="text-sm font-medium">
            Auto Save
          </label>
          <Checkbox
            id="auto-save"
            checked={autoSave}
            onCheckedChange={(checked) => onAutoSaveChange(checked as boolean)}
          />
        </div>
      </section>
      <section className="border-b pb-1 pt-1">
        <Button variant="ghost" className="w-full justify-between" onClick={onCloseEditor}>
          Close Editor
          <span className="text-xs text-muted-foreground">Ctrl + W</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between" onClick={onCloseFolder}>
          Close Folder
          <span className="text-xs text-muted-foreground">Ctrl + N + K</span>
        </Button>
      </section>
      <section className="pt-1">
        <Button variant="ghost" className="w-full justify-between" onClick={onCloseAllWindows}>
          Close All Windows
          <span className="text-xs text-muted-foreground">Alt + F4</span>
        </Button>
      </section>
    </PopoverContent>
  );
};
