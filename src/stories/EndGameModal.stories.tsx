import type { Meta, StoryObj } from "@storybook/react";
import { EndGameModal } from "@/components/EndGameModal";

const meta: Meta<typeof EndGameModal> = {
  title: "Modals/EndGameModal",
  component: EndGameModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onPlayAgain: {
      action: "play again clicked",
    },
    winner: { control: "text" },
    isTie: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleWinner: Story = {
  args: {
    winner: "Green",
    isTie: false,
    onPlayAgain: () => console.log("Starting new game"),
  },
};

export const TieGame: Story = {
  args: {
    winner: undefined,
    isTie: true,
    onPlayAgain: () => console.log("Starting sudden death"),
  },
};
