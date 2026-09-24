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
  guesserId: string;
  guesserName: string;
  isGuesser: boolean;
  category: string;
  /** null if receiver IS guesser and phase is not ROUND_RESULT / GAME_OVER */
  secretWord: string | null;
  timeRemaining: number;
  submissionProgress: {
    total: number;
    submitted: number;
    submittedIds: string[];
  };
  /** null until CLUE_REVEAL begins */
  clues: Array<{
    playerId: string;
    playerName: string;
    rawClue: string;
    isDuplicate: boolean;
  }> | null;
  guess: string | null;
  isCorrect: boolean | null;
  scoreDeltas: Record<string, number> | null;
  /** Room settings reflected from server */
  settings?: {
    submissionTimeSec: number;
    guessTimeSec: number;
    roundsPerPlayer: number;
  };
}
