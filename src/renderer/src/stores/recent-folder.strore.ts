import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentFolder = {
  name: string;
  path: string;
  lastOpened: number;
};

interface RecentFoldersState {
  recentFolders: RecentFolder[];
  addRecentFolder: (name: string, path: string) => void;
  removeRecentFolder: (path: string) => void;
  clearRecentFolders: () => void;
}

export const useRecentFoldersStore = create<RecentFoldersState>()(
  persist(
    (set) => ({
      recentFolders: [],
      addRecentFolder: (name, path) => {
        if (!name || !path) {
          console.warn("Invalid folder data provided");
          return;
        }

        set((state) => {
          // Remove if folder already exists
          const filteredFolders = state.recentFolders.filter((folder) => folder.path !== path);

          // Add new folder at the beginning
          const newFolder: RecentFolder = {
            name,
            path,
            lastOpened: Date.now(),
          };

          // Keep only the 10 most recent folders and sort by lastOpened
          const updatedFolders = [newFolder, ...filteredFolders]
            .sort((a, b) => b.lastOpened - a.lastOpened)
            .slice(0, 10);

          return { recentFolders: updatedFolders };
        });
      },
      removeRecentFolder: (path) => {
        set((state) => ({
          recentFolders: state.recentFolders.filter((folder) => folder.path !== path),
        }));
      },
      clearRecentFolders: () => set({ recentFolders: [] }),
    }),
    {
      name: "recent-folders-storage",
    },
  ),
);
