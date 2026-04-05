import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PaneLayout } from "./pane-layout.tsx";

const meta: Meta<typeof PaneLayout> = {
  title: "Layout/PaneLayout",
  component: PaneLayout,
};

export default meta;
type Story = StoryObj<typeof PaneLayout>;

const Placeholder = ({ label, bg }: { label: string; bg: string }) => (
  <div
    className="flex items-center justify-center h-full text-sm font-medium"
    style={{ background: bg, minHeight: 300 }}
  >
    {label}
  </div>
);

export const Default: Story = {
  render: function Render() {
    const [chatOpen, setChatOpen] = useState(true);
    const [detail, setDetail] = useState<"analytics" | "data" | null>(
      "analytics"
    );
    return (
      <div style={{ height: 500 }}>
        <PaneLayout
          chatContent={<Placeholder label="Chat" bg="#e0f2fe" />}
          analyticsContent={<Placeholder label="Analytics" bg="#fef3c7" />}
          dataContent={<Placeholder label="Data" bg="#dcfce7" />}
          chatOpen={chatOpen}
          detailPane={detail}
          onLayoutChange={(c, d) => {
            setChatOpen(c);
            setDetail(d);
          }}
        />
      </div>
    );
  },
};
