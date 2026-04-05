import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DetailRow, EditRow, SelectRow, CheckboxRow } from "./form-rows.tsx";

const meta: Meta = {
  title: "Forms/FormRows",
};

export default meta;
type Story = StoryObj;

export const Detail: Story = {
  render: () => (
    <div className="w-[400px] divide-y">
      <DetailRow label="Name" value="Acme Corp" />
      <DetailRow label="Status" value="Active" />
      <DetailRow label="Notes" />
    </div>
  ),
};

export const Edit: Story = {
  render: function Render() {
    const [val, setVal] = useState("Acme Corp");
    return (
      <div className="w-[400px]">
        <EditRow label="Company Name" value={val} onChange={setVal} />
      </div>
    );
  },
};

export const SelectField: Story = {
  name: "Select",
  render: function Render() {
    const [val, setVal] = useState("active");
    return (
      <div className="w-[400px]">
        <SelectRow
          label="Status"
          value={val}
          onChange={setVal}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "pending", label: "Pending" },
          ]}
        />
      </div>
    );
  },
};

export const Checkbox: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return (
      <div className="w-[400px]">
        <CheckboxRow
          label="Enable notifications"
          checked={checked}
          onChange={setChecked}
        />
      </div>
    );
  },
};
