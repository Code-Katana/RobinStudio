import { Method } from "@shared/types";

type LspChannel = {
  request: "lsp:send";
  response: "lsp:receive";
  notification: "lsp:notification";
  methods: Record<string, Method>;
};

export const lsp: LspChannel = {
  request: "lsp:send",
  response: "lsp:receive",
  notification: "lsp:notification",
  methods: {
    initialize: "initialize",
    tokenize: "tokenize",
    parseAst: "parseAst",
  },
};
