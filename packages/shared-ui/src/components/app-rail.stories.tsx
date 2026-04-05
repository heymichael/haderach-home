import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { AppRail } from "./app-rail.tsx";
import type { NavApp } from "../auth/app-catalog.ts";

const mockApps: NavApp[] = [
  { id: "vendors", label: "Vendors", path: "/vendors/", icon: "truck", railEnabled: true },
  { id: "stocks", label: "Commodities", path: "/stocks/", icon: "layers", railEnabled: true },
];

const meta: Meta<typeof AppRail> = {
  title: "Layout/AppRail",
  component: AppRail,
  args: {
    apps: mockApps,
    activeAppId: "vendors",
    onSignOut: fn(),
    userEmail: "alice@acme.com",
    userDisplayName: "Alice Johnson",
  },
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AppRail>;

export const Expanded: Story = {
  render: function Render(args) {
    const [expanded, setExpanded] = useState(true);
    return (
      <div className="flex h-[500px]">
        <AppRail {...args} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
        <div className="flex-1 p-4 text-sm text-muted-foreground">
          Main content area
        </div>
      </div>
    );
  },
};

export const Collapsed: Story = {
  render: function Render(args) {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="flex h-[500px]">
        <AppRail {...args} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
        <div className="flex-1 p-4 text-sm text-muted-foreground">
          Main content area
        </div>
      </div>
    );
  },
};
