import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet.tsx";
import { Button } from "./button.tsx";

const meta: Meta<typeof Sheet> = {
  title: "UI Primitives/Sheet",
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Side panel content area.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Place any content here.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Left Sheet</SheetTitle>
          <SheetDescription>Slides in from the left.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
