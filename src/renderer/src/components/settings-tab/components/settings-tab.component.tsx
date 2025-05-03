import { Button } from "@renderer/components/ui/button";
import { useAppSettings } from "@renderer/hooks/use-app-settings";
import { ScannerOptions } from "@shared/types";
import { TabsContent } from "@renderer/components/ui/tabs";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn } from "@renderer/lib/utils";
interface SettingsTabProps {
  value: string;
  className?: string;
}

export const SettingsTab = ({ value, className }: SettingsTabProps) => {
  const { direction, scannerOption, setDirection, setScannerOption } = useAppSettings();

  return (
    <TabsContent value={value} className={cn("flex h-full w-full flex-grow", className)}>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-4">
            <div className="h-full rounded-lg border p-4">
              <h3 className="mb-4 font-medium text-primary">Editor Settings</h3>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Editor Layout</h2>
                <div className="flex gap-2">
                  <Button
                    variant={direction === "vertical" ? "default" : "outline"}
                    onClick={() => setDirection("vertical")}
                  >
                    Vertical
                  </Button>
                  <Button
                    variant={direction === "horizontal" ? "default" : "outline"}
                    onClick={() => setDirection("horizontal")}
                  >
                    Horizontal
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Scanner Options</h2>
                <div className="flex gap-2">
                  <Button
                    variant={scannerOption === ScannerOptions.FA ? "default" : "outline"}
                    onClick={() => setScannerOption(ScannerOptions.FA)}
                  >
                    Finite Automaton
                  </Button>
                  <Button
                    variant={scannerOption === ScannerOptions.HandCoded ? "default" : "outline"}
                    onClick={() => setScannerOption(ScannerOptions.HandCoded)}
                  >
                    Hand Coded
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
};
