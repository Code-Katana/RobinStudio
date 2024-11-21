import { EditorPlayground } from "@renderer/components/editor-playground";
import { Button } from "./components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { TokenizeResponse } from "@shared/channels";
import { useState } from "react";
import { ScannerOptions } from "@shared/types";

const programExample: string = 'program say_hello is\nbegin\n  write "Hello, Wren!";\nend\n';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(programExample);

  async function handleTest(): Promise<void> {
    const response: TokenizeResponse = await window.api.tokenize({
      scanner: ScannerOptions.FA,
      source: code,
    });

    console.log(response);
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
    <ResizablePanelGroup direction="horizontal" className="min-h-svh font-mono">
      <ResizablePanel defaultSize={50}>
        <EditorPlayground source={code} onChange={handleCodeUpdate} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <section className="grid min-h-full place-content-center gap-4 bg-secondary text-primary">
          <h2>Tokenizing is coming soon.</h2>
          <Button onClick={handleTest}>Test</Button>
        </section>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default App;
