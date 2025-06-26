import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { HomeScreen } from "@/components/HomeScreen";

const meta: Meta<typeof HomeScreen> = {
  title: "Views/HomeScreen",
  component: HomeScreen,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onStartGame: {
      action: "started game",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStartGame: (sessionName: string) =>
      console.log(`Starting game: ${sessionName}`),
  },
};

export const ReadyToStart: Story = {
  args: {
    onStartGame: (sessionName: string) =>
      console.log(`Starting game: ${sessionName}`),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter session name...");
    await userEvent.type(input, "Team Sync");
  },
};
