import type { Meta, StoryObj } from "@storybook/react";
import { TeamScoreCard } from "@/components/TeamScoreCard";

const meta: Meta<typeof TeamScoreCard> = {
  title: "Components/TeamScoreCard",
  component: TeamScoreCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    team: {
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RedTeam: Story = {
  args: {
    team: {
      name: "Red",
      color: "red",
      score: 0,
      isLockedOut: false,
    },
  },
};

export const BlueTeamPositiveScore: Story = {
  args: {
    team: {
      name: "Blue",
      color: "blue",
      score: 4,
      isLockedOut: false,
    },
  },
};

export const GreenTeamNegativeScore: Story = {
  args: {
    team: {
      name: "Green",
      color: "green",
      score: -1,
      isLockedOut: false,
    },
  },
};

export const LockedOut: Story = {
  args: {
    team: {
      name: "Red",
      color: "red",
      score: -1,
      isLockedOut: true,
    },
  },
};
