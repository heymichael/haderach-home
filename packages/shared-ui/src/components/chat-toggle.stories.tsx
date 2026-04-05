import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ChatToggle } from "./chat-toggle.tsx";

const meta: Meta<typeof ChatToggle> = {
  title: "Chat/ChatToggle",
  component: ChatToggle,
  args: { onToggle: fn() },
};

export default meta;
type Story = StoryObj<typeof ChatToggle>;

export const Closed: Story = {
  args: { open: false },
};

export const Open: Story = {
  args: { open: true },
};
