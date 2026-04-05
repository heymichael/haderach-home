import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { UserTable } from "./user-table.tsx";

interface MockUser {
  email: string;
  name: string;
  role: string;
  status: string;
}

const users: MockUser[] = [
  { email: "alice@acme.com", name: "Alice Johnson", role: "Admin", status: "Active" },
  { email: "bob@acme.com", name: "Bob Smith", role: "Editor", status: "Active" },
  { email: "carol@acme.com", name: "Carol Williams", role: "Viewer", status: "Inactive" },
  { email: "dave@acme.com", name: "Dave Brown", role: "Editor", status: "Active" },
];

const columns = [
  {
    key: "name",
    header: "Name",
    render: (u: MockUser) => u.name,
    sortValue: (u: MockUser) => u.name,
    searchValue: (u: MockUser) => u.name,
  },
  {
    key: "email",
    header: "Email",
    render: (u: MockUser) => u.email,
    searchValue: (u: MockUser) => u.email,
  },
  {
    key: "role",
    header: "Role",
    render: (u: MockUser) => u.role,
  },
  {
    key: "status",
    header: "Status",
    render: (u: MockUser) => u.status,
  },
];

const meta: Meta<typeof UserTable<MockUser>> = {
  title: "Admin/UserTable",
  component: UserTable,
};

export default meta;
type Story = StoryObj<typeof UserTable<MockUser>>;

export const Default: Story = {
  args: { users, columns, onRowClick: fn() },
};

export const Loading: Story = {
  args: { users: [], columns, loading: true },
};

export const Empty: Story = {
  args: { users: [], columns },
};
