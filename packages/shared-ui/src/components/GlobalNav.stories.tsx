import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { GlobalNav } from "./GlobalNav.tsx";
import type { NavApp } from "../auth/app-catalog.ts";

const mockApps: NavApp[] = [
  { id: "expenses", label: "Expenses", path: "/expenses/", icon: "receipt" },
  { id: "vendors", label: "Vendors", path: "/vendors/", icon: "truck" },
];

const meta: Meta<typeof GlobalNav> = {
  title: "Layout/GlobalNav",
  component: GlobalNav,
  args: {
    apps: mockApps,
    activeAppId: "vendors",
    onSignOut: fn(),
  },
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof GlobalNav>;

export const SignedIn: Story = {
  args: {
    userEmail: "alice@acme.com",
    userDisplayName: "Alice Johnson",
    logo: <span className="text-sm font-bold">Haderach</span>,
  },
};

export const SignedOut: Story = {
  args: {
    userEmail: undefined,
    onSignIn: fn(),
    logo: <span className="text-sm font-bold">Haderach</span>,
  },
};

export const NoApps: Story = {
  args: {
    apps: [],
    userEmail: "alice@acme.com",
    userDisplayName: "Alice Johnson",
  },
};
