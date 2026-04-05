import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ViewModeToggle } from "./view-mode-toggle.tsx";
import type { ViewMode } from "./view-mode-toggle.tsx";

const meta: Meta<typeof ViewModeToggle> = {
  title: "Feedback/ViewModeToggle",
  component: ViewModeToggle,
};

export default meta;
type Story = StoryObj<typeof ViewModeToggle>;

export const Default: Story = {
  render: function Render() {
    const [mode, setMode] = useState<ViewMode>("chart");
    return <ViewModeToggle viewMode={mode} onViewModeChange={setMode} />;
  },
};

export const WithDownload: Story = {
  render: function Render() {
    const [mode, setMode] = useState<ViewMode>("table");
    return (
      <ViewModeToggle
        viewMode={mode}
        onViewModeChange={setMode}
        onDownload={() => alert("Download triggered")}
      />
    );
  },
};
