import type { Decorator } from "storybook";
import { TooltipProvider } from "../src/components/ui/tooltip.tsx";
import { SidebarProvider } from "../src/components/ui/sidebar.tsx";

export const withTooltipProvider: Decorator = (Story) => (
  <TooltipProvider>
    <Story />
  </TooltipProvider>
);

export const withSidebarProvider: Decorator = (Story) => (
  <SidebarProvider>
    <div style={{ display: "flex", minHeight: 400, width: "100%" }}>
      <Story />
    </div>
  </SidebarProvider>
);
