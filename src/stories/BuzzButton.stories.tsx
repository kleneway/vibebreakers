import type { Meta, StoryObj } from "@storybook/react";
import { BuzzButton } from "@/components/BuzzButton";

const meta: Meta<typeof BuzzButton> = {
  title: "Components/BuzzButton",
  component: BuzzButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onBuzz: {
      action: "buzzed",
    },
    team: {
      control: "object",
    },
    isDisabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RedActive: Story = {
  args: {
    team: {
      name: "Red",
      color: "red",
      shortcut: 1,
    },
    isDisabled: false,
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};

export const BlueActive: Story = {
  args: {
    team: {
      name: "Blue",
      color: "blue",
      shortcut: 2,
    },
    isDisabled: false,
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};

export const GreenDisabled: Story = {
  args: {
    team: {
      name: "Green",
      color: "green",
      shortcut: 3,
    },
    isDisabled: true,
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};
