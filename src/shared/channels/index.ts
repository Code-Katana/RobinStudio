export * from "./tokenizer-channel";

export const Channels = {
  tokenize: "tokenize",
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];
