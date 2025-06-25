import type { Meta, StoryObj } from '@storybook/react';
import { AuthenticityChallenge } from '@/components/AuthenticityChallenge';

const meta: Meta<typeof AuthenticityChallenge> = {
  title: 'Games/AuthenticityChallenge',
  component: AuthenticityChallenge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The Authenticity Challenge game where players share stories and try to detect deception. Some players tell true stories while others create believable lies.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallGroup: Story = {
  args: {
    playerNames: ['Alice', 'Bob', 'Charlie'],
    onGameEnd: (results) => {
      console.log('Game ended with results:', results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A small group of 3 players playing the Authenticity Challenge.',
      },
    },
  },
};

export const MediumGroup: Story = {
  args: {
    playerNames: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    onGameEnd: (results) => {
      console.log('Game ended with results:', results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A medium group of 5 players, ideal for the game dynamics.',
      },
    },
  },
};

export const LargeGroup: Story = {
  args: {
    playerNames: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'],
    onGameEnd: (results) => {
      console.log('Game ended with results:', results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A large group of 8 players, testing the game\'s scalability.',
      },
    },
  },
};

export const WithFunnyNames: Story = {
  args: {
    playerNames: ['Wizard McGillicuddy', 'Captain Pancake', 'Dr. Noodles', 'Empress Giggles'],
    onGameEnd: (results) => {
      console.log('Game ended with results:', results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing the game with creative and fun player names.',
      },
    },
  },
};