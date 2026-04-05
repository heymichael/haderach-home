import type { Meta, StoryObj } from "@storybook/react";
import { ChatTable } from "./chat-table.tsx";

const meta: Meta<typeof ChatTable> = {
  title: "Chat/ChatTable",
  component: ChatTable,
};

export default meta;
type Story = StoryObj<typeof ChatTable>;

export const Default: Story = {
  args: {
    metric: "Monthly Revenue",
    columns: ["Month", "Revenue", "Expenses", "Profit"],
    rows: [
      ["Jan 2026", 120000, 85000, 35000],
      ["Feb 2026", 135000, 90000, 45000],
      ["Mar 2026", 142000, 88000, 54000],
      ["Apr 2026", 128000, 92000, 36000],
      ["May 2026", 155000, 95000, 60000],
      ["Jun 2026", 163000, 98000, 65000],
    ],
    filename: "revenue-report.csv",
    filters: { period: "H1 2026" },
  },
};

export const Minimal: Story = {
  args: {
    metric: "Users",
    columns: ["Name", "Count"],
    rows: [
      ["Active", 42],
      ["Inactive", 8],
    ],
    filename: "users.csv",
  },
};
