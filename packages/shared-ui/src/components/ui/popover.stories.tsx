import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover.tsx";
import { Button } from "./button.tsx";

const meta: Meta<typeof Popover> = {
  title: "UI Primitives/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            Some descriptive content inside the popover.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
