import { Button } from "@renderer/components/ui/button";
import { PopoverContent } from "@renderer/components/ui/popover";

interface RecentFile {
  path: string;
  lastOpened: number;
}

interface RecentFilesMenuProps {
  recentFiles: RecentFile[];
  onOpenRecentFile: (path: string) => Promise<void>;
}

export const RecentFilesMenu = ({ onOpenRecentFile, recentFiles }: RecentFilesMenuProps) => {
  return (
    <PopoverContent
      className="ml-1.5 w-96 rounded-md border bg-background p-2 shadow-md"
      side="right"
      align="start"
      sideOffset={5}
    >
      <div className="space-y-2">
        {recentFiles.length > 0 ? (
          recentFiles.map((file) => (
            <Button
              key={file.path}
              variant="ghost"
              className="h-auto w-full flex-col items-start justify-start py-2"
              onClick={() => onOpenRecentFile(file.path)}
            >
              <div className="w-full truncate text-left text-xs text-muted-foreground">
                {file.path}
              </div>
            </Button>
          ))
        ) : (
          <div className="px-2 py-1 text-sm text-muted-foreground">No recent files</div>
        )}
      </div>
    </PopoverContent>
  );
};
