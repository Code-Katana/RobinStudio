import { useEffect, useState } from "react";
import { useLanguageClient } from "@renderer/hooks/use-languageclient";

type CompileResponse = {
  compiled: boolean;
  outputDocument: string;
};

export const CompilePanel = () => {
  const response = useLanguageClient("compilerAction/compile");

  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [exitCode, setExitCode] = useState<number | null>(null);

  useEffect(() => {
    if (!response) return;

    const { compiled, outputDocument } = response.result as CompileResponse;
    if (!compiled) return;

    setStatus("running");
    window.fs.launch(outputDocument).then((code) => {
      setExitCode(code);
      setStatus("done");
    });
  }, [response]);

  return (
    <div className="p-4 font-mono text-sm">
      {response === undefined && status === "idle" && (
        <div className="text-muted-foreground">
          Open a file and press <strong>Run</strong> to start compiling...
        </div>
      )}

      {status === "running" && (
        <div className="animate-pulse text-blue-500">
          Running<span className="inline-block animate-bounce">...</span>
        </div>
      )}

      {status === "done" && (
        <div className="text-green-600">
          Finished with exit code: <strong>{exitCode}</strong>
        </div>
      )}
    </div>
  );
};
