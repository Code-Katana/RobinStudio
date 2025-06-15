import { Editor } from "@monaco-editor/react";
import { useLanguageClient } from "@renderer/hooks/use-languageclient";
import { useEffect, useState } from "react";
import { llvmIrLanguageConfig, llvmIrTokensProvider } from "@renderer/languages/llvm-ir";
import { WrenStudioLightTheme, WrenStudioTheme } from "@renderer/languages/wren";

type IntermediateRepresentationResponse = {
  generated: boolean;
  outputDocument: string;
};

async function openIrFile(outputDocument: string) {
  const file = await window.fs.openFileByPath({ path: outputDocument });
  if (!file) return undefined;
  return file.content;
}

export const IntermediateRepresentationPanel = () => {
  const response = useLanguageClient("compilerAction/ir");
  const [code, setCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!response) return;
    const result = response.result as IntermediateRepresentationResponse;
    if (!result.generated) return;
    openIrFile(result.outputDocument).then(setCode);
    console.log(code);
  }, [response]);

  return (
    <Editor
      key={code ? "llvm-ir-loaded" : "llvm-ir-empty"}
      height="100vh"
      width="100%"
      defaultLanguage="llvm-ir"
      path={(response?.result as IntermediateRepresentationResponse)?.outputDocument}
      theme={
        document.documentElement.classList.contains("dark") ? "wren-studio" : "wren-studio-light"
      }
      value={code}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        bracketPairColorization: {
          enabled: false,
        },
      }}
      onMount={(_, monaco) => {
        if (!monaco.languages.getLanguages().some((lang) => lang.id === "llvm-ir")) {
          monaco.languages.register({ id: "llvm-ir" });
          monaco.languages.setMonarchTokensProvider("llvm-ir", llvmIrTokensProvider);
          monaco.languages.setLanguageConfiguration("llvm-ir", llvmIrLanguageConfig);
          monaco.editor.defineTheme("llvm-ir", WrenStudioTheme);
          monaco.editor.defineTheme("llvm-ir-light", WrenStudioLightTheme);
        }
      }}
    />
  );
};
