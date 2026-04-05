import type { Meta, StoryObj } from "@storybook/react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./chart.tsx";
import type { ChartConfig } from "./chart.tsx";

const meta: Meta<typeof ChartContainer> = {
  title: "Data Display/Chart",
  component: ChartContainer,
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const data = [
  { month: "Jan", revenue: 186, expenses: 80 },
  { month: "Feb", revenue: 305, expenses: 200 },
  { month: "Mar", revenue: 237, expenses: 120 },
  { month: "Apr", revenue: 73, expenses: 190 },
  { month: "May", revenue: 209, expenses: 130 },
  { month: "Jun", revenue: 214, expenses: 140 },
];

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "oklch(0.52 0.09 190)" },
  expenses: { label: "Expenses", color: "oklch(0.4 0.16 25)" },
};

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
