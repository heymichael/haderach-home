import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ChatPanel } from "./chat-panel.tsx";

const meta: Meta<typeof ChatPanel> = {
  title: "Chat/ChatPanel",
  component: ChatPanel,
  args: {
    appContext: "demo",
    onClose: fn(),
  },
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ChatPanel>;

export const Standalone: Story = {
  args: {
    mode: "standalone",
    open: true,
    title: "Chat Assistant",
    placeholderMessage: "Ask me anything about your data…",
  },
  render: (args) => (
    <div style={{ height: 500 }}>
      <ChatPanel {...args} />
    </div>
  ),
};

export const Panel: Story = {
  args: {
    mode: "panel",
    open: true,
    title: "Chat",
    placeholderMessage: "Type a message…",
  },
  render: (args) => (
    <div style={{ height: 500 }}>
      <ChatPanel {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    mode: "panel",
    open: true,
    disabled: true,
    title: "Chat",
    placeholderMessage: "Chat is disabled in this context",
  },
  render: (args) => (
    <div style={{ height: 500 }}>
      <ChatPanel {...args} />
    </div>
  ),
};
