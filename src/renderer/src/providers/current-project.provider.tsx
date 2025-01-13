import { HnExpressionNode } from "@shared/types";
import { createContext, useState } from "react";

export enum OpenFileStates {
  Saved = "saved",
  Unsaved = "unsaved",
  Deleted = "deleted",
}

export type OpenFileType = {
  name: string;
  path: string;
  content: string;
  state: OpenFileStates;
};

type CurrentProjectContextType = {
  rootPath: string | undefined;
  fileTree: HnExpressionNode | undefined;
  openedFiles: Set<OpenFileType>;
  currentFile: OpenFileType | undefined;
  onOpenProject: (path: string | undefined, tree: HnExpressionNode | undefined) => void;
  onCloseProject: () => void;
  onOpenFile: (name: string, path: string, content: string) => void;
  onCloseFile: (filePath: string) => void;
  onUpdateCurrentFile: (value: string | undefined) => void;
  onSaveCurrentFile: () => void;
};

export const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(
  undefined,
);

export const CurrentProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rootPath, setRootPath] = useState<string | undefined>(undefined);
  const [fileTree, setFileTree] = useState<HnExpressionNode | undefined>(undefined);
  const [openedFiles, setOpenedFiles] = useState<Set<OpenFileType>>(new Set());
  const [currentFile, setCurrentFile] = useState<OpenFileType | undefined>(undefined);

  function onOpenProject(path: string | undefined, tree: HnExpressionNode | undefined) {
    if (!path || !tree) {
      return;
    }

    setRootPath(path);
    setFileTree(tree);
    setOpenedFiles(new Set());
    setCurrentFile(undefined);
  }

  function onCloseProject() {
    setRootPath(undefined);
    setFileTree(undefined);
    setOpenedFiles(new Set());
    setCurrentFile(undefined);
  }

  function onOpenFile(name: string, path: string, content: string) {
    const newFile = { name, path, content, state: OpenFileStates.Saved };

    setOpenedFiles((prevOpenedFiles) => {
      const isExists = [...prevOpenedFiles].some((file) => file.path === newFile.path);

      if (isExists) {
        return prevOpenedFiles;
      }

      return new Set(prevOpenedFiles).add(newFile);
    });

    setCurrentFile(newFile);
  }

  function onCloseFile(filePath: string) {
    setOpenedFiles((prevOpenedFiles) => {
      const updatedFiles = new Set(prevOpenedFiles);

      updatedFiles.forEach((file) => {
        if (file.path === filePath) {
          updatedFiles.delete(file);
        }
      });

      setCurrentFile((prevCurrentFile) => {
        if (prevCurrentFile?.path === filePath) {
          const remainingFiles = [...updatedFiles];

          if (remainingFiles.length > 0) {
            const currentIndex = remainingFiles.findIndex((file) => file.path === filePath);
            const nextIndex = (currentIndex + 1) % remainingFiles.length;
            return remainingFiles[nextIndex];
          }

          return undefined;
        }

        return prevCurrentFile;
      });

      return updatedFiles;
    });
  }

  function onUpdateCurrentFile(value: string | undefined) {
    setCurrentFile((prevCurrentFile) => {
      if (!prevCurrentFile) {
        return undefined;
      }

      return {
        name: prevCurrentFile.name,
        path: prevCurrentFile.path,
        content: value || "",
        state: OpenFileStates.Unsaved,
      } as OpenFileType;
    });
  }

  function onSaveCurrentFile() {
    setCurrentFile((prevCurrentFile) => {
      if (!prevCurrentFile) {
        return undefined;
      }

      return {
        name: prevCurrentFile.name,
        path: prevCurrentFile.path,
        content: prevCurrentFile.content,
        state: OpenFileStates.Saved,
      } as OpenFileType;
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
        onSaveCurrentFile,
      }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
};
