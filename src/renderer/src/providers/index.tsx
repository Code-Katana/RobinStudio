import { SidebarProvider } from "@renderer/components/ui/sidebar";
import { CurrentProjectProvider } from "./current-project.provider";
import { AppSettingsProvider } from "./app-settings.provider";

interface IAppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => (
  <AppSettingsProvider>
    <CurrentProjectProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </CurrentProjectProvider>
  </AppSettingsProvider>
);
