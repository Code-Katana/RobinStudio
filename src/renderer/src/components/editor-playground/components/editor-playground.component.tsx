import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { useMemo, useRef, useEffect } from "react";
import {
  wrenLanguageConfig,
  WrenStudioTheme,
  WrenStudioLightTheme,
  wrenTokensProvider,
} from "@renderer/languages/wren";
import { useCurrentProject } from "@renderer/hooks/use-current-project";

export const EditorPlayground: React.FC = () => {
  const { currentFile, onUpdateCurrentFile } = useCurrentProject();

  const value = useMemo<string>(() => currentFile?.content || "", [currentFile]);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  function handleEditorDidMount(ref: editor.IStandaloneCodeEditor, monacoInstance: Monaco) {
    monacoInstance.languages.register({ id: "wren" });
    monacoInstance.languages.setMonarchTokensProvider("wren", wrenTokensProvider);
    monacoInstance.languages.setLanguageConfiguration("wren", wrenLanguageConfig);

    // Register both themes
    monacoInstance.editor.defineTheme("wren-studio", WrenStudioTheme);
    monacoInstance.editor.defineTheme("wren-studio-light", WrenStudioLightTheme);

    // Set initial theme based on current app theme
    const isDark = document.documentElement.classList.contains("dark");
    monacoInstance.editor.setTheme(isDark ? "wren-studio" : "wren-studio-light");

    editorRef.current = ref;
    monacoRef.current = monacoInstance;
  }

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          if (monacoRef.current) {
            // Update Monaco editor theme based on app theme
            const theme = isDark ? "wren-studio" : "wren-studio-light";
            monacoRef.current.editor.setTheme(theme);
          }
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

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
