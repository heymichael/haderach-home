import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip.tsx";
import { Button } from "./button.tsx";
import { withTooltipProvider } from "../../../.storybook/decorators.tsx";

const meta: Meta<typeof Tooltip> = {
  title: "UI Primitives/Tooltip",
  component: Tooltip,
  decorators: [withTooltipProvider],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>Tooltip on {side}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
