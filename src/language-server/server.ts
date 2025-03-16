import {
  createConnection,
  TextDocuments,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";

// Create a connection for the server using Node.js standard input/output
const connection = createConnection(ProposedFeatures.all);

// Create a document manager to store text documents
const documents = new TextDocuments(TextDocument);

console.log("Welcome from Amin LSP.");

// Handle `initialize` request from the client (Electron app)
connection.onInitialize((params: InitializeParams): InitializeResult => {
  console.log("LSP Server initialized!", params);

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
    },
  };
});

// Handle `initialized` notification
connection.onInitialized(() => {
  console.log("LSP Server is ready!");
});

// Listen for changes in text documents
documents.onDidChangeContent((change) => {
  console.log(`Document changed: ${change.document.uri}`);
});

// Start listening for messages
documents.listen(connection);
connection.listen();
