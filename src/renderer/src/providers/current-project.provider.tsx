import { useDebounceValue } from "@renderer/hooks/use-debounce-value";
import { HnExpressionNode } from "@shared/types";
import { createContext, useState, useEffect } from "react";

export type OpenFileType = {
  name: string;
  path: string;
  content: string;
};

export type CurrentProjectContextType = {
  rootPath: OptionalString;
  fileTree: HnExpressionNode | undefined;
  openedFiles: Map<string, OpenFileType>;
  currentFile: OpenFileType | undefined;
  onOpenProject: (path: OptionalString, tree: HnExpressionNode | undefined) => void;
  onCloseProject: () => void;
  onOpenFile: (name: string, path: string, content: string) => void;
  onCloseFile: (filePath: string) => void;
  onUpdateCurrentFile: (value?: string) => void;
  moveTab: (dragIndex: number, hoverIndex: number) => void;
  onUpdateCurrentFile: (value?: string) => void;
};

export const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(
  undefined,
);

export const CurrentProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rootPath, setRootPath] = useState<OptionalString>(undefined);
  const [fileTree, setFileTree] = useState<HnExpressionNode | undefined>(undefined);
  const [openedFiles, setOpenedFiles] = useState<Map<string, OpenFileType>>(new Map());
  const [currentFile, setCurrentFile] = useState<OpenFileType | undefined>(undefined);

  const [bufferedContent, setBufferedContent] = useState<OptionalString>(undefined);
  const debouncedContent = useDebounceValue<OptionalString>(bufferedContent);

  function onOpenProject(path: OptionalString, tree: HnExpressionNode | undefined) {
    if (!path || !tree) {
      return;
    }

    setRootPath(path);
    setFileTree(tree);
    setOpenedFiles(new Map());
    setCurrentFile(undefined);
  }

  function onCloseProject() {
    setRootPath(undefined);
    setFileTree(undefined);
    setOpenedFiles(new Map());
    setCurrentFile(undefined);
  }

  function onOpenFile(name: string, path: string, content: string) {
    setOpenedFiles((prevOpenedFiles) => {
      if (prevOpenedFiles.has(path)) {
        setCurrentFile(prevOpenedFiles.get(path));
        return prevOpenedFiles;
      }

      const newFile: OpenFileType = { name, path, content };
      const updatedFiles = new Map(prevOpenedFiles);

      updatedFiles.set(path, newFile);
      setCurrentFile(newFile);
      return updatedFiles;
    });
  }

  function onCloseFile(filePath: string) {
    setOpenedFiles((prevOpenedFiles) => {
      if (!prevOpenedFiles.has(filePath)) return prevOpenedFiles;

      const updatedFiles = new Map(prevOpenedFiles);
      updatedFiles.delete(filePath);

      setCurrentFile((prevCurrentFile) => {
        if (prevCurrentFile?.path !== filePath) return prevCurrentFile;
        if (updatedFiles.size === 0) return undefined;

        const fileArray = [...prevOpenedFiles.values()];
        const closedFileIndex = fileArray.findIndex((file) => file.path === filePath);
        const nextFileIndex = (closedFileIndex + 1) % fileArray.length;
        return fileArray[nextFileIndex];
      });

      return updatedFiles;
    });
  }

  function onUpdateCurrentFile(value: OptionalString) {
    setBufferedContent(value);
  }

  useEffect(() => {
    if (!currentFile) return;

    setCurrentFile((prevCurrentFile) => {
      if (!prevCurrentFile) return undefined;

      const updatedFile: OpenFileType = {
        ...prevCurrentFile,
        content: debouncedContent || "",
      };

      setOpenedFiles((prevOpenedFiles) => {
        const updatedFiles = new Map(prevOpenedFiles);
        updatedFiles.set(updatedFile.path, updatedFile);
        return updatedFiles;
      });

      console.log(updatedFile.content);

      return updatedFile;
    });
  }, [debouncedContent]);

  function moveTab(dragIndex: number, hoverIndex: number) {
    setOpenedFiles((prevOpenedFiles) => {
      const filesArray = Array.from(prevOpenedFiles.values());

      // Don't do anything if indices are invalid
      if (
        dragIndex < 0 ||
        hoverIndex < 0 ||
        dragIndex >= filesArray.length ||
        hoverIndex >= filesArray.length
      ) {
        return prevOpenedFiles;
      }

      // Reorder the array
      const [removed] = filesArray.splice(dragIndex, 1);
      filesArray.splice(hoverIndex, 0, removed);

      // Create new Map with updated order
      const newFilesMap = new Map();
      filesArray.forEach((file) => {
        newFilesMap.set(file.path, file);
      });

      return newFilesMap;
    });
  }

  return (
    <CurrentProjectContext.Provider
      value={{
        rootPath,
        fileTree,
        openedFiles,
        currentFile,
        onOpenProject,
        onCloseProject,
        onOpenFile,
        onCloseFile,
        onUpdateCurrentFile,
        moveTab,
      }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
};
