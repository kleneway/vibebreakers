import React from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  Sparkles,
  Clock,
  BookOpen,
  Lightbulb,
  MapPin,
  MessageCircle,
  ArrowRight,
  Timer,
  Zap,
} from "lucide-react";

// Game data with beautiful descriptions and icons
const games = [
  {
    id: "empathy-game",
    title: "Empathy Enigma",
    description:
      "Dive deep into understanding and connecting with others through empathy-building challenges and emotional intelligence exercises.",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    hoverColor: "hover:from-pink-600 hover:to-rose-700",
    participants: "4-8 players",
    duration: "25-30 min",
    difficulty: "Medium",
  },
  {
    id: "future-self-letters",
    title: "Future Self Letters",
    description:
      "Write heartfelt letters to your future self, then exchange them anonymously for mutual inspiration and wisdom sharing.",
    icon: BookOpen,
    color: "from-blue-500 to-purple-600",
    hoverColor: "hover:from-blue-600 hover:to-purple-700",
    participants: "3-6 players",
    duration: "20-25 min",
    difficulty: "Easy",
  },
  {
    id: "invisible-superpowers",
    title: "Invisible Superpowers",
    description:
      "Discover and celebrate each other's subtle but powerful strengths by identifying unique talents and positive qualities.",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    hoverColor: "hover:from-yellow-600 hover:to-orange-700",
    participants: "3-8 players",
    duration: "15-20 min",
    difficulty: "Easy",
  },
  {
    id: "time-travel",
    title: "Time Travel Adventures",
    description:
      "Explore different eras and time periods while sharing stories, making predictions, and connecting across time.",
    icon: Clock,
    color: "from-indigo-500 to-blue-600",
    hoverColor: "hover:from-indigo-600 hover:to-blue-700",
    participants: "4-10 players",
    duration: "20-30 min",
    difficulty: "Medium",
  },
  {
    id: "story-building-symphony",
    title: "Story Building Symphony",
    description:
      "Collaborate to create amazing stories together, with each person adding their unique voice to the narrative.",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-600",
    hoverColor: "hover:from-emerald-600 hover:to-teal-700",
    participants: "3-12 players",
    duration: "15-25 min",
    difficulty: "Easy",
  },
  {
    id: "two-truths-and-lie",
    title: "Two Truths and a Lie",
    description:
      "The classic icebreaker! Share three statements about yourself and let others guess which one is the lie.",
    icon: Users,
    color: "from-violet-500 to-purple-600",
    hoverColor: "hover:from-violet-600 hover:to-purple-700",
    participants: "3-15 players",
    duration: "10-20 min",
    difficulty: "Easy",
  },
  {
    id: "memory-palace",
    title: "Memory Palace Exchange",
    description:
      "Create detailed mental maps of meaningful places, then guide others through these spaces while sharing connected stories.",
    icon: MapPin,
    color: "from-cyan-500 to-blue-600",
    hoverColor: "hover:from-cyan-600 hover:to-blue-700",
    participants: "4-6 players",
    duration: "25-35 min",
    difficulty: "Hard",
  },
  {
    id: "question-ladder",
    title: "The Question Ladder",
    description:
      "Climb from surface-level conversation to profound personal insights through the power of thoughtful questioning.",
    icon: MessageCircle,
    color: "from-red-500 to-pink-600",
    hoverColor: "hover:from-red-600 hover:to-pink-700",
    participants: "2-8 players",
    duration: "30-40 min",
    difficulty: "Hard",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    case "Medium":
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    case "Hard":
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="text-6xl md:text-8xl mb-6">🎯🎪🎮</div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                Vibebreakers
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Transform any gathering into an unforgettable experience with
                our collection of interactive icebreaker games. Perfect for
                teams, parties, and new connections.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>2-15 players</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <span>10-40 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>8 unique games</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Adventure
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Each game is designed to break the ice, build connections, and
                create memorable moments. Select the perfect game for your group
                and situation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => {
                const IconComponent = game.icon;
                return (
                  <Link
                    key={game.id}
                    href={`/${game.id}`}
                    className="group block"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-2">
                      {/* Card Header with Gradient */}
                      <div
                        className={`h-32 bg-gradient-to-br ${game.color} ${game.hoverColor} p-6 flex items-center justify-center transition-all duration-300`}
                      >
                        <IconComponent className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {game.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {game.description}
                          </p>
                        </div>

                        {/* Game Stats */}
                        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Users className="w-3 h-3" />
                              {game.participants}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              {game.duration}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                                game.difficulty,
                              )}`}
                            >
                              {game.difficulty}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Vibebreakers?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Designed for real human connection in the digital age
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Scientifically Designed
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Each game leverages psychology principles to foster genuine
                  connections and meaningful conversations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Flexible & Inclusive
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Adaptable to any group size, culture, or setting. Everyone can
                  participate regardless of personality type.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Memorable Moments
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create lasting memories and strengthen relationships through
                  shared laughter and discovery.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Vibebreakers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bringing people together through the power of interactive games
                and meaningful connections.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Vibebreakers. All rights reserved.
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quick Start
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    href="/two-truths-and-lie"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Two Truths & a Lie
                  </Link>
                </li>
                <li>
                  <Link
                    href="/invisible-superpowers"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Invisible Superpowers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/story-building-symphony"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Story Symphony
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Deep Dive
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    href="/question-ladder"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Question Ladder
                  </Link>
                </li>
                <li>
                  <Link
                    href="/memory-palace"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Memory Palace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/future-self-letters"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Future Self Letters
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
