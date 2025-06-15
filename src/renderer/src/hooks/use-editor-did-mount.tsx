import {
  wrenLanguageConfig,
  WrenStudioTheme,
  WrenStudioLightTheme,
  wrenTokensProvider,
} from "@renderer/languages/wren";
import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/react";
import { useAppTheme } from "./use-app-theme";

type useEditorDidMountParams = {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
};

type useEditorDidMountReturn = (ref: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => void;

export const useEditorDidMount = (params: useEditorDidMountParams): useEditorDidMountReturn => {
  const { editorRef, monacoRef } = params;
  const { theme } = useAppTheme();

  const handler = (ref: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
    monacoInstance.languages.register({ id: "wren" });
    monacoInstance.languages.setLanguageConfiguration("wren", wrenLanguageConfig);
    monacoInstance.languages.setMonarchTokensProvider("wren", wrenTokensProvider);

    // Register both themes
    monacoInstance.editor.defineTheme("wren-studio", WrenStudioTheme);
    monacoInstance.editor.defineTheme("wren-studio-light", WrenStudioLightTheme);

    // Set initial theme based on current app theme
    monacoInstance.editor.setTheme(theme === "dark" ? "wren-studio" : "wren-studio-light");

    editorRef.current = ref;
    monacoRef.current = monacoInstance;
  };

  return handler;
};
