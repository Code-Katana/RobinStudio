import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { useRef } from "react";
import { wrenLanguageConfig, WrenStudioTheme, wrenTokensProvider } from "@renderer/languages/wren";
import { useCurrentProject } from "@renderer/hooks/use-current-project";

export const EditorPlayground: React.FC = () => {
  const { currentFile } = useCurrentProject();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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
      value={currentFile?.content}
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
