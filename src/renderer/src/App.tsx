import { useState } from "react";
import { EditorPlayground } from "@renderer/components/editor-playground";
import { Button } from "./components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { TokenizeResponse } from "@shared/channels";
import { ScannerOptions, Token } from "@shared/types";

const App: React.FC = () => {
  const [code, setCode] = useState<string>("var x: float = 6.8;");
  const [scOption, setScOption] = useState<ScannerOptions>(ScannerOptions.FA);
  const [tokens, setTokens] = useState<Token[]>([]);

  async function handleTest(): Promise<void> {
    const response: TokenizeResponse = await window.api.tokenize({
      scanner: ScannerOptions.FA,
      source: code,
    });

    setTokens(response.tokens);
  }

  function handleCodeUpdate(val: string | undefined): void {
    if (val === undefined) {
      setCode("");
      return;
    }

    setCode(val);
    console.log(val);
  }

  function handleScannerOptionToggle(): void {
    setScOption((op) => (op === ScannerOptions.FA ? ScannerOptions.HandCoded : ScannerOptions.FA));
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-svh font-mono">
      <ResizablePanel defaultSize={50}>
        <EditorPlayground source={code} onChange={handleCodeUpdate} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <section className="grid min-h-full place-content-center gap-4 bg-secondary text-primary">
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className="col-span-3 text-lg"
              onClick={handleScannerOptionToggle}
            >
              {scOption === ScannerOptions.FA ? "Finite Automaton" : "Hand Coded"}
            </Button>
            <Button onClick={handleTest}>Tokenize</Button>
          </div>

          <ul className="flex flex-col gap-2">
            {tokens.map((tk, idx) => (
              <li
                key={idx}
                className="*:p-x-1 grid w-96 grid-cols-6 divide-x-2 divide-border rounded-md border border-border p-2 text-center"
              >
                <span>{tk.value}</span>
                <span className="col-span-2 text-sm">{tk.type}</span>
                <span>{tk.line}</span>
                <span>{tk.start}</span>
                <span>{tk.end}</span>
              </li>
            ))}
          </ul>
        </section>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default App;
