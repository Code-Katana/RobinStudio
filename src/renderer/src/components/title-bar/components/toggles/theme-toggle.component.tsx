import { DarkThemeIcon, LightThemeIcon } from "@renderer/assets/icons";
import { useAppTheme } from "@renderer/hooks/use-app-theme";
import { useToggleIconState } from "@renderer/hooks/use-toggle-icon-state";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppTheme();
  const { icon, toggle } = useToggleIconState({
    activeIcon: <DarkThemeIcon />,
    inactiveIcon: <LightThemeIcon />,
  });

  function handleClick() {
    toggleTheme();
    toggle();
  }

  return (
    <button onClick={handleClick} className="cursor-pointer rounded-md p-1 hover:bg-primary/30">
      {icon}
      <span className="sr-only">Toggle theme current theme: {theme}</span>
    </button>
  );
};
