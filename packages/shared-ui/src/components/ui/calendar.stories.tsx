import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar.tsx";

const meta: Meta<typeof Calendar> = {
  title: "UI Primitives/Calendar",
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};
