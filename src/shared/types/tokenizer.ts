export enum ScannerOptions {
  HandCoded,
  FA,
}

export type Token = {
  type: string;
  value: string;
  line: number;
  start: number;
  end: number;
};
