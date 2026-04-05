import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect } from "./multi-select.tsx";

const items = [
  { id: "1", label: "Engineering" },
  { id: "2", label: "Design" },
  { id: "3", label: "Marketing" },
  { id: "4", label: "Sales" },
  { id: "5", label: "Support" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "UI Primitives/MultiSelect",
  component: MultiSelect,
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: function Render() {
    const [ids, setIds] = useState<string[]>(["1"]);
    return (
      <MultiSelect
        items={items}
        selectedIds={ids}
        onSelectionChange={setIds}
        searchPlaceholder="Search teams…"
      />
    );
  },
};

export const Underline: Story = {
  render: function Render() {
    const [ids, setIds] = useState<string[]>([]);
    return (
      <MultiSelect
        items={items}
        selectedIds={ids}
        onSelectionChange={setIds}
        variant="underline"
        searchPlaceholder="Filter…"
      />
    );
  },
};
