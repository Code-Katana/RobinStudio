import { useState } from "react";
import { EditorPlayground } from "@renderer/components/editor-playground";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { TokenizeResponse } from "@shared/channels";
import { ScannerOptions, Token } from "@shared/types";
import { TitleBar } from "./components/title-bar";
import { ScrollArea } from "./components/ui/scroll-area";
import { TokensTable } from "./components/tokens-table";
import { Button } from "./components/ui/button";
import { helloWorldProgram } from "./constants";

const App: React.FC = () => {
  const [code, setCode] = useState<string>(helloWorldProgram);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [scannerOption, setScannerOption] = useState<"FA" | "handCoded">("FA");

  async function handleTokenize(): Promise<void> {
    const response: TokenizeResponse = await window.api.tokenize({
      scanner: ScannerOptions[scannerOption],
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

  return (
    <>
      <TitleBar
        scannerOption={scannerOption}
        setScannerOption={setScannerOption as (opt: string) => void}
        direction={direction}
        setDirection={setDirection as (dir: string) => void}
      />
      <main className="relative grid h-svh w-full grid-rows-1">
        <ResizablePanelGroup direction={direction} className="h-svh font-mono">
          <ResizablePanel defaultSize={50}>
            <EditorPlayground source={code} onChange={handleCodeUpdate} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <ScrollArea className="relative h-svh">
              {tokens.length ? (
                <TokensTable tokens={tokens} scannerOption={scannerOption} />
              ) : (
                <p className="absolute inset-1/2 w-max -translate-x-1/2 -translate-y-1/2">
                  Write some code & Click tokenize
                </p>
              )}
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>

        <Button className="fixed bottom-8 right-8" onClick={handleTokenize}>
          Tokenize
        </Button>
      </main>
    </>
  );
};

export default App;
