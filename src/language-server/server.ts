import WebSocket from "ws";
import {
  createConnection,
  TextDocuments,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";

const wsServer = new WebSocket.Server({ port: 6969 });
console.log("Robin LSP WebSocket server running on ws://localhost:8081");

wsServer.on("connection", (socket) => {
  console.log("WebSocket connection established with the renderer.");

  // Create LSP connection
  const connection = createConnection(ProposedFeatures.all);
  const documents = new TextDocuments(TextDocument);

  console.log("Welcome from Robin LSP.");

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

  documents.listen(connection);
  connection.listen();

  // Forward LSP notifications to WebSocket
  connection.onNotification((method, params) => {
    socket.send(JSON.stringify({ type: "notification", method, params }));
  });

  // Handle WebSocket messages from the renderer
  socket.on("message", (message) => {
    try {
      const { method, params } = JSON.parse(message.toString());
      console.log(`Received request: ${method}`);

      connection.sendRequest(method, params).then((response) => {
        socket.send(JSON.stringify({ type: "response", method, response }));
      });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});
