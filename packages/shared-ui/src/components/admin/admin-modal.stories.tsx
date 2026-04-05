import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { AdminModal } from "./admin-modal.tsx";
import { Button } from "../ui/button.tsx";

const meta: Meta<typeof AdminModal> = {
  title: "Admin/AdminModal",
  component: AdminModal,
  args: {
    title: "Edit User",
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AdminModal>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Modal body with form fields or confirmation content.
        </p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    children: <p className="text-sm">Are you sure you want to delete this user?</p>,
    footer: (
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    ),
  },
};
