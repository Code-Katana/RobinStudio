import { RequestMethod } from "@shared/types";

type LspChannel = {
  request: "lsp:send";
  response: "lsp:receive";
  notification: "lsp:notification";
  methods: Record<RequestMethod, RequestMethod>;
};

export const lsp: LspChannel = {
  request: "lsp:send",
  response: "lsp:receive",
  notification: "lsp:notification",
  methods: {
    initialize: "initialize",
    "compilerAction/tokenize": "compilerAction/tokenize",
    "compilerAction/parseAst": "compilerAction/parseAst",
    "compilerAction/ir": "compilerAction/ir",
    "compilerAction/optimization": "compilerAction/optimization",
    "compilerAction/compile": "compilerAction/compile",
  },
};
