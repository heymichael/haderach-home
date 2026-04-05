import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Mail, Plus } from "lucide-react";
import { Button } from "./button.tsx";

const meta: Meta<typeof Button> = {
  title: "UI Primitives/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Link: Story = {
  args: { variant: "link", children: "Link" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

export const Icon: Story = {
  args: { size: "icon", children: <Plus />, "aria-label": "Add" },
};

export const WithIcon: Story = {
  args: { children: <><Mail /> Send Email</> },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};
