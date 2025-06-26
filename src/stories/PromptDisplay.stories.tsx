import type { Meta, StoryObj } from "@storybook/react";
import { PromptDisplay } from "@/components/PromptDisplay";

const meta: Meta<typeof PromptDisplay> = {
  title: "Components/PromptDisplay",
  component: PromptDisplay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    emoji: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortPrompt: Story = {
  args: {
    emoji: "📧⛓️",
  },
};

export const LongPrompt: Story = {
  args: {
    emoji: "🎯����🧑‍💻🦄",
  },
};
