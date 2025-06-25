"use client";

import React, { useState } from "react";
import { Player, Superpower } from "./InvisibleSuperpowers";
import { Button } from "./Button";

interface StrengthStoryteller {
  players: Player[];
  superpowers: Superpower[];
  onSuperpowersUpdate: (superpowers: Superpower[]) => void;
  isActive: boolean;
}

export const StrengthStoryteller: React.FC<StrengthStoryteller> = ({
  players,
  superpowers,
  onSuperpowersUpdate,
  isActive
}) => {
  const [evidenceInputs, setEvidenceInputs] = useState<{[key: string]: string}>({});
  const [impactInputs, setImpactInputs] = useState<{[key: string]: string}>({});

  const handleEvidenceChange = (superpowerId: string, evidence: string) => {
    setEvidenceInputs(prev => ({
      ...prev,
      [superpowerId]: evidence
    }));
  };

  const handleImpactChange = (superpowerId: string, impact: string) => {
    setImpactInputs(prev => ({
      ...prev,
      [superpowerId]: impact
    }));
  };

  const saveEvidence = (superpowerId: string) => {
    const evidence = evidenceInputs[superpowerId] || "";
    const impact = impactInputs[superpowerId] || "";
    
    const updatedSuperpowers = superpowers.map(sp => 
      sp.id === superpowerId 
        ? { ...sp, evidence, impact }
        : sp
    );
    
    onSuperpowersUpdate(updatedSuperpowers);
  };

  const saveAllEvidence = () => {
    const updatedSuperpowers = superpowers.map(sp => ({
      ...sp,
      evidence: evidenceInputs[sp.id] || sp.evidence,
      impact: impactInputs[sp.id] || sp.impact
    }));
    
    onSuperpowersUpdate(updatedSuperpowers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-4">
          📖 Evidence Gathering
        </h2>
        <p className="text-orange-800 dark:text-orange-200 mb-4">
          Provide specific evidence for each superpower. Focus on specific actions and their positive impacts.
        </p>
        
        <div className="bg-orange-100 dark:bg-orange-800/30 p-4 rounded-lg">
          <p className="text-orange-800 dark:text-orange-200 font-medium mb-2">
            💡 Good evidence includes:
          </p>
          <ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
            <li>• Specific actions you observed</li>
            <li>• The positive effect it had on others</li>
            <li>• When and how it happened</li>
            <li>• Why it mattered to the group</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {superpowers.map((superpower) => (
          <div key={superpower.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {superpower.playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {superpower.playerName}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    {superpower.name}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Assigned by {superpower.assignedByName}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📝 Specific Evidence
                </label>
                <textarea
                  value={evidenceInputs[superpower.id] || superpower.evidence}
                  onChange={(e) => handleEvidenceChange(superpower.id, e.target.value)}
                  placeholder="When [person] did [specific action], it caused [specific positive effect]..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  💫 Impact & Why It Matters
                </label>
                <textarea
                  value={impactInputs[superpower.id] || superpower.impact}
                  onChange={(e) => handleImpactChange(superpower.id, e.target.value)}
                  placeholder="This mattered because it helped the group/person..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  rows={2}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => saveEvidence(superpower.id)}
                  size="sm"
                  disabled={!evidenceInputs[superpower.id]?.trim() && !superpower.evidence}
                >
                  Save Evidence
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
          📋 Evidence Examples:
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              The Space Holder:
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              "When Sarah noticed Tom looking uncertain, she paused the conversation and asked 'What are your thoughts on this?' This made Tom feel comfortable sharing his valuable insights."
            </p>
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              The Pattern Detective:
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              "Mike connected our discussion about communication with the earlier point about trust, helping us see how these topics build on each other."
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={saveAllEvidence} className="bg-orange-600 hover:bg-orange-700">
          Save All Evidence
        </Button>
      </div>
    </div>
  );
};