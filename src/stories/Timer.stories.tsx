import type { Meta, StoryObj } from "@storybook/react";
import { Timer } from "../components/Timer";

const meta = {
  title: "Components/Timer",
  component: Timer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    duration: { control: "number" },
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    duration: 60,
    onTimeUp: () => console.log("Time's up!"),
    isActive: true,
  },
};

export const Paused: Story = {
  args: {
    duration: 45,
    onTimeUp: () => console.log("Time's up!"),
    isActive: false,
  },
};

export const SmallSize: Story = {
  args: {
    duration: 30,
    onTimeUp: () => console.log("Time's up!"),
    isActive: true,
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    duration: 90,
    onTimeUp: () => console.log("Time's up!"),
    isActive: true,
    size: "lg",
  },
};

export const NoProgress: Story = {
  args: {
    duration: 60,
    onTimeUp: () => console.log("Time's up!"),
    isActive: true,
    showProgress: false,
  },
};
