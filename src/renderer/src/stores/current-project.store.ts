import { create } from "zustand";
import { HnExpressionNode } from "@shared/types";
import { useRecentFilesStore } from "./recent-files.store";
import { useRecentFoldersStore } from "./recent-folder.strore";
import { useLanguageServer } from "@renderer/hooks/use-langaugeserver";
// import { getFileTree } from "@main/lib/get-file-tree";

export type OpenFileType = {
  name: string;
  path: string;
  content: string;
  version: number;
};

export type CurrentFolderType = {
  name: string;
  path: string;
};

export interface CurrentProjectState {
  projectName: string | undefined;
  rootPath: string | undefined;
  fileTree: HnExpressionNode | undefined;
  openedFiles: Map<string, OpenFileType>;
  currentFile: OpenFileType | undefined;
  currentFolder: CurrentFolderType | undefined;
  onOpenProject: (
    projectName: string | undefined,
    path: string | undefined,
    tree: HnExpressionNode | undefined,
  ) => void;
  onCloseProject: () => void;
  onCreateFile: (name: string, content: string) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
  onOpenFile: (name: string, path: string, content: string) => void;
  onCloseFile: (filePath: string) => void;
  onUpdateCurrentFile: (value?: string) => void;
  onSetCurrentFolder: (name: string, path: string) => void;
  moveTab: (dragIndex: number, hoverIndex: number) => void;
}

export const useCurrentProjectStore = create<CurrentProjectState>((set, get) => ({
  projectName: undefined,
  rootPath: undefined,
  fileTree: undefined,
  openedFiles: new Map(),
  currentFile: undefined,
  currentFolder: undefined,

  onOpenProject: (projectName, path, tree) => {
    const { addRecentFolder } = useRecentFoldersStore.getState();
    if (!path || !tree) return;
    const state = get();
    const wasSettingsOpen = state.currentFile?.path === "settings";
    const settingsFile = { name: "Settings", path: "settings", content: "", version: 1 };

    const wasWelcomeOpen = state.currentFile?.path === "welcome";
    const welcomeFile = { name: "Welcome", path: "welcome", content: "", version: 1 };

    addRecentFolder(projectName!, path);
    set({
      projectName: projectName,
      rootPath: path,
      fileTree: tree,
      openedFiles: wasSettingsOpen
        ? new Map([["settings", settingsFile]])
        : wasWelcomeOpen
          ? new Map([["welcome", welcomeFile]])
          : new Map(),
      currentFile: wasSettingsOpen ? settingsFile : wasWelcomeOpen ? welcomeFile : undefined,
    });
  },

  onCloseProject: () => {
    set({
      projectName: undefined,
      rootPath: undefined,
      fileTree: undefined,
      openedFiles: new Map(),
      currentFile: undefined,
      currentFolder: undefined,
    });
  },

  onOpenFile: (name, path, content) => {
    set((state) => {
      if (state.openedFiles.has(path)) {
        return { currentFile: state.openedFiles.get(path) };
      }

      const newFile: OpenFileType = { name, path, content, version: 1 };
      const updatedFiles = new Map(state.openedFiles);
      updatedFiles.set(path, newFile);

      const { addRecentFile } = useRecentFilesStore.getState();
      addRecentFile(name, path);

      const parentPath = path.split("/").slice(0, -1).join("/");
      const parentName = parentPath.split("/").pop() || "";

      window.lsp.send({
        jsonrpc: "2.0",
        method: "textDocument/didOpen",
        params: {
          textDocument: {
            uri: newFile.path,
            languageId: "rbn",
            version: newFile.version,
            text: newFile.content,
          },
        },
      });

      return {
        openedFiles: updatedFiles,
        currentFile: newFile,
        currentFolder: { name: parentName, path: parentPath },
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

      window.lsp.send({
        jsonrpc: "2.0",
        method: "textDocument/didClose",
        params: {
          textDocument: { uri: filePath },
        },
      });

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
        version: state.currentFile.version + 1,
      };

      const updatedFiles = new Map(state.openedFiles);
      updatedFiles.set(updatedFile.path, updatedFile);

      window.lsp.send({
        jsonrpc: "2.0",
        method: "textDocument/didChange",
        params: {
          textDocument: {
            uri: updatedFile.path,
            version: updatedFile.version,
          },
          contentChanges: [{ text: value || "" }],
        },
      });

      return {
        openedFiles: updatedFiles,
        currentFile: updatedFile,
      };
    });
  },

  onSetCurrentFolder: (name, path) => {
    set({ currentFolder: { name, path } });
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

  onCreateFile: async (name: string, content: string) => {
    const state = get();
    if (!state.currentFolder?.path) {
      throw new Error("No folder selected");
    }

    try {
      await window.fs.createFile({
        path: state.currentFolder.path,
        name: name,
        content: content,
      });

      // Open the newly created file
      const filePath = window.fs.resolvePath(state.currentFolder.path, name);
      state.onOpenFile(name, filePath, content);

      // Update the file tree
      if (state.rootPath) {
        const { tree } = await window.fs.updateTree({ path: state.rootPath });
        set({ fileTree: tree });
      }
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  },

  onCreateFolder: async (name: string) => {
    const state = get();
    if (!state.currentFolder?.path) {
      throw new Error("No folder selected");
    }

    try {
      const response = await window.fs.createFolder({
        path: state.currentFolder.path,
        name: name,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to create folder");
      }

      // Update the file tree
      if (state.rootPath) {
        const { tree } = await window.fs.updateTree({ path: state.rootPath });
        set({ fileTree: tree });
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  },
}));
