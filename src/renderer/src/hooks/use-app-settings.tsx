// import { useContext } from "react";
import {
  AppSettingsContext,
  AppSettingsContextType,
} from "@renderer/providers/app-settings.provider";
import { useCustomContext } from "./use-custom-context";

export const useAppSettings = () =>
  useCustomContext<AppSettingsContextType>(
    AppSettingsContext,
    "useAppSettings",
    "AppSettingsProvider",
  );
