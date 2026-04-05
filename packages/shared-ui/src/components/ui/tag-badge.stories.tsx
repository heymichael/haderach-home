import type { Meta, StoryObj } from "@storybook/react";
import { TagBadge } from "./tag-badge.tsx";

const meta: Meta<typeof TagBadge> = {
  title: "UI Primitives/TagBadge",
  component: TagBadge,
  args: { label: "Beta" },
};

export default meta;
type Story = StoryObj<typeof TagBadge>;

export const Default: Story = {};

export const Muted: Story = {
  args: { variant: "muted", label: "Draft" },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-2">
      <TagBadge label="Active" />
      <TagBadge label="Pending" variant="muted" />
      <TagBadge label="Closed" variant="muted" />
    </div>
  ),
};
