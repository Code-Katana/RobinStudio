import EditorPlayground from "@renderer/components/EditorPlayground";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";

const App: React.FC = () => {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-svh font-mono">
      <ResizablePanel defaultSize={50}>
        <EditorPlayground />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <section className="grid min-h-full place-content-center bg-secondary text-primary">
          <h2>Tokenizing is coming soon.</h2>
        </section>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default App;
