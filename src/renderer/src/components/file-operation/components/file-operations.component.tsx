import { Arrow } from "@renderer/assets/icons";
import { Button } from "@renderer/components/ui/button";
import { Checkbox } from "@renderer/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useRecentFilesStore } from "@renderer/stores/recent-files.store";
import { useState, useEffect } from "react";
// import { format } from "date-fns";

export const FileOperations = () => {
  const { onOpenProject, onOpenFile, currentFile, openedFiles, onCloseFile, onCloseProject } =
    useCurrentProject();
  const { recentFiles } = useRecentFilesStore();
  const [open, setOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null);

  useEffect(() => {
    if (!autoSave || !currentFile) return;

    if (currentFile.content !== lastSavedContent) {
      const saveFile = async () => {
        try {
          await window.fs.saveFile({
            path: currentFile.path,
            content: currentFile.content,
          });
          setLastSavedContent(currentFile.content);
          console.log(`Auto-saved: ${currentFile.name}`);
          return true;
        } catch (error) {
          console.error("Auto-save failed:", error);
          return false;
        }
      };

      handleAutoSaveDebounced(saveFile);
    }
  }, [currentFile?.content, autoSave, lastSavedContent]);

  function handleAutoSaveDebounced(saveFile: () => Promise<boolean>) {
    const timeoutId = setTimeout(saveFile, 1000);
    return () => clearTimeout(timeoutId);
  }

  useEffect(() => {
    if (currentFile) {
      setLastSavedContent(currentFile.content);
    }
  }, [currentFile?.path]);

  async function handleOpenProject() {
    const res = await window.fs.openFolder();

    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
      return;
    }

    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
    setOpen(false);
  }

  async function handleOpenFile() {
    const res = await window.fs.openFile();

    if (res == null) {
      alert("Oops, cant open this file, please try again.");
      return;
    }

    const fileName = res.path.split(/[\\/]/).pop() ?? res.path;
    onOpenFile(fileName, res.path, res.content!);
    setOpen(false);
  }

  async function handleOpenRecentFile(path: string) {
    try {
      const File = await window.fs.openFileByPath({ path });
      if (File === null || !File.content) {
        return;
      }
      const fileName = path.split(/[\\/]/).pop() ?? path;
      onOpenFile(fileName, path, File.content);
      setRecentOpen(false);
      setOpen(false);
    } catch (error) {
      alert("Failed to open recent file. The file might have been moved or deleted.");
    }
  }

  async function handleSaveFile() {
    if (!currentFile) {
      alert("No file is currently open.");
      return;
    }

    await window.fs.saveFile({
      path: currentFile.path,
      content: currentFile.content,
    });
    setLastSavedContent(currentFile.content);
    setOpen(false);
  }

  async function handleSaveAll() {
    if (openedFiles.size === 0) {
      alert("No files are currently open.");
      return;
    }

    await Promise.all(
      Array.from(openedFiles.values()).map((file) =>
        window.fs.saveFile({
          path: file.path,
          content: file.content,
        }),
      ),
    );
    setLastSavedContent(currentFile?.content ?? null);
    setOpen(false);
  }

  function handleCloseEditor() {
    if (currentFile) {
      onCloseFile(currentFile.path);
    }
    setOpen(false);
  }

  function handleCloseFolder() {
    onCloseProject();
    setOpen(false);
  }

  function handleCloseAllWindows() {
    window.electron.closeWindow();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Arrow className="h-5 w-5 cursor-pointer transition-transform duration-300" />
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-md border bg-background p-2 shadow-md">
        <section className="border-b pb-1">
          <Button variant="ghost" className="w-full justify-start" onClick={handleOpenFile}>
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
                      onClick={() => handleOpenRecentFile(file.path)}
                    >
                      <div className="w-full truncate text-left text-xs text-muted-foreground">
                        {file.path}
                      </div>
                      {/* <div className="text-xs text-muted-foreground">
                        Last opened: {format(new Date(file.lastOpened), "MMM d, yyyy HH:mm")}
                      </div> */}
                    </Button>
                  ))
                ) : (
                  <div className="px-2 py-1 text-sm text-muted-foreground">No recent files</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </section>
        <section className="border-b pb-1 pt-1">
          <Button variant="ghost" className="w-full justify-between" onClick={handleSaveFile}>
            Save
            <span className="text-xs text-muted-foreground">Ctrl + S</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleSaveAll}>
            Save All
          </Button>
          <div className="flex items-center justify-between px-4 py-2">
            <label htmlFor="auto-save" className="text-sm font-medium">
              Auto Save
            </label>
            <Checkbox
              id="auto-save"
              checked={autoSave}
              onCheckedChange={(checked) => {
                setAutoSave(checked as boolean);
                if (checked && currentFile) {
                  setLastSavedContent(currentFile.content);
                }
              }}
            />
          </div>
        </section>
        <section className="border-b pb-1 pt-1">
          <Button variant="ghost" className="w-full justify-between" onClick={handleCloseEditor}>
            Close Editor
            <span className="text-xs text-muted-foreground">Ctrl + W</span>
          </Button>
          <Button variant="ghost" className="w-full justify-between" onClick={handleCloseFolder}>
            Close Folder
            <span className="text-xs text-muted-foreground">Ctrl + N + K</span>
          </Button>
        </section>
        <section className="pt-1">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={handleCloseAllWindows}
          >
            Close All Windows
            <span className="text-xs text-muted-foreground">Alt + F4</span>
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
};
