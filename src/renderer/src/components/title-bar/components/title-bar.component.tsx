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
} from "@renderer/assets/icons";
import { useState } from "react";
import { FileFinder } from "@renderer/components/file-finder";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useSidebar } from "@renderer/components/ui/sidebar";
import { FileOperations } from "@renderer/components/file-operation";

interface TitleBarProps {
  onOutputVisibilityChange: (visible: boolean) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onOutputVisibilityChange }) => {
  const { projectName } = useCurrentProject();
  const { direction, scannerOption, setDirection, setScannerOption } = useAppSettings();

  const { state, toggleSidebar } = useSidebar();
  const [isOutputVisible, setIsOutputVisible] = useState(true);
  const [isSettingsClicked, setIsSettingsClicked] = useState(false);

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
