import { ScannerOptions, Token } from "@shared/types";

export type TokenizeRequest = {
  scanner: ScannerOptions;
  source: string;
};

export type TokenizeResponse = {
  tokens: Token[];
};

export type TokenizeFunction = (src: string, sc: number) => number;
