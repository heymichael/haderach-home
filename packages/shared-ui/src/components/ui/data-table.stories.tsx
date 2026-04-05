import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table.tsx";

interface Payment {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  amount: number;
}

const columns: ColumnDef<Payment, unknown>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amt = parseFloat(row.getValue("amount"));
      return <div className="text-right font-medium">${amt.toFixed(2)}</div>;
    },
  },
];

const data: Payment[] = [
  { id: "PAY-001", status: "success", email: "alice@acme.com", amount: 316.0 },
  { id: "PAY-002", status: "pending", email: "bob@acme.com", amount: 242.0 },
  { id: "PAY-003", status: "processing", email: "carol@acme.com", amount: 837.0 },
  { id: "PAY-004", status: "failed", email: "dave@acme.com", amount: 125.0 },
  { id: "PAY-005", status: "success", email: "eve@acme.com", amount: 594.0 },
];

const meta: Meta<typeof DataTable<Payment>> = {
  title: "Data Display/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable<Payment>>;

export const Default: Story = {
  args: { columns, data },
};

export const WithSearch: Story = {
  args: { columns, data, enableSearch: true },
};

export const WithCSV: Story = {
  args: { columns, data, csvFilename: "payments.csv" },
};

export const Empty: Story = {
  args: { columns, data: [], emptyMessage: "No payments found." },
};
