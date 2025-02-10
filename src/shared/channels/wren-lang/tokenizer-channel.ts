import { ScannerOptions, Token } from "@shared/types";

export type TokenizeRequest = {
  scanner: ScannerOptions;
  source: string;
};

export type TokenizeResponse = {
  tokens: Token[];
};
