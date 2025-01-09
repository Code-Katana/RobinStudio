// import { ParserOptions } from "@shared/types";

export type ParseRequest = {
  // parser: ParserOptions;
  source: string;
};

export type ParseResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ast: any;
};
