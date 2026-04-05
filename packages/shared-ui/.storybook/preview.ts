import type { Preview } from "storybook";
import "./storybook.css";

const preview: Preview = {
  tags: ["autodocs"],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },

  initialGlobals: {
    viewport: { value: "responsive" },
  },
};

export default preview;
