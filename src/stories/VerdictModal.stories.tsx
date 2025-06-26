import type { Meta, StoryObj } from "@storybook/react";
import { VerdictModal } from "@/components/VerdictModal";

const meta: Meta<typeof VerdictModal> = {
  title: "Modals/VerdictModal",
  component: VerdictModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onVerdict: {
      action: "verdict given",
    },
    teamName: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teamName: "Blue",
    onVerdict: (isCorrect: boolean) =>
      console.log(`Verdict: ${isCorrect ? "Correct" : "Incorrect"}`),
  },
};
