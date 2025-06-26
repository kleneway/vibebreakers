"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { CheckCircle, XCircle, RefreshCw, Users } from "lucide-react";
import { toast } from "react-toastify";

interface Statement {
  id: number;
  text: string;
  isLie: boolean;
}

interface Player {
  id: number;
  name: string;
  statements: Statement[];
  currentGuesses: { [statementId: number]: boolean };
  score: number;
}

export default function TwoTruthsAndLie() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<
    "setup" | "statements" | "guessing" | "results"
  >("setup");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [currentStatements, setCurrentStatements] = useState(["", "", ""]);
  const [lieIndex, setLieIndex] = useState<number | null>(null);

  // Setup phase functions
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        statements: [],
        currentGuesses: {},
        score: 0,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      toast.success(`${newPlayerName} added to the game!`);
    }
  };

  const removePlayer = (playerId: number) => {
    setPlayers(players.filter((p: Player) => p.id !== playerId));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGamePhase("statements");
      toast.success("Game started! Time to enter statements.");
    } else {
      toast.error("Need at least 2 players to start!");
    }
  };

  // Statement creation functions
  const updateStatement = (index: number, value: string) => {
    const newStatements = [...currentStatements];
    newStatements[index] = value;
    setCurrentStatements(newStatements);
  };

  const submitStatements = () => {
    if (currentStatements.every((s: string) => s.trim()) && lieIndex !== null) {
      const statements: Statement[] = currentStatements.map(
        (text: string, index: number) => ({
          id: index,
          text: text.trim(),
          isLie: index === lieIndex,
        }),
      );

      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].statements = statements;
      setPlayers(updatedPlayers);

      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setCurrentStatements(["", "", ""]);
        setLieIndex(null);
        toast.success("Statements saved! Next player's turn.");
      } else {
        setGamePhase("guessing");
        setCurrentPlayerIndex(0);
        toast.success("All statements collected! Time to guess!");
      }
    } else {
      toast.error("Please fill all statements and mark which one is the lie!");
    }
  };

  // Guessing phase functions
  const makeGuess = (statementId: number) => {
    const currentPlayer = players[currentPlayerIndex];
    const targetPlayer = players.find((p: Player) =>
      p.statements.some((s: Statement) => s.id === statementId),
    );

    if (!targetPlayer || !currentPlayer) return;

    const statement = targetPlayer.statements[statementId];
    const isCorrectGuess = statement.isLie;

    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(
      (p) => p.id === currentPlayer.id,
    );

    if (isCorrectGuess) {
      updatedPlayers[playerIndex].score += 1;
      toast.success("Correct! That was the lie!");
    } else {
      toast.error("Wrong! That was actually true.");
    }

    updatedPlayers[playerIndex].currentGuesses[statementId] = isCorrectGuess;
    setPlayers(updatedPlayers);

    // Move to next player or end game
    setTimeout(() => {
      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        setGamePhase("results");
        toast.success("Game complete! Check out the results!");
      }
    }, 2000);
  };

  const resetGame = () => {
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setGamePhase("setup");
    setNewPlayerName("");
    setCurrentStatements(["", "", ""]);
    setLieIndex(null);
    toast.info("Game reset! Add players to start a new game.");
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];
  const getOtherPlayers = () =>
    players.filter((_, index) => index !== currentPlayerIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-2">
            Two Truths and a Lie
          </h1>
          <p className="text-purple-600 dark:text-purple-300 text-lg">
            Can you spot the lie among the truths?
          </p>
        </div>

        {/* Setup Phase */}
        {gamePhase === "setup" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Add Players
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
              />
              <Button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                Add Player
              </Button>
            </div>

            {players.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">
                  Players ({players.length}):
                </h3>
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <span className="font-medium">{player.name}</span>
                      <Button
                        onClick={() => removePlayer(player.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full"
            >
              Start Game ({players.length}/2+ players)
            </Button>
          </div>
        )}

        {/* Statement Creation Phase */}
        {gamePhase === "statements" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {getCurrentPlayer()?.name}, enter your statements
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Write two true statements and one lie. Other players will try to
              guess which is the lie!
            </p>

            <div className="space-y-4 mb-6">
              {currentStatements.map((statement, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium">
                    Statement {index + 1}
                  </label>
                  <textarea
                    value={statement}
                    onChange={(e) => updateStatement(index, e.target.value)}
                    placeholder={`Enter statement ${index + 1}...`}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`lie-${index}`}
                      name="lie"
                      checked={lieIndex === index}
                      onChange={() => setLieIndex(index)}
                      className="text-purple-500"
                    />
                    <label
                      htmlFor={`lie-${index}`}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      This is the lie
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={submitStatements}
              disabled={
                !currentStatements.every((s) => s.trim()) || lieIndex === null
              }
              className="w-full"
            >
              Submit Statements
            </Button>
          </div>
        )}

        {/* Guessing Phase */}
        {gamePhase === "guessing" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {getCurrentPlayer()?.name}, guess the lies!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click on the statement you think is the lie for each player.
              </p>

              {getOtherPlayers().map((player) => (
                <div
                  key={player.id}
                  className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-3">
                    {player.name}'s statements:
                  </h3>
                  <div className="space-y-2">
                    {player.statements.map((statement) => (
                      <button
                        key={statement.id}
                        onClick={() => makeGuess(statement.id)}
                        className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                      >
                        {statement.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Phase */}
        {gamePhase === "results" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Game Results! 🎉
            </h2>

            <div className="space-y-4 mb-6">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-4 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 border-2 border-yellow-400"
                        : "bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {index === 0 && <span className="text-2xl">👑</span>}
                        <span className="font-semibold text-lg">
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {player.score} points
                        </span>
                        {player.score > 0 && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-center">
              <Button
                onClick={resetGame}
                className="flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
