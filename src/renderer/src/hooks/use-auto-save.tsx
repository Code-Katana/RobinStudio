import { useEffect, useState } from "react";
import { useCurrentProject } from "./use-current-project";

export const useAutoSave = () => {
  const { currentFile } = useCurrentProject();

  const [autoSave, setAutoSave] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null);

  function handleAutoSaveDebounced(saveFile: () => Promise<boolean>) {
    const timeoutId = setTimeout(saveFile, 1000);
    return () => clearTimeout(timeoutId);
  }

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

  useEffect(() => {
    if (currentFile) {
      setLastSavedContent(currentFile.content);
    }
  }, [currentFile?.path]);

  return {
    autoSave,
    setAutoSave,
    lastSavedContent,
    setLastSavedContent,
  };
};
