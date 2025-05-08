import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentFile = {
  name: string;
  path: string;
  lastOpened: number;
};

interface RecentFilesState {
  recentFiles: RecentFile[];
  addRecentFile: (name: string, path: string) => void;
  clearRecentFiles: () => void;
}

export const useRecentFilesStore = create<RecentFilesState>()(
  persist(
    (set) => ({
      recentFiles: [],
      addRecentFile: (name, path) => {
        set((state) => {
          // Remove if file already exists
          const filteredFiles = state.recentFiles.filter((file) => file.path !== path);

          // Add new file at the beginning
          const newFile: RecentFile = {
            name,
            path,
            lastOpened: Date.now(),
          };

          // Keep only the 10 most recent files
          const updatedFiles = [newFile, ...filteredFiles].slice(0, 10);

          return { recentFiles: updatedFiles };
        });
      },
      clearRecentFiles: () => set({ recentFiles: [] }),
    }),
    {
      name: "recent-files-storage",
    },
  ),
);
