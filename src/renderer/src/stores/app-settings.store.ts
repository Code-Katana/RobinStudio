import { create } from "zustand";
import { ParserOptions, ScannerOptions } from "@shared/types";

type DirectionType = "horizontal" | "vertical";

export interface AppSettingsState {
  direction: DirectionType;
  scannerOption: ScannerOptions;
  parserOption: ParserOptions;
  outputOpen: boolean;
  sidebarOpen: boolean;
  setDirection: (dir: DirectionType) => void;
  setScannerOption: (opt: ScannerOptions) => void;
  setParserOption: (opt: ParserOptions) => void;
  setOutputOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppSettingsStore = create<AppSettingsState>((set) => ({
  direction: "horizontal",
  scannerOption: ScannerOptions.FA,
  parserOption: ParserOptions.RecursiveDecent,
  outputOpen: false,
  sidebarOpen: true,
  setDirection: (dir) => set({ direction: dir }),
  setScannerOption: (opt) => set({ scannerOption: opt }),
  setParserOption: (opt) => set({ parserOption: opt }),
  setOutputOpen: (open) => set({ outputOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
