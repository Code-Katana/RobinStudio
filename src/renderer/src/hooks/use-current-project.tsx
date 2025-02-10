import {
  CurrentProjectContext,
  CurrentProjectContextType,
} from "@renderer/providers/current-project.provider";
import { useCustomContext } from "./use-custom-context";

export const useCurrentProject = () =>
  useCustomContext<CurrentProjectContextType>(
    CurrentProjectContext,
    "useCurrentProject",
    "CurrentProjectProvider",
  );
