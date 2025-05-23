import { OutputToggle } from "./toggles/output-toggle.component";
import { SettingsToggle } from "./toggles/settings-toggle.component";
import { SidebarToggle } from "./toggles/sidebar-toggle.component";
import { ThemeToggle } from "./toggles";
import { WindowActions } from "./window-actions.components";
import { DirectionToggle } from "./toggles/direction-toggle.component";

export const TitleBarAction = () => {
  return (
    <div>
      <div className="flex w-fit gap-4 rounded-bl-lg bg-secondary/50">
        <div className="flex items-center gap-2 py-2 pl-4">
          <ThemeToggle />
          <SidebarToggle />
          <OutputToggle />
          <DirectionToggle />
          <SettingsToggle />
        </div>

        <div className="grid grid-cols-3">
          <WindowActions />
        </div>
      </div>
    </div>
  );
};
