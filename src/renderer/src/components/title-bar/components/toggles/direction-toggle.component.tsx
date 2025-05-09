import { DirectionHorizontalIcon, DirectionVerticalIcon } from "@renderer/assets/icons";
import { useAppSettings } from "@renderer/hooks/use-app-settings";
import { useToggleIconState } from "@renderer/hooks/use-toggle-icon-state";

export const DirectionToggle = () => {
  const { direction, setDirection } = useAppSettings();

  const { icon, toggle } = useToggleIconState({
    activeIcon: <DirectionHorizontalIcon />,
    inactiveIcon: <DirectionVerticalIcon />,
    initialState: direction === "horizontal",
  });

  function handleClick() {
    toggle();
    setDirection(direction === "horizontal" ? "vertical" : "horizontal");
  }

  return (
    <button onClick={handleClick} className="cursor-pointer rounded-md p-1 hover:bg-primary/30">
      {icon}
      <span className="sr-only">Toggle direction</span>
    </button>
  );
};
