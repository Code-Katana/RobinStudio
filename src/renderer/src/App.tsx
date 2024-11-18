import { Button } from "./components/ui/button";

function App(): JSX.Element {
  return (
    <div className="grid min-h-screen place-content-center">
      <h1 className="flex items-center justify-center gap-1 text-center text-4xl font-bold text-orange-100">
        <Button variant="default">Click Me!</Button>
      </h1>
    </div>
  );
}

export default App;
