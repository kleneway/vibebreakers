# Icebreaker Games Plan

A collection of interactive icebreaker games to help people get to know each other in group settings.

## Game List

1. **Name Game** - Simple introductions with name repetition
2. **Human Bingo** - Find people who match different characteristics  
3. **Would You Rather** - Choose between two interesting options
4. **20 Questions** - Guess what someone is thinking of
5. **Speed Networking** - Quick partner rotations for brief conversations
6. **Common Ground** - Find shared interests and experiences
7. **Story Chain** - Collaborative storytelling where each person adds a sentence
8. **Two Truths and a Lie** ✅ - Share three statements, others guess which is false
9. **Desert Island** - What three items would you bring to a desert island?
10. **Time Machine** - If you could visit any time period, where would you go?

## Implementation Status

- ✅ Game 8: Two Truths and a Lie - Complete
  - Multi-phase gameplay (setup, statements, guessing, results)
  - Support for multiple players
  - Scoring system with winner announcement
  - Modern UI with Tailwind CSS
  - Toast notifications for game feedback
  - Fully responsive design

## Game 8: Two Truths and a Lie Details

**Objective**: Players create three statements about themselves - two true and one false. Other players try to identify the lie.

**Features**:
- Player management (add/remove players)
- Statement creation phase with lie marking
- Guessing phase with interactive voting
- Scoring and results display
- Game reset functionality

**Route**: `/game/two-truths-and-lie`

**Technology**: 
- React with TypeScript
- Tailwind CSS for styling
- React Toastify for notifications
- Lucide React for icons