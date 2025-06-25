import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { HowToPlayAccordion } from "@/components/HowToPlayAccordion";

const meta: Meta<typeof HowToPlayAccordion> = {
  title: "Components/HowToPlayAccordion",
  component: HowToPlayAccordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};

export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText(/How to Play/);
    await userEvent.click(summary);
  },
};
