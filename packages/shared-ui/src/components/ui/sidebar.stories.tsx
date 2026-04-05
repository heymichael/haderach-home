import type { Meta, StoryObj } from "@storybook/react";
import { Home, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "./sidebar.tsx";
import { withSidebarProvider } from "../../../.storybook/decorators.tsx";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  decorators: [withSidebarProvider],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const navItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Users, label: "Team" },
  { icon: Settings, label: "Settings" },
];

export const Default: Story = {
  render: () => (
    <>
      <Sidebar>
        <SidebarHeader className="border-b px-4 py-3">
          <span className="font-semibold text-sm">My App</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-2 border-b px-4 py-2">
          <SidebarTrigger />
          <span className="text-sm font-medium">Page Title</span>
        </header>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">Main content area</p>
        </div>
      </SidebarInset>
    </>
  ),
};
