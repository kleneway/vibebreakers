"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { MemoryPalace, MemoryLocation, Player } from "@/lib/types";
import { Home, Trees, Building, Users, Map, Plus, Trash2 } from "lucide-react";

interface PlaceMapperProps {
  players: Player[];
  onPalaceUpdate: (palace: MemoryPalace) => void;
  existingPalaces: MemoryPalace[];
}

const PLACE_TYPES = [
  {
    id: "childhood",
    name: "Childhood Home",
    icon: Home,
    description: "A place from your childhood that holds many memories",
  },
  {
    id: "natural",
    name: "Natural Space",
    icon: Trees,
    description: "An outdoor location that feels meaningful to you",
  },
  {
    id: "community",
    name: "Community Place",
    icon: Users,
    description: "A shared space where you connected with others",
  },
  {
    id: "workplace",
    name: "Work/School",
    icon: Building,
    description: "A place of learning, growth, or accomplishment",
  },
  {
    id: "other",
    name: "Other Special Place",
    icon: Map,
    description: "Any other location that holds special significance",
  },
];

const LOCATION_PROMPTS = {
  childhood: [
    "Your bedroom",
    "The kitchen where meals were shared",
    "A secret hiding spot",
    "The place you went when upset",
    "Your favorite play area",
    "The front porch or entrance",
    "A room where family gathered",
  ],
  natural: [
    "Your favorite sitting spot",
    "A challenging terrain you conquered",
    "The place with the best view",
    "A spot you discovered alone",
    "An area that changes with seasons",
    "A place you go for peace",
    "Where you felt most connected to nature",
  ],
  community: [
    "The regular gathering spot",
    "Where you helped others",
    "Location of celebrations",
    "A place you felt belonging",
    "Where important discussions happened",
    "The entrance or welcoming area",
    "A spot for quiet reflection",
  ],
  workplace: [
    "Your main workspace",
    "Place of greatest accomplishment",
    "Area where you overcame challenges",
    "Location of collaboration",
    "Where you experienced growth",
    "A place of recognition",
    "Spot for breaks and connections",
  ],
  other: [
    "The most meaningful corner",
    "Where important events happened",
    "Your place of comfort",
    "Area of transformation",
    "Location of first impressions",
    "A spot for contemplation",
    "Where you felt most yourself",
  ],
};

export const PlaceMapper: React.FC<PlaceMapperProps> = ({
  players,
  onPalaceUpdate,
  existingPalaces,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(
    players[0]?.id || "",
  );
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>("");
  const [placeName, setPlaceName] = useState<string>("");
  const [locations, setLocations] = useState<Partial<MemoryLocation>[]>([]);
  const [showLocationBuilder, setShowLocationBuilder] = useState(false);

  const currentPlayer = players.find((p) => p.id === selectedPlayer);
  const existingPalace = existingPalaces.find(
    (p) => p.playerId === selectedPlayer,
  );

  const handlePlaceTypeSelect = (placeType: string) => {
    setSelectedPlaceType(placeType);
    setShowLocationBuilder(true);

    // Initialize with suggested locations
    const suggestions =
      LOCATION_PROMPTS[placeType as keyof typeof LOCATION_PROMPTS] || [];
    const initialLocations = suggestions.slice(0, 5).map((name, index) => ({
      id: `loc-${index}`,
      name,
      description: "",
      memory: "",
      emotion: "",
      significance: "",
      sensoryDetail: "",
      emotionalIntensity: 5,
    }));
    setLocations(initialLocations);
  };

  const addLocation = () => {
    const newLocation: Partial<MemoryLocation> = {
      id: `loc-${Date.now()}`,
      name: "",
      description: "",
      memory: "",
      emotion: "",
      significance: "",
      sensoryDetail: "",
      emotionalIntensity: 5,
    };
    setLocations([...locations, newLocation]);
  };

  const updateLocation = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedLocations = locations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc,
    );
    setLocations(updatedLocations);
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const savePalace = () => {
    if (
      !selectedPlayer ||
      !selectedPlaceType ||
      !placeName ||
      locations.length === 0
    ) {
      return;
    }

    const palace: MemoryPalace = {
      id: existingPalace?.id || `palace-${Date.now()}`,
      playerId: selectedPlayer,
      playerName: currentPlayer?.name || "",
      placeName,
      placeType: selectedPlaceType as any,
      locations: locations.filter(
        (loc) => loc.name && loc.name.trim(),
      ) as MemoryLocation[],
      isComplete: true,
    };

    onPalaceUpdate(palace);
  };

  const selectedPlaceTypeInfo = PLACE_TYPES.find(
    (pt) => pt.id === selectedPlaceType,
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Palace Construction
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Select a deeply familiar place and map 5-7 specific locations within
          this space.
        </p>
      </div>

      {/* Player Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Select Player
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPlayer === player.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              <div className="font-medium">{player.name}</div>
              {existingPalaces.find((p) => p.playerId === player.id) && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Palace Created ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedPlayer && !showLocationBuilder && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Choose Your Palace Type
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLACE_TYPES.map((placeType) => {
              const Icon = placeType.icon;
              return (
                <button
                  key={placeType.id}
                  onClick={() => handlePlaceTypeSelect(placeType.id)}
                  className="p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6 text-blue-500" />
                    <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {placeType.name}
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {placeType.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showLocationBuilder && selectedPlaceTypeInfo && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <selectedPlaceTypeInfo.icon className="w-6 h-6 text-blue-500" />
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                {selectedPlaceTypeInfo.name}
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {selectedPlaceTypeInfo.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Palace Name
              </label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="e.g., 'Grandmother's Kitchen', 'The Old Oak Trail', 'Room 204'"
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Palace Locations ({locations.length})
                </h4>
                <Button onClick={addLocation} variant="secondary" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Location
                </Button>
              </div>

              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-neutral-800 dark:text-neutral-200">
                      Location {index + 1}
                    </h5>
                    <button
                      onClick={() => removeLocation(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={location.name || ""}
                    onChange={(e) =>
                      updateLocation(index, "name", e.target.value)
                    }
                    placeholder="Location name (e.g., 'The reading corner')"
                    className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  />

                  <textarea
                    value={location.description || ""}
                    onChange={(e) =>
                      updateLocation(index, "description", e.target.value)
                    }
                    placeholder="Describe this location in detail..."
                    rows={2}
                    className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowLocationBuilder(false);
                  setSelectedPlaceType("");
                  setPlaceName("");
                  setLocations([]);
                }}
                variant="secondary"
              >
                Back
              </Button>
              <Button onClick={savePalace} variant="primary" className="flex-1">
                Save Palace
              </Button>
            </div>
          </div>
        </div>
      )}

      {existingPalaces.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
            Created Palaces
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {existingPalaces.map((palace) => (
              <div
                key={palace.id}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Map className="w-5 h-5 text-blue-500" />
                  <h5 className="font-medium text-neutral-800 dark:text-neutral-200">
                    {palace.placeName}
                  </h5>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  by {palace.playerName} • {palace.locations.length} locations
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
