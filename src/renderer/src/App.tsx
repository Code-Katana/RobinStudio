import { useEffect, useState } from "react";
import { EditorPlayground } from "@renderer/components/editor-playground";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { FileEvent } from "@shared/types";
import { TitleBar } from "./components/title-bar";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { Tabs } from "./components/ui/tabs";
import { TabsBar } from "./components/tabs-bar";
import { useCurrentProjectStore } from "./stores/current-project.store";
import { useAppSettingsStore } from "./stores/app-settings.store";
import { SettingsTab } from "@renderer/components/settings-tab";
import { WelcomeTab } from "./components/welcome-tab";
import { OutputPanel } from "./components/output-panel";

const App: React.FC = () => {
  const { rootPath, fileTree, currentFile, onCloseFile, onCloseProject, onOpenFile } =
    useCurrentProjectStore();
  const { direction, outputOpen } = useAppSettingsStore();
  const [events, setEvents] = useState<FileEvent[]>([]);
  const [, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    onOpenFile("Welcome", "welcome", "");
  }, []);

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

  return (
    <>
      <div className="container flex flex-col p-0">
        <TitleBar />
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

                  {outputOpen && (
                    <>
                      <ResizableHandle className="w-1.5" withHandle />
                      <ResizablePanel className="rounded-lg bg-secondary" defaultSize={50}>
                        <OutputPanel />
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
