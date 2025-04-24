import { PropsWithChildren } from "react";

import { SidebarProvider } from "@renderer/components/ui/sidebar";
import { DndProvider } from "react-dnd/dist";
import { HTML5Backend } from "react-dnd-html5-backend";

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <SidebarProvider>{children}</SidebarProvider>
      </DndProvider>
    </>
  );
};
