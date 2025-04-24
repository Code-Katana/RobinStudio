import { Cross2Icon, BoxIcon, MinusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { twMerge } from "tailwind-merge";
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
import React from "react";
import RobinLogo from "@renderer/assets/images/rbnLogo.jpg";
import { Arrow, Search, Separator } from "@renderer/assets/icons";

export const TitleBar: React.FC = () => {
  const { direction, scannerOption, setDirection, setScannerOption } = useAppSettings();

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

  return (
    <nav className="z-50 flex w-full items-start justify-between gap-4 shadow-md app-drag *:app-no-drag">
      <div className="flex items-center justify-center gap-4 p-3">
        <div className="flex items-center gap-2 text-sm">
          <img src={RobinLogo} alt="Robin Logo" className="h-6 w-6 rounded-sm" />
          <span>
            <p>Project Name</p>
          </span>
          <Arrow className={iconSize} />

          <Separator className={twMerge("mx-1 text-neutral-600", iconSize)} />
          <Search className={twMerge("text-neutral-600", iconSize)} />

          <span>
            <p className="text-sm text-neutral-600">Search File</p>
          </span>
        </div>
      </div>
      <div>
        <div className="flex w-fit items-center justify-center rounded-bl-lg border-8 border-r-0 border-t-0 border-secondary/50 bg-secondary/50 pl-2">
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

          <Separator className={twMerge("mx-1 text-neutral-600", iconSize)} />
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
