import { useState, useEffect } from "react";
import { FileEvent } from "@shared/types"; // Import types

export const useFileWatcher = () => {
  const [fileStatuses, setFileStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    window.electronWatcher.onFileEvent((event: FileEvent) => {
      setFileStatuses((prev) => ({
        ...prev,
        [event.path]: event.type,
      }));
    });
  }, []);

  return fileStatuses;
};
