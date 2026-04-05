import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card.tsx";
import { Button } from "./button.tsx";

const meta: Meta<typeof Card> = {
  title: "UI Primitives/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description with supporting text.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card body content goes here.</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};
