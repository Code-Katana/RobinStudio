import { create } from "zustand";
import { HnExpressionNode } from "@shared/types";

export type OpenFileType = {
  name: string;
  path: string;
  content: string;
};

export interface CurrentProjectState {
  rootPath: string | undefined;
  fileTree: HnExpressionNode | undefined;
  openedFiles: Map<string, OpenFileType>;
  currentFile: OpenFileType | undefined;
  onOpenProject: (path: string | undefined, tree: HnExpressionNode | undefined) => void;
  onCloseProject: () => void;
  onOpenFile: (name: string, path: string, content: string) => void;
  onCloseFile: (filePath: string) => void;
  onUpdateCurrentFile: (value?: string) => void;
  moveTab: (dragIndex: number, hoverIndex: number) => void;
}

export const useCurrentProjectStore = create<CurrentProjectState>((set) => ({
  rootPath: undefined,
  fileTree: undefined,
  openedFiles: new Map(),
  currentFile: undefined,

  onOpenProject: (path, tree) => {
    if (!path || !tree) return;
    set({
      rootPath: path,
      fileTree: tree,
      openedFiles: new Map(),
      currentFile: undefined,
    });
  },

  onCloseProject: () => {
    set({
      rootPath: undefined,
      fileTree: undefined,
      openedFiles: new Map(),
      currentFile: undefined,
    });
  },

  onOpenFile: (name, path, content) => {
    set((state) => {
      if (state.openedFiles.has(path)) {
        return { currentFile: state.openedFiles.get(path) };
      }

      const newFile: OpenFileType = { name, path, content };
      const updatedFiles = new Map(state.openedFiles);
      updatedFiles.set(path, newFile);

      return {
        openedFiles: updatedFiles,
        currentFile: newFile,
      };
    });
  },

  onCloseFile: (filePath) => {
    set((state) => {
      if (!state.openedFiles.has(filePath)) return {};

      const updatedFiles = new Map(state.openedFiles);
      updatedFiles.delete(filePath);

      let nextCurrentFile = state.currentFile;
      if (state.currentFile?.path === filePath) {
        if (updatedFiles.size === 0) {
          nextCurrentFile = undefined;
        } else {
          const fileArray = [...state.openedFiles.values()];
          const closedFileIndex = fileArray.findIndex((file) => file.path === filePath);
          const nextFileIndex = (closedFileIndex + 1) % fileArray.length;
          nextCurrentFile = fileArray[nextFileIndex];
        }
      }

      return {
        openedFiles: updatedFiles,
        currentFile: nextCurrentFile,
      };
    });
  },

  onUpdateCurrentFile: (value) => {
    set((state) => {
      if (!state.currentFile) return {};

      const updatedFile: OpenFileType = {
        ...state.currentFile,
        content: value || "",
      };

      const updatedFiles = new Map(state.openedFiles);
      updatedFiles.set(updatedFile.path, updatedFile);

      return {
        openedFiles: updatedFiles,
        currentFile: updatedFile,
      };
    });
  },

  moveTab: (dragIndex: number, hoverIndex: number) => {
    set((state) => {
      const filesArray = Array.from(state.openedFiles.values());

      // Don't do anything if indices are invalid
      if (
        dragIndex < 0 ||
        hoverIndex < 0 ||
        dragIndex >= filesArray.length ||
        hoverIndex >= filesArray.length
      ) {
        return {};
      }

      // Reorder the array
      const [removed] = filesArray.splice(dragIndex, 1);
      filesArray.splice(hoverIndex, 0, removed);

      // Create new Map with updated order
      const newFilesMap = new Map<string, OpenFileType>();
      filesArray.forEach((file) => {
        newFilesMap.set(file.path, file);
      });

      return {
        openedFiles: newFilesMap,
      };
    });
  },
}));
