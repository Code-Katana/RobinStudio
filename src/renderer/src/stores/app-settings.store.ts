import { create } from "zustand";
import { ParserOptions, ScannerOptions } from "@shared/types";

type DirectionType = "horizontal" | "vertical";

export interface AppSettingsState {
  direction: DirectionType;
  scannerOption: ScannerOptions;
  parserOption: ParserOptions;
  setDirection: (dir: DirectionType) => void;
  setScannerOption: (opt: ScannerOptions) => void;
  setParserOption: (opt: ParserOptions) => void;
}

export const useAppSettingsStore = create<AppSettingsState>((set) => ({
  direction: "horizontal",
  scannerOption: ScannerOptions.FA,
  parserOption: ParserOptions.RecursiveDecent,
  setDirection: (dir) => set({ direction: dir }),
  setScannerOption: (opt) => set({ scannerOption: opt }),
  setParserOption: (opt) => set({ parserOption: opt }),
}));
