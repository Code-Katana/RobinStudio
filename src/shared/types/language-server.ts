import { ParserOptions } from "./parse";
import { ScannerOptions } from "./tokenizer";

export type LSPArray = LSPAny[];

export type LSPObject = { [key: string]: LSPAny };

export type LSPAny = LSPObject | LSPArray | string | number | boolean | null;

export type RequestMethod =
  | "initialize"
  | "compilerAction/tokenize"
  | "compilerAction/parseAst"
  | "compilerAction/ir"
  | "compilerAction/optimization"
  | "compilerAction/compile";

export type NotificationMethod =
  | "textDocument/didOpen"
  | "textDocument/didClose"
  | "textDocument/didChange";

export type Method = RequestMethod | NotificationMethod;

export type MessageParams = {
  initialize: InitializeParams;
  "compilerAction/tokenize": TokenizeCompilerActionParams;
  "compilerAction/parseAst": ParseCompilerActionParams;
  "compilerAction/ir": IrCompilerActionParams;
  "compilerAction/optimization": OptimizationCompilerActionParams;
  "compilerAction/compile": CompileCompilerActionParams;
  "textDocument/didOpen": DidOpenTextDocumentParams;
  "textDocument/didClose": DidCloseTextDocumentParams;
  "textDocument/didChange": DidChangeTextDocumentParams;
};

export interface Message {
  jsonrpc: string;
}

export interface RequestMessage extends Message {
  id: number;
  method: Method;
  params?: MessageParams[Method];
}

export interface ResponseMessage extends Message {
  id: number | null;
  result?: LSPAny;
  error?: ResponseError;
}

export interface ResponseError {
  code: number;
  message: string;
  data?: LSPAny;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: LSPArray | LSPObject;
}

// Initialize Params
export type InitializeParams = {
  processId?: number;
  clientInfo: {
    name: string;
    version: string;
  };
};

// Text Document Params
export type DidOpenTextDocumentParams = {
  textDocument: {
    uri: string;
    languageId: string;
    version: number;
    text: string;
  };
};

export type DidCloseTextDocumentParams = {
  textDocument: {
    uri: string;
  };
};

export type DidChangeTextDocumentParams = {
  textDocument: {
    uri: string;
    version: number;
  };
  contentChanges: {
    text: string;
  }[];
};

// Compiler Actions
export type TokenizeCompilerActionParams = {
  scannerOption: ScannerOptions;
  textDocument: string;
};

export type ParseCompilerActionParams = {
  parserOption: ParserOptions;
  textDocument: string;
};

export type IrCompilerActionParams = {
  textDocument: string;
  outputDocument: string;
};

export type OptimizationCompilerActionParams = {
  textDocument: string;
  beforeDocument: string;
  afterDocument: string;
};

export type CompileCompilerActionParams = {
  textDocument: string;
  outputDocument: string;
};
