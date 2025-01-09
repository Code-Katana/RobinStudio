import { Cross2Icon, BoxIcon, MinusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { ITitleBarProps } from "../interfaces/navigation-bar.props";

export const TitleBar = ({
  scannerOption,
  setScannerOption,
  direction,
  setDirection,
}: ITitleBarProps): JSX.Element => {
  function handleCloseWindow(): void {
    window.electron.closeWindow();
  }

  function handleMinimizeWindow(): void {
    window.electron.minimizeWindow();
  }
  function handleMaximizeWindow(): void {
    window.electron.maximizeWindow();
  }

  return (
    <nav className="flex justify-between gap-4 bg-secondary/50 shadow-md app-drag *:app-no-drag">
      <div className="flex items-center justify-center gap-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <HamburgerMenuIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 translate-x-4">
            <DropdownMenuLabel>Editor Layout</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={direction} onValueChange={setDirection}>
              <DropdownMenuRadioItem value="vertical">Vertical</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="horizontal">Horizontal</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Scanner Options</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={scannerOption} onValueChange={setScannerOption}>
              <DropdownMenuRadioItem value="FA">Finite Automaton</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="handCoded">Hand Coded</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="pointer-events-none flex select-none items-center justify-center gap-0.5 text-sm font-bold">
          <span>Wren</span>
          <span className="rounded-md bg-primary px-1 py-px">Studio</span>
        </div>
      </div>

      <div>
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
    </nav>
  );
};
