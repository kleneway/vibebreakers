"use client";

import { useState, useEffect, useCallback } from "react";
import { StoryElement, StoryContribution, Player, GameState, GameSettings } from "@/lib/types";
import { StoryElementGenerator } from "./StoryElementGenerator";
import { StoryPromptCard } from "./StoryPromptCard";
import { PlayerContributionPanel } from "./PlayerContributionPanel";
import { Timer } from "./Timer";
import { Button } from "./Button";
import { Users, Play, RotateCcw, Download, Trophy } from "lucide-react";
import { toast } from "react-toastify";

interface StoryBuildingSymphonyProps {
  initialPlayers?: string[];
  onGameComplete?: (finalStory: StoryContribution[]) => void;
  customSettings?: Partial<GameSettings>;
}

const DEFAULT_SETTINGS: GameSettings = {
  roundDuration: 45, // seconds
  maxSentenceLength: 200,
  minSentenceLength: 20,
  maxRounds: 10
};

export const StoryBuildingSymphony: React.FC<StoryBuildingSymphonyProps> = ({
  initialPlayers = [],
  onGameComplete,
  customSettings = {}
}) => {
  const [gameState, setGameState] = useState<GameState>({
    id: Math.random().toString(36).substr(2, 9),
    status: 'setup',
    players: [],
    currentPlayerIndex: 0,
    story: [],
    roundNumber: 1,
    timeRemaining: DEFAULT_SETTINGS.roundDuration,
    maxRounds: DEFAULT_SETTINGS.maxRounds
  });

  const [settings] = useState<GameSettings>({
    ...DEFAULT_SETTINGS,
    ...customSettings
  });

  const [elementGenerator] = useState(() => new StoryElementGenerator());
  const [playerNames, setPlayerNames] = useState<string[]>(initialPlayers);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Initialize players when starting the game
  const initializePlayers = useCallback(() => {
    if (playerNames.length < 2) {
      toast.error("Need at least 2 players to start the game!");
      return false;
    }

    const elements = elementGenerator.generateElementsForPlayers(playerNames.length);
    const players: Player[] = playerNames.map((name, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      isActive: index === 0,
      score: 0,
      assignedElement: elements[index]
    }));

    setGameState(prev => ({
      ...prev,
      status: 'playing',
      players,
      timeRemaining: settings.roundDuration
    }));

    setIsTimerActive(true);
    return true;
  }, [playerNames, elementGenerator, settings.roundDuration]);

  // Handle player contribution
  const handleContribution = useCallback((sentence: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer?.assignedElement) return;

    const contribution: StoryContribution = {
      id: Math.random().toString(36).substr(2, 9),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      sentence,
      storyElement: currentPlayer.assignedElement,
      timestamp: Date.now(),
      order: gameState.story.length + 1
    };

    // Calculate score based on story integration and creativity
    const baseScore = 10;
    const lengthBonus = Math.min(5, Math.floor((sentence.length - settings.minSentenceLength) / 20));
    const integrationBonus = sentence.toLowerCase().includes(currentPlayer.assignedElement.text.toLowerCase()) ? 5 : 0;
    const totalScore = baseScore + lengthBonus + integrationBonus;

    const updatedPlayers = gameState.players.map(player => 
      player.id === currentPlayer.id 
        ? { ...player, score: player.score + totalScore }
        : player
    );

    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const isGameComplete = gameState.story.length + 1 >= settings.maxRounds;

    // Generate new element for next player
    if (!isGameComplete && nextPlayerIndex !== gameState.currentPlayerIndex) {
      const nextPlayer = updatedPlayers[nextPlayerIndex];
      nextPlayer.assignedElement = elementGenerator.generateRandomElement();
    }

    const newGameState: GameState = {
      ...gameState,
      story: [...gameState.story, contribution],
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      roundNumber: gameState.roundNumber + 1,
      timeRemaining: settings.roundDuration,
      status: isGameComplete ? 'finished' : 'playing'
    };

    setGameState(newGameState);

    if (isGameComplete) {
      setIsTimerActive(false);
      onGameComplete?.(newGameState.story);
      toast.success("🎉 Story complete! What an amazing tale!");
    } else {
      toast.success(`Great addition ${currentPlayer.name}! +${totalScore} points`);
    }
  }, [gameState, settings, elementGenerator, onGameComplete]);

  // Handle timer timeout
  const handleTimeUp = useCallback(() => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    toast.warning(`Time's up ${currentPlayer?.name}! Skipping to next player.`);
    
    // Skip to next player
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const nextPlayer = gameState.players[nextPlayerIndex];
    if (nextPlayer) {
      nextPlayer.assignedElement = elementGenerator.generateRandomElement();
    }

    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: nextPlayerIndex,
      timeRemaining: settings.roundDuration,
      roundNumber: prev.roundNumber + 1
    }));
  }, [gameState, elementGenerator, settings.roundDuration]);

  // Add new player
  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast.error("Please enter a player name");
      return;
    }

    if (playerNames.includes(newPlayerName.trim())) {
      toast.error("Player name already exists");
      return;
    }

    setPlayerNames(prev => [...prev, newPlayerName.trim()]);
    setNewPlayerName("");
    toast.success(`${newPlayerName.trim()} added to the game!`);
  };

  // Remove player
  const removePlayer = (index: number) => {
    setPlayerNames(prev => prev.filter((_, i) => i !== index));
  };

  // Export story
  const exportStory = () => {
    const storyText = gameState.story
      .map((contribution, index) => 
        `${index + 1}. ${contribution.playerName} (${contribution.storyElement.text}): ${contribution.sentence}`
      )
      .join('\n\n');

    const fullStory = `Story Building Symphony - Game ${gameState.id}\n\n${storyText}`;
    
    const blob = new Blob([fullStory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-${gameState.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Story exported successfully!");
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      id: Math.random().toString(36).substr(2, 9),
      status: 'setup',
      players: [],
      currentPlayerIndex: 0,
      story: [],
      roundNumber: 1,
      timeRemaining: settings.roundDuration,
      maxRounds: settings.maxRounds
    });
    setIsTimerActive(false);
    elementGenerator.reset();
    toast.info("Game reset! Ready for a new story.");
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (gameState.status === 'setup') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Story Building Symphony</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Collaborate to create an amazing story, one sentence at a time!
          </p>
        </div>

        {/* Player Setup */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Players</h2>
          </div>

          {/* Add Player Form */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Enter player name..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Button onClick={addPlayer} variant="primary">
              Add Player
            </Button>
          </div>

          {/* Player List */}
          {playerNames.length > 0 && (
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <span className="font-medium text-gray-900 dark:text-white">{name}</span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {playerNames.length < 2 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Add at least 2 players to start the game
            </p>
          )}

          {/* Game Settings Preview */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Game Settings</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
              <div>Time per turn: {settings.roundDuration}s</div>
              <div>Max rounds: {settings.maxRounds}</div>
              <div>Sentence length: {settings.minSentenceLength}-{settings.maxSentenceLength} chars</div>
            </div>
          </div>

          {/* Start Game Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={initializePlayers}
              disabled={playerNames.length < 2}
              variant="primary"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status === 'finished') {
    const winner = gameState.players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Victory Screen */}
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Story Complete!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            🏆 Winner: {winner.name} with {winner.score} points!
          </p>
        </div>

        {/* Final Story */}
        <StoryPromptCard
          story={gameState.story}
          onExportStory={exportStory}
        />

        {/* Final Scores */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Final Scores</h2>
          <div className="space-y-2">
            {gameState.players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{player.name}</span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{player.score} pts</span>
                </div>
              ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 justify-center">
          <Button onClick={exportStory} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Story
          </Button>
          <Button onClick={resetGame} variant="primary">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Story Building Symphony</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Round {gameState.roundNumber} of {settings.maxRounds}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Timer
            duration={settings.roundDuration}
            onTimeUp={handleTimeUp}
            isActive={isTimerActive}
            size="lg"
          />
          <Button onClick={resetGame} variant="secondary" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Story Display */}
      <StoryPromptCard
        story={gameState.story}
        currentElement={currentPlayer?.assignedElement}
        currentPlayerName={currentPlayer?.name}
        isActivePlayer={false}
        onExportStory={gameState.story.length > 0 ? exportStory : undefined}
      />

      {/* Player Input */}
      {currentPlayer?.assignedElement && (
        <PlayerContributionPanel
          currentElement={currentPlayer.assignedElement}
          playerName={currentPlayer.name}
          settings={settings}
          onSubmit={handleContribution}
          disabled={gameState.status !== 'playing'}
        />
      )}

      {/* Player Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gameState.players.map(player => (
          <div
            key={player.id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 ${
              player.id === currentPlayer?.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">{player.name}</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{player.score}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
              {player.id === currentPlayer?.id && (
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">
                  Active Player
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};