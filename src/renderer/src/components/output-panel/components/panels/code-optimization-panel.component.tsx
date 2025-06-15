import { DiffEditor } from "@monaco-editor/react";
import { useLanguageClient } from "@renderer/hooks/use-languageclient";
import { useEffect, useState } from "react";
import { llvmIrLanguageConfig, llvmIrTokensProvider } from "@renderer/languages/llvm-ir";
import { WrenStudioLightTheme, WrenStudioTheme } from "@renderer/languages/wren";

type CodeOptimizationResponse = {
  optimized: boolean;
  beforeDocument: string;
  afterDocument: string;
};

async function openGeneratedFiles(beforeDocument: string, afterDocument: string) {
  const beforeFile = await window.fs.openFileByPath({ path: beforeDocument });
  const afterFile = await window.fs.openFileByPath({ path: afterDocument });
  if (!beforeFile || !afterFile) return undefined;
  return { before: beforeFile.content, after: afterFile.content };
}

export const CodeOptimizationPanel = () => {
  const response = useLanguageClient("compilerAction/optimization");
  const [beforeCode, setBeforeCode] = useState<string | undefined>(undefined);
  const [afterCode, setAfterCode] = useState<string | undefined>(undefined);
  const [beforePath, setBeforePath] = useState<string | undefined>(undefined);
  const [afterPath, setAfterPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!response) return;
    const result = response.result as CodeOptimizationResponse;
    if (!result.optimized) return;
    setBeforePath(result.beforeDocument);
    setAfterPath(result.afterDocument);
    openGeneratedFiles(result.beforeDocument, result.afterDocument).then((data) => {
      if (data && data.before && data.after) {
        setBeforeCode(data.before);
        setAfterCode(data.after);
      }
    });
  }, [response]);

  if (
    beforeCode === undefined ||
    afterCode === undefined ||
    beforePath === undefined ||
    afterPath === undefined
  )
    return null;

  return (
    <DiffEditor
      key={beforePath + afterPath}
      height="100vh"
      width="100%"
      original={beforeCode}
      modified={afterCode}
      language="llvm-ir"
      originalModelPath={beforePath}
      modifiedModelPath={afterPath}
      theme={
        document.documentElement.classList.contains("dark") ? "wren-studio" : "wren-studio-light"
      }
      options={{
        renderSideBySide: false,
        readOnly: true,
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
      }}
      onMount={(_, monaco) => {
        if (!monaco.languages.getLanguages().some((lang) => lang.id === "llvm-ir")) {
          monaco.languages.register({ id: "llvm-ir" });
          monaco.languages.setMonarchTokensProvider("llvm-ir", llvmIrTokensProvider);
          monaco.languages.setLanguageConfiguration("llvm-ir", llvmIrLanguageConfig);
          monaco.editor.defineTheme("wren-studio", WrenStudioTheme);
          monaco.editor.defineTheme("wren-studio-light", WrenStudioLightTheme);
        }
      }}
    />
  );
};
