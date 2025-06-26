import type { Meta, StoryObj } from "@storybook/react";
import { StoryBuildingSymphony } from "../components/StoryBuildingSymphony";

const meta: Meta<typeof StoryBuildingSymphony> = {
  title: "Games/StoryBuildingSymphony",
  component: StoryBuildingSymphony,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithInitialPlayers: Story = {
  args: {
    initialPlayers: ["Alice", "Bob", "Charlie"],
  },
};

export const CustomSettings: Story = {
  args: {
    customSettings: {
      roundDuration: 30,
      maxRounds: 5,
      minSentenceLength: 10,
      maxSentenceLength: 100,
    },
  },
};

export const WithPlayersAndCustomSettings: Story = {
  args: {
    initialPlayers: ["Emma", "Jake"],
    customSettings: {
      roundDuration: 60,
      maxRounds: 8,
      minSentenceLength: 30,
      maxSentenceLength: 150,
    },
  },
};
