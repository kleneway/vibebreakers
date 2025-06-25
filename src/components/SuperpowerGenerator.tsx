"use client";

import React, { useState } from "react";
import { Player, Superpower } from "./InvisibleSuperpowers";
import { Button } from "./Button";

interface SuperpowerGeneratorProps {
  players: Player[];
  onSuperpowersUpdate: (superpowers: Superpower[]) => void;
  isActive: boolean;
}

const SUPERPOWER_CATEGORIES = {
  communication: {
    name: "Communication Superpowers",
    powers: [
      "The Question Architect",
      "The Space Holder", 
      "The Translation Bridge",
      "The Story Weaver"
    ]
  },
  emotional: {
    name: "Emotional Superpowers", 
    powers: [
      "The Calm Generator",
      "The Courage Catalyst",
      "The Joy Multiplier",
      "The Healing Presence"
    ]
  },
  thinking: {
    name: "Thinking Superpowers",
    powers: [
      "The Pattern Detective",
      "The Possibility Explorer", 
      "The Complexity Simplifier",
      "The Future Architect"
    ]
  },
  action: {
    name: "Action Superpowers",
    powers: [
      "The Momentum Creator",
      "The Detail Guardian",
      "The Resource Magician", 
      "The Follow-Through Champion"
    ]
  }
};

export const SuperpowerGenerator: React.FC<SuperpowerGeneratorProps> = ({
  players,
  onSuperpowersUpdate,
  isActive
}) => {
  const [selectedSuperpowers, setSelectedSuperpowers] = useState<Superpower[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [customPowerName, setCustomPowerName] = useState("");

  const currentPlayer = players[currentPlayerIndex];
  const otherPlayers = players.filter((_, index) => index !== currentPlayerIndex);

  const handleSuperpowerSelect = (playerToAssign: Player, superpowerName: string, category: string) => {
    const newSuperpower: Superpower = {
      id: `${Date.now()}-${Math.random()}`,
      playerId: playerToAssign.id,
      playerName: playerToAssign.name,
      assignedBy: currentPlayer.id,
      assignedByName: currentPlayer.name,
      name: superpowerName,
      category,
      evidence: "",
      impact: ""
    };

    const updatedSuperpowers = [...selectedSuperpowers, newSuperpower];
    setSelectedSuperpowers(updatedSuperpowers);
    onSuperpowersUpdate(updatedSuperpowers);
  };

  const handleCustomSuperpower = (playerToAssign: Player) => {
    if (!customPowerName.trim()) return;

    handleSuperpowerSelect(playerToAssign, customPowerName, "custom");
    setCustomPowerName("");
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    }
  };

  const removeSuperpowerAssignment = (superpowerId: string) => {
    const updatedSuperpowers = selectedSuperpowers.filter(sp => sp.id !== superpowerId);
    setSelectedSuperpowers(updatedSuperpowers);
    onSuperpowersUpdate(updatedSuperpowers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
          🦸‍♀️ Superpower Identification
        </h2>
        <p className="text-purple-800 dark:text-purple-200 mb-4">
          Identify one invisible superpower for each person. Choose creative names that capture their unique strengths!
        </p>
        
        <div className="bg-purple-100 dark:bg-purple-800/30 p-4 rounded-lg">
          <p className="text-purple-800 dark:text-purple-200 font-medium">
            🎯 <strong>{currentPlayer?.name}</strong> - Choose superpowers for others
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Other Players */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            👥 Assign Superpowers To:
          </h3>
          
          {otherPlayers.map((player) => {
            const existingAssignment = selectedSuperpowers.find(
              sp => sp.playerId === player.id && sp.assignedBy === currentPlayer.id
            );

            return (
              <div key={player.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {player.name}
                  </span>
                </div>

                {existingAssignment ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 dark:text-green-200 font-medium">
                        ✨ {existingAssignment.name}
                      </span>
                      <Button
                        onClick={() => removeSuperpowerAssignment(existingAssignment.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Create custom superpower name..."
                      value={customPowerName}
                      onChange={(e) => setCustomPowerName(e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                    <Button
                      onClick={() => handleCustomSuperpower(player)}
                      size="sm"
                      disabled={!customPowerName.trim()}
                    >
                      Assign Custom Power
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Superpower Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            💡 Superpower Ideas:
          </h3>
          
          {Object.entries(SUPERPOWER_CATEGORIES).map(([key, category]) => (
            <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                {category.name}
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {category.powers.map((power) => (
                  <button
                    key={power}
                    onClick={() => {
                      const unassignedPlayer = otherPlayers.find(p => 
                        !selectedSuperpowers.some(sp => sp.playerId === p.id && sp.assignedBy === currentPlayer.id)
                      );
                      if (unassignedPlayer) {
                        handleSuperpowerSelect(unassignedPlayer, power, key);
                      }
                    }}
                    className="text-left text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded transition-colors"
                  >
                    {power}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={nextPlayer} disabled={currentPlayerIndex >= players.length - 1}>
          Next Player
        </Button>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          Player {currentPlayerIndex + 1} of {players.length}
        </div>
      </div>
    </div>
  );
};