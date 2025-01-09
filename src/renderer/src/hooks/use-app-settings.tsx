import { useContext } from "react";
import { AppSettingsContext } from "@renderer/providers/app-settings.provider";

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useCurrentProject hook must be used within a CurrentProjectProvider");
  }

  return context;
};
