import { OnMount } from "@monaco-editor/react";
import { wrenLanguageConfig, WrenStudioTheme, wrenTokensProvider } from "@renderer/languages/wren";

export const useEditorDidMount = (): [OnMount] => {
  const handler: OnMount = (_, monacoInstance) => {
    monacoInstance.languages.register({ id: "wren" });

    monacoInstance.languages.setMonarchTokensProvider("wren", wrenTokensProvider);

    monacoInstance.languages.setLanguageConfiguration("wren", wrenLanguageConfig);

    monacoInstance.editor.defineTheme("wren-studio", WrenStudioTheme);
    monacoInstance.editor.setTheme("wren-studio");
  };

  return [handler];
};
