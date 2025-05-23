export enum CompilerPhase {
  Tokenize = "tokenize",
  Parse = "parse",
  Typecheck = "typecheck",
  IrGeneration = "ir-generation",
  IrOptimization = "ir-optimization",
  Compile = "compile",
}
