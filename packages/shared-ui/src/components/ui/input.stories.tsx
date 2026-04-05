import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input.tsx";

const meta: Meta<typeof Input> = {
  title: "UI Primitives/Input",
  component: Input,
  args: { placeholder: "Enter text…" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Hello world" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "Bad input" },
};

export const File: Story = {
  args: { type: "file" },
};
