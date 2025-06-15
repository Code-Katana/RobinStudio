import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { useMemo, useRef } from "react";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useEditorDidMount } from "@renderer/hooks/use-editor-did-mount";

export const EditorPlayground: React.FC = () => {
  const { currentFile, onUpdateCurrentFile } = useCurrentProject();

  const value = useMemo<string>(() => currentFile?.content || "", [currentFile]);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handler = useEditorDidMount({ editorRef, monacoRef });

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="wren"
      theme={
        document.documentElement.classList.contains("dark") ? "wren-studio" : "wren-studio-light"
      }
      path={currentFile?.path}
      value={value}
      onChange={(val) => onUpdateCurrentFile(val)}
      onMount={handler}
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
