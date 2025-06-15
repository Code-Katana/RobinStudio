import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { usePanel } from "../hooks/use-panel.hook";

export const OutputPanel = () => {
  const panel = usePanel();

  return <ScrollArea className="h-full">{panel}</ScrollArea>;
};
