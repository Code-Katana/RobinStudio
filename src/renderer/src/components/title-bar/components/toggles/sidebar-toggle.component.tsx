import { SidebarOffIcon, SidebarOnIcon } from "@renderer/assets/icons";
import { useSidebar } from "@renderer/components/ui/sidebar";
import { useToggleIconState } from "@renderer/hooks/use-toggle-icon-state";

export const SidebarToggle = () => {
  const { state, toggleSidebar } = useSidebar();

  const { icon, toggle } = useToggleIconState({
    activeIcon: <SidebarOnIcon />,
    inactiveIcon: <SidebarOffIcon />,
    initialState: state === "expanded",
  });

  function handleClick() {
    toggleSidebar();
    toggle();
  }

  return (
    <button onClick={handleClick} className="cursor-pointer rounded-md p-1 hover:bg-primary/30">
      {icon}
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
};
