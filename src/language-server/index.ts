import {
  createConnection,
  TextDocuments,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { executeCompiler, OUTPUT_PATH } from "./lib/execute-compiler";
// import { ScannerOptions } from "@shared/types";
import { readCompilerOutput } from "./lib/read-compiler-output";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

console.log("Welcome from Amin LSP.");

connection.onInitialize((params: InitializeParams): InitializeResult => {
  console.log("LSP Server initialized!", params);
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
    },
  };
});

connection.onInitialized(() => {
  console.log("LSP Server is ready!");
});

documents.onDidChangeContent((change) => {
  console.log(`Document changed: ${change.document.uri}`);
});

connection.onRequest("rbn/tokenize", async (params: { source: string; scannerOption: string }) => {
  await executeCompiler(params.source, params.scannerOption, "tokenize");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonData = await readCompilerOutput<any>(OUTPUT_PATH);

  return jsonData;
});

connection.onRequest("rbn/parse", async (params: { source: string }) => {
  await executeCompiler(params.source, "FA", "parse");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonData = await readCompilerOutput<any>(OUTPUT_PATH);

  return jsonData;
});

documents.listen(connection);
connection.listen();
