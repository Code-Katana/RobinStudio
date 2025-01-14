import { useEffect, useState } from "react";
import { EditorPlayground } from "@renderer/components/editor-playground";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { TokenizeResponse } from "@shared/channels";
import { Token } from "@shared/types";
import { TitleBar } from "./components/title-bar";
import { ScrollArea } from "./components/ui/scroll-area";
import { TokensTable } from "./components/tokens-table";
import { Button } from "./components/ui/button";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { useCurrentProject } from "./hooks/use-current-project";
import { useAppSettings } from "./hooks/use-app-settings";
import { Tabs } from "./components/ui/tabs";
import { TabsBar } from "./components/tabs-bar";
import { AbstractSyntaxTree } from "./components/abstract-syntax-tree";

const App: React.FC = () => {
  const { rootPath, fileTree, currentFile, onSaveCurrentFile, onCloseFile } = useCurrentProject();
  const { direction, scannerOption } = useAppSettings();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ast, setAst] = useState<any>({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [output, setOutput] = useState<"tokens" | "tree" | undefined>(undefined);

  function clearOutput() {
    setOutput(undefined);
  }

  async function handleTokenize(): Promise<void> {
    if (!currentFile) {
      return;
    }

    await handleSaveFile();
    setOutput("tokens");

    const response: TokenizeResponse = await window.api.tokenize({
      scanner: scannerOption,
      source: currentFile.path,
    });

    setTokens(response.tokens);
  }

  async function handleParse(): Promise<void> {
    if (!currentFile) {
      return;
    }

    await handleSaveFile();
    setOutput("tree");

    const response = await window.api.parse({
      source: currentFile.path,
    });

    setAst(response.ast);
  }

  async function handleSaveFile(): Promise<void> {
    if (!currentFile) {
      return;
    }

    await window.fs.saveFile({
      path: currentFile.path,
      content: currentFile.content,
    });

    onSaveCurrentFile();
  }

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        await handleSaveFile();
      }

      if (event.key === "w" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (currentFile) {
          onCloseFile(currentFile.path);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentFile]);

  return (
    <>
      <AppSidebar rootPath={rootPath} fileTree={fileTree} />
      <SidebarInset>
        <TitleBar />
        <Tabs value={currentFile?.path} className="grid">
          <TabsBar />
          <main className="relative grid h-svh w-full grid-rows-1">
            <section className="absolute inset-0">
              <ResizablePanelGroup direction={direction} className="h-svh font-mono">
                <ResizablePanel defaultSize={50}>
                  <ResizablePanelGroup direction="horizontal">
                    {currentFile && <EditorPlayground />}
                  </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <ScrollArea className="relative h-svh">
                    <header className="flex flex-row-reverse items-center gap-2 px-6 py-4">
                      <Button size="sm" onClick={handleTokenize}>
                        Tokenize
                      </Button>
                      <Button size="sm" onClick={handleParse}>
                        Parse
                      </Button>
                      <Button size="sm" onClick={clearOutput}>
                        Clear
                      </Button>
                    </header>

                    {currentFile ? (
                      <>
                        {output === "tokens" && (
                          <TokensTable tokens={tokens} scannerOption={scannerOption} />
                        )}
                        {output === "tree" && <AbstractSyntaxTree ast={ast} />}
                      </>
                    ) : (
                      <p className="pt-12 text-center">Write some code & Click tokenize</p>
                    )}
                  </ScrollArea>
                </ResizablePanel>
              </ResizablePanelGroup>
            </section>
          </main>
        </Tabs>
      </SidebarInset>
    </>
  );
};

export default App;
