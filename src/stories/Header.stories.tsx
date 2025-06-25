import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "@/components/Header";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    sessionName: { control: "text" },
    round: { control: "number" },
    totalRounds: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstRound: Story = {
  args: {
    sessionName: "Team Kickoff",
    round: 1,
    totalRounds: 10,
  },
};

export const FinalRound: Story = {
  args: {
    sessionName: "Friday Fun",
    round: 10,
    totalRounds: 10,
  },
};

export const SuddenDeath: Story = {
  args: {
    sessionName: "Tie Breaker!",
    round: 11,
    totalRounds: 10,
  },
};
