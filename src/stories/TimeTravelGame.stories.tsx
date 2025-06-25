import type { Meta, StoryObj } from "@storybook/react";
import { TimeTravelGame } from "../components/TimeTravelGame";

const meta = {
  title: "Games/TimeTravelGame",
  component: TimeTravelGame,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "An immersive time travel decision game where players navigate through different historical eras, making choices that create ripple effects through time. Features complex decision trees, consequence tracking, and personality analysis.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TimeTravelGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The complete Time Traveler's Dilemma game experience. Players journey through 4 randomly selected historical eras, making decisions that affect future options.",
      },
    },
  },
};

export const GameMechanics: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Game Features:**

- **Era Selection**: 4 random eras from 6 possible time periods
- **Decision System**: Complex choices with consequences that affect future options
- **Butterfly Effect**: Earlier decisions unlock or block later choices
- **Timer System**: 90 seconds per decision, 45 seconds for consequences
- **Personality Analysis**: Deep analysis of decision patterns
- **Historical Themes**: Each era has authentic historical context

**Game Flow:**
1. Setup (30s) - Era introduction and rules
2. Decision Rounds (90s each) - Choose from 4 complex options
3. Consequence Phase (45s) - See immediate and future impacts
4. Analysis Phase (3min) - Comprehensive personality and impact report
        `,
      },
    },
  },
};

export const EducationalValue: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Learning Outcomes:**

- **Historical Empathy**: Understanding decisions within historical context
- **Systems Thinking**: How choices create ripple effects over time  
- **Ethical Reasoning**: Weighing competing values and priorities
- **Decision Analysis**: Understanding personal decision-making patterns
- **Cultural Awareness**: Experiencing different time periods and challenges

**Psychological Insights:**
- Risk-taking vs. safety preferences
- Altruism vs. self-interest balance
- Innovation vs. tradition orientation
- Collaboration vs. independence style
- Short-term vs. long-term thinking patterns
        `,
      },
    },
  },
};
