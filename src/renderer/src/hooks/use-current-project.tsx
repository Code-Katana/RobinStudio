import { CurrentProjectContext } from "@renderer/providers/current-project.provider";
import { useContext } from "react";

export const useCurrentProject = () => {
  const context = useContext(CurrentProjectContext);

  if (!context) {
    throw new Error("useCurrentProject hook must be used within a CurrentProjectProvider");
  }

  return context;
};
