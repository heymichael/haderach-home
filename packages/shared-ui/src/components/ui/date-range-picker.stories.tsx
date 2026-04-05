import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { DateRangePicker } from "./date-range-picker.tsx";

const meta: Meta<typeof DateRangePicker> = {
  title: "UI Primitives/DateRangePicker",
  component: DateRangePicker,
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    return (
      <DateRangePicker
        range={range}
        onRangeChange={setRange}
        numberOfMonths={2}
      />
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
      <DateRangePicker
        range={range}
        onRangeChange={setRange}
        placeholder="Select date range"
      />
    );
  },
};
