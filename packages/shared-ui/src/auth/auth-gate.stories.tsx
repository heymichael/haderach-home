import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Auth/AuthGate",
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "AuthGate wraps an app in Firebase Authentication. It requires runtime config " +
          "and Firebase initialization which cannot be mocked in Storybook. See the " +
          "source code for the full API: `AuthGateProps`, `AuthUserContext`, `useAuthUser`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Placeholder: Story = {
  render: () => (
    <div className="auth-gate-shell">
      <div className="auth-gate-card">
        <h1>AuthGate</h1>
        <p>
          This component manages Firebase authentication flow. In production it renders
          a loading state, access denied page, or the wrapped app content depending on
          the user's auth status.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Cannot be rendered in Storybook because it requires Firebase runtime config.
        </p>
      </div>
    </div>
  ),
};
