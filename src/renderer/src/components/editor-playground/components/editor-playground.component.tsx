/* eslint-disable @typescript-eslint/no-explicit-any */
// EditorPlayground.tsx
import { useEffect, useRef } from "react";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";
import { MonacoLanguageClient } from "monaco-languageclient";
import { CloseAction, ErrorAction } from "monaco-languageclient/lib/client";
import { MessageReader, MessageWriter } from "vscode-ws-jsonrpc";
import { WrapperConfig } from "monaco-editor-wrapper/.";

class IpcMessageReader implements MessageReader {
  private callback: ((message: string) => void) | null = null;
  constructor() {
    window.testLsp.receive(this.callback as (data: string) => void | null);
  }
  listen(callback: (data: string) => void): void {
    this.callback = callback;
  }
  dispose(): void {
    this.callback = null;
    window.testLsp.dispose();
  }
}

// Custom JSON-RPC writer that sends on 'lsp-to-main'
class IpcMessageWriter implements MessageWriter {
  write(message: any): void {
    // Send JSON-RPC message string to main
    window.testLsp.send(JSON.stringify(message));
  }
}

export const EditorPlayground: React.FC = () => {
  const { currentFile, onUpdateCurrentFile } = useCurrentProject();
  const editorRef = useRef<any>(null);

  // Define initial wrapperConfig for monaco-editor-wrapper
  const wrapperConfig: WrapperConfig = {
    $type: "extended", // use VSCode-like mode for richer features
    htmlContainer: document.getElementById("monaco-container")!, // placeholder; will be set on load
    editorAppConfig: {
      monacoWorkerFactory: configureDefaultWorkerFactory,
      codeResources: {
        modified: {
          uri: currentFile!.path,
          text: currentFile!.content,
        },
      },
    },
  };

  // onLoad gives access to the wrapper instance after editor is created
  const handleLoad = (wrapper: any) => {
    editorRef.current = wrapper;
    // Optionally, you can now interact with the wrapper
    // e.g. wrapper.getMonaco().editor.setTheme('custom-shadcn-theme')
  };

  useEffect(() => {
    if (editorRef.current) {
      // Create language client once editor is ready
      const reader = new IpcMessageReader();
      const writer = new IpcMessageWriter();
      const languageClient = new MonacoLanguageClient({
        name: "Custom Language Client",
        clientOptions: {
          // Specify the language id(s) this client handles (e.g. 'rbn' or the extension)
          documentSelector: [{ language: "plaintext" }],
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart,
          },
        },
        connectionProvider: {
          // Provide the MessageTransports to monaco-languageclient
          get: (encoding) => {
            return Promise.resolve({ reader, writer });
          },
        },
      });
      languageClient.start();
      // Request the main process to start the LSP
      window.testLsp.start();
    }
  }, [editorRef.current]);

  return (
    <div id="monaco-container" style={{ height: "80vh", border: "1px solid #bbb" }}>
      <MonacoEditorReactComp
        wrapperConfig={wrapperConfig}
        onTextChanged={(text) => onUpdateCurrentFile(text.modified)}
        style={{ height: "100%" }}
        onLoad={handleLoad}
      />
    </div>
  );
};
