import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator.tsx";

const meta: Meta<typeof Separator> = {
  title: "UI Primitives/Separator",
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <p className="text-sm">Above the line</p>
      <Separator />
      <p className="text-sm">Below the line</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-8">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
