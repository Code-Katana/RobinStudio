import { useToggleIconState } from "@renderer/hooks/use-toggle-icon-state";
import { OutputOffIcon, OutputOnIcon } from "@renderer/assets/icons";
import { useAppSettings } from "@renderer/hooks/use-app-settings";
import { cn } from "@renderer/lib/utils";

export const OutputToggle = () => {
  const { direction, outputOpen, setOutputOpen } = useAppSettings();
  const { icon, toggle } = useToggleIconState({
    activeIcon: <OutputOnIcon />,
    inactiveIcon: <OutputOffIcon />,
    initialState: outputOpen,
  });

  function handleClick() {
    toggle();
    setOutputOpen(!outputOpen);
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "cursor-pointer rounded-md p-1 transition-all duration-200 hover:bg-primary/30",
        {
          "rotate-90": direction === "vertical",
        },
      )}
    >
      {icon}
      <span className="sr-only">Toggle output</span>
    </button>
  );
};
