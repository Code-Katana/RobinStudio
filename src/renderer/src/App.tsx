import { useEffect, useState } from "react";
import { EditorPlayground } from "@renderer/components/editor-playground";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { TokenizeResponse } from "@shared/channels";
import { FileEvent, Token } from "@shared/types";
import { TitleBar } from "./components/title-bar";
import { ScrollArea } from "./components/ui/scroll-area";
import { TokensTable } from "./components/tokens-table";
import { Button } from "./components/ui/button";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { Tabs } from "./components/ui/tabs";
import { TabsBar } from "./components/tabs-bar";
import { AbstractSyntaxTree } from "./components/abstract-syntax-tree";
import { useCurrentProjectStore } from "./stores/current-project.store";
import { useAppSettingsStore } from "./stores/app-settings.store";
import { SettingsTab } from "@renderer/components/settings-tab";
import { WelcomeTab } from "./components/welcome-tab";

type CompilerPhase =
  | "tokenize"
  | "parse"
  | "typecheck"
  | "ir-generation"
  | "ir-optimization"
  | "compile";

const App: React.FC = () => {
  const { rootPath, fileTree, currentFile, onCloseFile, onCloseProject, onOpenFile } =
    useCurrentProjectStore();
  const { direction, scannerOption } = useAppSettingsStore();
  const [isOutputVisible, setIsOutputVisible] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<CompilerPhase | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ast, setAst] = useState<any>({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [output, setOutput] = useState<"tokens" | "tree" | "file-events" | undefined>(undefined);
  const [events, setEvents] = useState<FileEvent[]>([]);
  const [, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    onOpenFile("Welcome", "welcome", "");
  }, []);

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

      if (event.ctrlKey || event.metaKey) {
        const key = event.key.toLowerCase();
        setKeySequence((prev) => {
          const newSequence = [...prev, key].slice(-2);
          if (newSequence.length >= 2 && newSequence[0] === "n" && newSequence[1] === "k") {
            event.preventDefault();
            onCloseProject();
            return [];
          }
          return newSequence;
        });
      }
    };

    const handleKeyUp = () => {
      setKeySequence([]);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentFile]);

  useEffect(() => {
    window.electronWatcher.onFileEvent((data: FileEvent) => {
      setEvents((prev) => [...prev, data]);
      events.forEach((event) => {
        console.log(`[${event.type}] ${event.path}`);
      });
    });
  }, [events]);

  const handlePhaseChange = (phase: CompilerPhase | null) => {
    setSelectedPhase(phase);
    if (phase) {
      setOutput(undefined);
    }
  };

  return (
    <>
      <div className="container flex flex-col p-0">
        <TitleBar onOutputVisibilityChange={setIsOutputVisible} onPhaseChange={handlePhaseChange} />
        <div className="main-container flex justify-between gap-2">
          <AppSidebar rootPath={rootPath} fileTree={fileTree} className="mt-[52px]" />
          <SidebarInset>
            <main className="relative grid h-svh w-full grid-rows-1">
              <section className="absolute inset-0">
                <ResizablePanelGroup direction={direction} className="h-svh font-mono">
                  <ResizablePanel className="rounded-lg bg-secondary" defaultSize={50}>
                    {currentFile && (
                      <Tabs value={currentFile.path} className="h-full">
                        <TabsBar />
                        <ResizablePanelGroup direction="horizontal">
                          {currentFile.path === "settings" ? (
                            <SettingsTab className="w-full" value="settings" />
                          ) : currentFile.path === "welcome" ? (
                            <WelcomeTab className="w-full" value="welcome" />
                          ) : (
                            <EditorPlayground />
                          )}
                        </ResizablePanelGroup>
                      </Tabs>
                    )}
                  </ResizablePanel>

                  {isOutputVisible && (
                    <>
                      <ResizableHandle className="w-1.5" withHandle />
                      <ResizablePanel className="rounded-lg bg-secondary" defaultSize={50}>
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

                          {selectedPhase && (
                            <div className="px-6 py-2">
                              <h3 className="text-lg font-semibold">Selected Phase:</h3>
                              <p className="text-muted-foreground">
                                {selectedPhase === "tokenize" && "Tokenize (Lexical Analysis)"}
                                {selectedPhase === "parse" && "Parse (Syntax Analysis)"}
                                {selectedPhase === "typecheck" && "Typecheck (Semantic Analysis)"}
                                {selectedPhase === "ir-generation" && "IR Generation"}
                                {selectedPhase === "ir-optimization" && "IR Optimization"}
                                {selectedPhase === "compile" && "Compile (Get Executable)"}
                              </p>
                            </div>
                          )}

                          {currentFile ? (
                            <>
                              {output === "tokens" && (
                                <TokensTable tokens={tokens} scannerOption={scannerOption} />
                              )}
                              {output === "tree" && <AbstractSyntaxTree ast={ast} />}
                            </>
                          ) : (
                            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                              <p className="text-center text-muted-foreground">
                                Write some code & Click tokenize
                              </p>
                            </div>
                          )}
                        </ScrollArea>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </section>
            </main>
          </SidebarInset>
        </div>
      </div>
    </>
  );
};

export default App;
