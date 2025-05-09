import { Settings } from "@renderer/assets/icons";
import { useCurrentProject } from "@renderer/hooks/use-current-project";

export const SettingsToggle = () => {
  const { onOpenFile } = useCurrentProject();

  return (
    <button
      onClick={() => onOpenFile("Settings", "settings", "")}
      className="cursor-pointer rounded-md p-1 hover:bg-primary/30"
    >
      <Settings />
    </button>
  );
};
