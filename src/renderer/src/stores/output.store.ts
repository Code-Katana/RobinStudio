import { Comparison, CompilerPhase, Measurement } from "@renderer/types";
import { createStore } from "zustand";

type OutputPanelType = "phase" | "comparison" | "measure";

type OutputDataType = CompilerPhase | Comparison | Measurement;

type OutputType<T extends OutputPanelType, U extends OutputDataType> = {
  panelType: T;
  data: U;
};

type OutputStoreType =
  | OutputType<"phase", CompilerPhase>
  | OutputType<"comparison", Comparison>
  | OutputType<"measure", Measurement>;

interface OutputStore {
  output: OutputStoreType;
  setPhase: (phase: CompilerPhase) => void;
  setComparison: (comparison: Comparison) => void;
  setMeasurement: (measurement: Measurement) => void;
  getPanelType: () => OutputPanelType;
  getData: () => OutputDataType;
}

const outputStore = createStore<OutputStore>((set, get) => ({
  output: {
    panelType: "phase",
    data: CompilerPhase.Tokenize,
  },
  setPhase: (phase: CompilerPhase) => {
    set({ output: { panelType: "phase", data: phase } });
  },
  setComparison: (comparison: Comparison) => {
    set({ output: { panelType: "comparison", data: comparison } });
  },
  setMeasurement: (measurement: Measurement) => {
    set({ output: { panelType: "measure", data: measurement } });
  },
  getPanelType: () => {
    return get().output.panelType;
  },
  getData: () => {
    return get().output.data;
  },
}));

export default outputStore;
