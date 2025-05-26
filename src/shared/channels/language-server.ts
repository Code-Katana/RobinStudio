import { Method } from "@shared/types";

type LspChannel = {
  request: "lsp:send";
  response: "lsp:receive";
  methods: Record<string, Method>;
};

export const lsp: LspChannel = {
  request: "lsp:send",
  response: "lsp:receive",
  methods: {
    initialize: "initialize",
    tokenize: "tokenize",
  },
};
