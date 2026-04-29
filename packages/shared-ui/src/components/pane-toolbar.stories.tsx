import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PaneToolbar } from "./pane-toolbar.tsx";
import type { PaneId } from "./pane-toolbar.tsx";

const meta: Meta<typeof PaneToolbar> = {
  title: "Layout/PaneToolbar",
  component: PaneToolbar,
};

export default meta;
type Story = StoryObj<typeof PaneToolbar>;

export const Default: Story = {
  render: function Render() {
    const [panes, setPanes] = useState<Record<PaneId, boolean>>({
      chat: true,
      analytics: false,
      data: false,
      schedule: false,
      admin: false,
      media: false,
    });
    return (
      <PaneToolbar
        activePanes={panes}
        onPaneToggle={(id) =>
          setPanes((prev) => ({ ...prev, [id]: !prev[id] }))
        }
      />
    );
  },
};
