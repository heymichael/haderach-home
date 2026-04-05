import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackPopover } from "./feedback-popover.tsx";

const meta: Meta<typeof FeedbackPopover> = {
  title: "Feedback/FeedbackPopover",
  component: FeedbackPopover,
  args: {
    appId: "vendors",
    getIdToken: async () => "mock-token",
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackPopover>;

export const Default: Story = {};
