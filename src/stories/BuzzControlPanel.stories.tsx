import type { Meta, StoryObj } from "@storybook/react";
import { BuzzControlPanel } from "@/components/BuzzControlPanel";

const meta: Meta<typeof BuzzControlPanel> = {
  title: "Layout/BuzzControlPanel",
  component: BuzzControlPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onBuzz: {
      action: "buzzed",
    },
    lockedOutTeams: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllActive: Story = {
  args: {
    lockedOutTeams: [],
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};

export const OneTeamLockedOut: Story = {
  args: {
    lockedOutTeams: ["Blue"],
    onBuzz: (teamName: string) => console.log(`${teamName} buzzed!`),
  },
};
