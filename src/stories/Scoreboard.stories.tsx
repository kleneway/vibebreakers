import type { Meta, StoryObj } from "@storybook/react";
import { Scoreboard } from "@/components/Scoreboard";

const meta: Meta<typeof Scoreboard> = {
  title: "Layout/Scoreboard",
  component: Scoreboard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    scores: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialState: Story = {
  args: {
    scores: {
      red: 0,
      blue: 0,
      green: 0,
    },
  },
};

export const MidGame: Story = {
  args: {
    scores: {
      red: 2,
      blue: -1,
      green: 4,
    },
  },
};
