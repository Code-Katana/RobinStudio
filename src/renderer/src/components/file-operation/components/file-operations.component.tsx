import { Arrow } from "@renderer/assets/icons";
import { Popover, PopoverTrigger } from "@renderer/components/ui/popover";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useFileOperationsStore } from "@renderer/stores/file-operations.store";
import { useAutoSave } from "@renderer/hooks/use-auto-save";
import { FileOperationsMenu } from "./file-operations-menu";

export const FileOperations = () => {
  const { onOpenProject, onOpenFile, currentFile, openedFiles, onCloseFile, onCloseProject } =
    useCurrentProject();
  const { autoSave, setAutoSave, setLastSavedContent } = useAutoSave();
  const {
    isMenuOpen,
    setMenuOpen,
    isRecentMenuOpen,
    setRecentMenuOpen,
    handleOpenFile,
    handleOpenProject,
    handleSaveFile,
    handleSaveAll,
    handleCloseEditor,
    handleCloseFolder,
    handleCloseAllWindows,
  } = useFileOperationsStore();

  return (
    <Popover open={isMenuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger>
        <Arrow className="h-5 w-5 cursor-pointer transition-transform duration-300" />
      </PopoverTrigger>
      <FileOperationsMenu
        onOpenFile={() => handleOpenFile(onOpenFile)}
        onOpenProject={() => handleOpenProject(onOpenProject)}
        onOpenRecentFile={async (path) => {
          try {
            const File = await window.fs.openFileByPath({ path });
            if (File === null || !File.content) {
              return;
            }
            const fileName = path.split(/[\\/]/).pop() ?? path;
            onOpenFile(fileName, path, File.content);
            setRecentMenuOpen(false);
            setMenuOpen(false);
          } catch (error) {
            alert("Failed to open recent file. The file might have been moved or deleted.");
          }
        }}
        onSaveFile={async () => {
          await handleSaveFile(currentFile ?? null);
          if (currentFile) {
            setLastSavedContent(currentFile.content);
          }
        }}
        onSaveAll={async () => {
          await handleSaveAll(openedFiles);
          if (currentFile) {
            setLastSavedContent(currentFile.content);
          }
        }}
        onCloseEditor={() => handleCloseEditor(currentFile ?? null, onCloseFile)}
        onCloseFolder={() => handleCloseFolder(onCloseProject)}
        onCloseAllWindows={handleCloseAllWindows}
        autoSave={autoSave}
        onAutoSaveChange={setAutoSave}
        isRecentOpen={isRecentMenuOpen}
        onRecentOpenChange={setRecentMenuOpen}
      />
    </Popover>
  );
};
