import { IEditorPlaygroundProps } from "./editor-playground.props";

import Editor from "@monaco-editor/react";
import { useEditorDidMount } from "./use-editor-did-mount.hook";

export const EditorPlayground = ({ source, onChange }: IEditorPlaygroundProps): JSX.Element => {
  const [handleEditorDidMount] = useEditorDidMount();

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="wren"
      theme="wren-studio"
      defaultValue={source}
      onChange={onChange}
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
