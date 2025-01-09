import { ComponentProps } from "react";
import { HnExpressionNode } from "@shared/types";
import { Sidebar } from "@renderer/components/ui/sidebar";

export type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  rootPath: string | undefined;
  fileTree: HnExpressionNode | undefined;
};
