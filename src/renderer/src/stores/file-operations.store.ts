import { create } from "zustand";
import { HnExpressionNode } from "@shared/types";

interface File {
  name: string;
  path: string;
  content: string;
}

interface FileOperationsState {
  isMenuOpen: boolean;
  isRecentMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setRecentMenuOpen: (open: boolean) => void;
  handleOpenFile: (
    onOpenFile: (name: string, path: string, content: string) => void,
  ) => Promise<void>;
  handleOpenProject: (
    onOpenProject: (name: string, path: string, tree: HnExpressionNode) => void,
  ) => Promise<void>;
  handleSaveFile: (file: File | null) => Promise<void>;
  handleSaveAll: (files: Map<string, File>) => Promise<void>;
  handleCloseEditor: (currentFile: File | null, onCloseFile: (path: string) => void) => void;
  handleCloseFolder: (onCloseProject: () => void) => void;
  handleCloseAllWindows: () => void;
}

export const useFileOperationsStore = create<FileOperationsState>((set, get) => ({
  isMenuOpen: false,
  isRecentMenuOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setRecentMenuOpen: (open) => set({ isRecentMenuOpen: open }),

  handleOpenFile: async (onOpenFile) => {
    const res = await window.fs.openFile();
    if (res == null) {
      alert("Oops, cant open this file, please try again.");
      return;
    }
    const fileName = res.path.split(/[\\/]/).pop() ?? res.path;
    onOpenFile(fileName, res.path, res.content!);
    get().setMenuOpen(false);
  },

  handleOpenProject: async (onOpenProject) => {
    const res = await window.fs.openFolder();
    if (res == null) {
      alert("Oops, cant open this folder, please try again.");
      return;
    }
    onOpenProject(res?.folderName, res?.folderPath, res?.fileTree);
    get().setMenuOpen(false);
  },

  handleSaveFile: async (currentFile) => {
    if (!currentFile) {
      alert("No file is currently open.");
      return;
    }
    await window.fs.saveFile({
      path: currentFile.path,
      content: currentFile.content,
    });
    get().setMenuOpen(false);
  },

  handleSaveAll: async (openedFiles) => {
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
    get().setMenuOpen(false);
  },

  handleCloseEditor: (currentFile, onCloseFile) => {
    if (currentFile) {
      onCloseFile(currentFile.path);
    }
    get().setMenuOpen(false);
  },

  handleCloseFolder: (onCloseProject) => {
    onCloseProject();
    get().setMenuOpen(false);
  },

  handleCloseAllWindows: () => {
    window.electron.closeWindow();
  },
}));
