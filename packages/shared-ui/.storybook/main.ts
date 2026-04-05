import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",

  stories: ["../src/**/*.stories.tsx", "../src/**/*.mdx"],

  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],

  docs: { defaultName: "Documentation" },

  tags: ["autodocs"],

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    return mergeConfig(config, {
      base: "/components/",
      plugins: [tailwindcss()],
    });
  },
};

export default config;
