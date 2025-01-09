import { SidebarProvider } from "@renderer/components/ui/sidebar";
import { CurrentProjectProvider } from "./current-project.provider";

interface IAppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => (
  <CurrentProjectProvider>
    <SidebarProvider>{children}</SidebarProvider>
  </CurrentProjectProvider>
);
