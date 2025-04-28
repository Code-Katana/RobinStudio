import { Cross2Icon, BoxIcon, MinusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { useAppSettings } from "@renderer/hooks/use-app-settings";
import { ScannerOptions } from "@shared/types";
import RobinLogo from "@renderer/assets/images/rbnLogo.jpg";
import {
  OutputRightOn,
  OutputRightOff,
  Separator,
  SidebarLeftOn,
  SidebarLeftOff,
  Settings,
  Run,
  Phases,
} from "@renderer/assets/icons";
import { useState } from "react";
import { FileFinder } from "@renderer/components/file-finder";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useSidebar } from "@renderer/components/ui/sidebar";
import { FileOperations } from "@renderer/components/file-operation";

interface TitleBarProps {
  onOutputVisibilityChange: (visible: boolean) => void;
  onPhaseChange: (phase: CompilerPhase | null) => void;
}

type CompilerPhase =
  | "tokenize"
  | "parse"
  | "typecheck"
  | "ir-generation"
  | "ir-optimization"
  | "compile";

export const TitleBar: React.FC<TitleBarProps> = ({ onOutputVisibilityChange, onPhaseChange }) => {
  const { projectName } = useCurrentProject();
  const { direction, scannerOption, setDirection, setScannerOption } = useAppSettings();
  const { state, toggleSidebar } = useSidebar();
  const [isOutputVisible, setIsOutputVisible] = useState(true);
  const [isSettingsClicked, setIsSettingsClicked] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<CompilerPhase | null>(null);
  const [isPhasesOpen, setIsPhasesOpen] = useState(false);

  function handleCloseWindow(): void {
    window.electron.closeWindow();
  }

  function handleMinimizeWindow(): void {
    window.electron.minimizeWindow();
  }
  function handleMaximizeWindow(): void {
    window.electron.maximizeWindow();
  }

  const iconSize = "w-5 h-5";

  const toggleOutput = () => {
    const newVisibility = !isOutputVisible;
    setIsOutputVisible(newVisibility);
    onOutputVisibilityChange(newVisibility);
  };

  const handleSettingsClick = () => {
    setIsSettingsClicked(!isSettingsClicked);
  };

  const handlePhaseSelect = (phase: CompilerPhase) => {
    setSelectedPhase(phase);
    onPhaseChange(phase);
    setIsPhasesOpen(false);
  };

  const handleRun = () => {
    if (!selectedPhase) {
      alert("Please select a phase first");
      return;
    }
    // TODO: Implement phase execution logic
    console.log("Running phase:", selectedPhase);
  };

  return (
    <nav className="z-50 flex w-full items-start justify-between gap-4 shadow-md app-drag *:app-no-drag">
      <div className="flex items-center justify-center gap-4 p-2">
        <div className="flex items-center gap-2 text-sm">
          <img src={RobinLogo} alt="Robin Logo" className="h-6 w-6 rounded-sm" />
          <span>
            <p>{projectName || "RobinStudio"}</p>
          </span>
          <div
            className={cn(
              "flex items-center",
              !projectName && "pointer-events-none select-none opacity-0",
            )}
          >
            <FileOperations />
          </div>

          <div
            className={cn(
              "flex items-center gap-2",
              !projectName && "pointer-events-none select-none opacity-0",
            )}
          >
            <Separator className={cn("text-neutral-600", iconSize)} />
            <FileFinder />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "m-2 flex gap-[2px] overflow-hidden rounded-lg border",
          !projectName && "pointer-events-none select-none opacity-0",
        )}
      >
        <Button className="flex rounded-none border-none bg-secondary/50" onClick={handleRun}>
          <Run />
          <span>Run</span>
        </Button>
        <Popover open={isPhasesOpen} onOpenChange={setIsPhasesOpen}>
          <PopoverTrigger asChild>
            <Button className="rounded-none border-none bg-secondary/50">
              <Phases />
              <span>Phases</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="space-y-1">
              <Button
                variant={selectedPhase === "tokenize" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect("tokenize")}
              >
                <span>Tokenize</span>
                <span className="text-xs text-muted-foreground">Lexical Analysis</span>
              </Button>
              <Button
                variant={selectedPhase === "parse" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect("parse")}
              >
                <span>Parse</span>
                <span className="text-xs text-muted-foreground">Syntax Analysis</span>
              </Button>
              <Button
                variant={selectedPhase === "typecheck" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect("typecheck")}
              >
                <span>Typecheck</span>
                <span className="text-xs text-muted-foreground">Semantic Analysis</span>
              </Button>
              <Button
                variant={selectedPhase === "ir-generation" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect("ir-generation")}
              >
                <span>IR Generation</span>
                <span className="text-xs text-muted-foreground">intermediate represenation</span>
              </Button>
              <Button
                variant={selectedPhase === "ir-optimization" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect("ir-optimization")}
              >
                <span>IR Optimization</span>
                <span className="text-xs text-muted-foreground">Optimize the IR Code</span>
              </Button>
              <Button
                variant={selectedPhase === "compile" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handlePhaseSelect("compile")}
              >
                <span>Compile</span>
                <span className="text-xs text-muted-foreground">Get Executable</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <div className="flex w-fit items-center justify-center rounded-bl-lg border-8 border-r-0 border-t-0 border-secondary/50 bg-secondary/50 pl-2">
          <div className="flex items-center gap-3">
            <div onClick={toggleSidebar} className="cursor-pointer">
              {state === "expanded" ? <SidebarLeftOn /> : <SidebarLeftOff />}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <HamburgerMenuIcon />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 translate-x-4">
                <DropdownMenuLabel>Editor Layout</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={direction}>
                  <DropdownMenuRadioItem value="vertical" onClick={() => setDirection("vertical")}>
                    Vertical
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="horizontal"
                    onClick={() => setDirection("horizontal")}
                  >
                    Horizontal
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Scanner Options</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={scannerOption}>
                  <DropdownMenuRadioItem
                    value="FA"
                    onClick={() => setScannerOption(ScannerOptions.FA)}
                  >
                    Finite Automaton
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="handCoded"
                    onClick={() => setScannerOption(ScannerOptions.HandCoded)}
                  >
                    Hand Coded
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div onClick={toggleOutput} className="cursor-pointer">
              {isOutputVisible ? <OutputRightOn /> : <OutputRightOff />}
            </div>

            <Settings
              className={cn(
                "h-5 w-5 cursor-pointer transition-transform duration-300",
                isSettingsClicked ? "-rotate-45" : "",
              )}
              onClick={handleSettingsClick}
            />
          </div>
          <Separator className={cn("mx-1 text-neutral-600", iconSize)} />
          <Button
            className="rounded-none p-3 hover:bg-primary"
            variant="ghost"
            onClick={handleMinimizeWindow}
          >
            <MinusIcon />
          </Button>
          <Button
            className="rounded-none p-3 hover:bg-primary"
            variant="ghost"
            onClick={handleMaximizeWindow}
          >
            <BoxIcon />
          </Button>
          <Button
            className="rounded-none p-3 hover:bg-red-600"
            variant="ghost"
            onClick={handleCloseWindow}
          >
            <Cross2Icon />
          </Button>
        </div>
      </div>
    </nav>
  );
};
