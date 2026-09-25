export type GamePhase =
  | 'LOBBY'
  | 'ROUND_INTRO'
  | 'CLUE_SUBMISSION'
  | 'CLUE_REVEAL'
  | 'GUESSING'
  | 'ROUND_RESULT'
  | 'GAME_OVER';

export interface ClientGameState {
  roomCode: string;
  phase: GamePhase;
  players: Array<{
    id: string;
    name: string;
    score: number;
    isHost: boolean;
    connected: boolean;
    avatarSeed: number;
  }>;
  myId: string;
  isHost: boolean;
  roundNumber: number;
  totalRounds: number;
  clueGiverId: string;
  clueGiverName: string;
  isClueGiver: boolean;
  isGuesser: boolean;
  // Aliases for compatibility
  guesserId: string;
  guesserName: string;
  category: string;
  categoryFilter: string;
  /** null when receiver is NOT the clue giver during active play */
  secretWord: string | null;
  clue: string | null;
  timeRemaining: number;
  streaks: Record<string, number>;
  submissionProgress: {
    total: number;
    submitted: number;
    submittedIds: string[];
  };
  clues: Array<{
    playerId: string;
    playerName: string;
    rawClue: string;
    isDuplicate: boolean;
  }> | null;
  guesses: Array<{
    playerId: string;
    playerName: string;
    guess: string;
    isCorrect: boolean;
  }> | null;
  hasGuessed: boolean;
  guessProgress: {
    total: number;
    submitted: number;
  };
  guess: string | null;
  isCorrect: boolean | null;
  scoreDeltas: Record<string, number> | null;
  settings?: {
    submissionTimeSec: number;
    guessTimeSec: number;
    roundsPerPlayer: number;
  };
}
