import type { Meta, StoryObj } from "@storybook/react";
import { GameScreen } from "@/components/GameScreen";

const meta: Meta<typeof GameScreen> = {
  title: "Views/GameScreen",
  component: GameScreen,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onBuzz: {
      action: "team buzzed",
    },
    sessionName: { control: "text" },
    round: { control: "number" },
    totalRounds: { control: "number" },
    secondsLeft: { control: "number" },
    currentPrompt: { control: "text" },
    scores: { control: "object" },
    lockedOutTeams: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StartOfRound: Story = {
  args: {
    sessionName: "Friday Fun",
    round: 1,
    totalRounds: 10,
    scores: {
      red: 0,
      blue: 0,
      green: 0,
    },
    secondsLeft: 60,
    currentPrompt: "🎯🔑📈",
    lockedOutTeams: [],
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};

export const MidRoundWithLockout: Story = {
  args: {
    sessionName: "Team Championship",
    round: 5,
    totalRounds: 10,
    scores: {
      red: 2,
      blue: -1,
      green: 4,
    },
    secondsLeft: 28,
    currentPrompt: "🦄🎪🎭🎨🎵",
    lockedOutTeams: ["Blue"],
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};
