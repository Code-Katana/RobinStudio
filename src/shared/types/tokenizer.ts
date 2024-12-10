export enum ScannerOptions {
  HandCoded = "HandCoded",
  FA = "FA",
}

export type Token = {
  type: string;
  value: string;
  line: number;
  start: number;
  end: number;
};
