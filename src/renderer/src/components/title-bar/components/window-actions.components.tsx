import { BoxIcon, Cross2Icon, MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";

export const WindowActions = () => {
  return (
    <>
      <Button
        className="rounded-none p-3 hover:bg-primary"
        variant="ghost"
        onClick={() => window.electron.minimizeWindow()}
      >
        <MinusIcon />
      </Button>
      <Button
        className="rounded-none p-3 hover:bg-primary"
        variant="ghost"
        onClick={() => window.electron.maximizeWindow()}
      >
        <BoxIcon />
      </Button>
      <Button
        className="rounded-none p-3 hover:bg-red-600"
        variant="ghost"
        onClick={() => window.electron.closeWindow()}
      >
        <Cross2Icon />
      </Button>
    </>
  );
};
