import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { useMemo, useRef, useEffect } from "react";
import { wrenLanguageConfig, WrenStudioTheme, wrenTokensProvider } from "@renderer/languages/wren";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import {
  MessageReader,
  MessageWriter,
  NotificationMessage,
  DataCallback,
  Disposable,
  Event,
  Message,
  PartialMessageInfo,
  Emitter,
  RequestMessage,
} from "vscode-jsonrpc";
import { MonacoLanguageClient } from "monaco-languageclient";
import { createMessageConnection } from "vscode-jsonrpc";

class IpcMessageReader implements MessageReader {
  private listeners: DataCallback[] = [];
  private errorEmitter = new Emitter<Error>();
  private closeEmitter = new Emitter<void>();
  private partialMessageEmitter = new Emitter<PartialMessageInfo>();

  constructor() {
    window.lsp.onNotification((method, params) => {
      const msg: RequestMessage = { jsonrpc: "2.0", method, params, id: null };
      this.listeners.forEach((listener) => listener(msg));
    });
  }

  listen(callback: DataCallback): Disposable {
    this.listeners.push(callback);
    return {
      dispose: () => {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
      },
    };
  }

  get onError(): Event<Error> {
    return this.errorEmitter.event;
  }

  get onClose(): Event<void> {
    return this.closeEmitter.event;
  }

  get onPartialMessage(): Event<PartialMessageInfo> {
    return this.partialMessageEmitter.event;
  }

  dispose(): void {
    this.listeners = [];
    this.errorEmitter.dispose();
    this.closeEmitter.dispose();
    this.partialMessageEmitter.dispose();
  }
}

class IpcMessageWriter implements MessageWriter {
  private errorEmitter = new Emitter<[Error, Message | undefined, number | undefined]>();
  private closeEmitter = new Emitter<void>();

  write(msg: NotificationMessage): Promise<void> {
    window.lsp.sendRequest(msg.method, msg.params);
    return Promise.resolve();
  }

  get onError(): Event<[Error, Message | undefined, number | undefined]> {
    return this.errorEmitter.event;
  }

  get onClose(): Event<void> {
    return this.closeEmitter.event;
  }

  end(): void {
    this.closeEmitter.fire();
  }

  dispose(): void {
    this.errorEmitter.dispose();
    this.closeEmitter.dispose();
  }
}

export function useRobinLsp() {
  useEffect(() => {
    const connection = createMessageConnection(new IpcMessageReader(), new IpcMessageWriter());

    const languageClient = new MonacoLanguageClient({
      name: "Robin LSP",
      clientOptions: {
        documentSelector: [{ language: "wren" }],
        errorHandler: {
          error: () => ({ action: 1 }),
          closed: () => ({ action: 1 }),
        },
      },
      messageTransports: {
        reader: new IpcMessageReader(),
        writer: new IpcMessageWriter(),
      },
    });

    connection.listen();
    languageClient.start();

    return () => {
      languageClient.stop();
      connection.dispose();
    };
  }, []);
}

export const EditorPlayground: React.FC = () => {
  const { currentFile, onUpdateCurrentFile } = useCurrentProject();
  const value = useMemo<string>(() => currentFile?.content || "", [currentFile]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useRobinLsp();

  function handleEditorDidMount(ref: editor.IStandaloneCodeEditor, monacoInstance: Monaco) {
    monacoInstance.languages.register({ id: "wren" });
    monacoInstance.languages.setMonarchTokensProvider("wren", wrenTokensProvider);
    monacoInstance.languages.setLanguageConfiguration("wren", wrenLanguageConfig);
    monacoInstance.editor.defineTheme("wren-studio", WrenStudioTheme);
    monacoInstance.editor.setTheme("wren-studio");

    editorRef.current = ref;
  }

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="wren"
      theme="wren-studio"
      path={currentFile?.path}
      value={value}
      onChange={(val) => onUpdateCurrentFile(val)}
      onMount={handleEditorDidMount}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        bracketPairColorization: {
          enabled: false,
        },
      }}
    />
  );
};
