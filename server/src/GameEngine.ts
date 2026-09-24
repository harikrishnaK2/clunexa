export type GamePhase =
  | 'LOBBY'
  | 'ROUND_INTRO'
  | 'CLUE_SUBMISSION'
  | 'CLUE_REVEAL'
  | 'GUESSING'
  | 'ROUND_RESULT'
  | 'GAME_OVER';

export interface Player {
  id: string;         // socket.id (changes on reconnect)
  token: string;      // persistent uuid for reconnect
  name: string;
  score: number;
  isHost: boolean;
  connected: boolean;
  avatarSeed: number; // 0–7
}

export interface ClueSubmission {
  playerId: string;
  rawClue: string;
  normalized: string;
  isDuplicate: boolean;
}

export interface Room {
  code: string;
  hostId: string;
  players: Map<string, Player>;
  phase: GamePhase;
  settings: {
    roundsPerPlayer: number;
    submissionTimeSec: number;
    guessTimeSec: number;
  };
  roundNumber: number;
  totalRounds: number;
  guesserIndex: number;
  secretWord: string;
  category: string;
  clues: Map<string, ClueSubmission>;
  guess: string | null;
  isCorrect: boolean | null;
  scoreDeltas: Record<string, number> | null;
  usedWords: Set<string>;
  timerHandle: ReturnType<typeof setInterval> | null;
  timeRemaining: number;
  guesserOrder: string[];
}

// ─── Client-safe types ────────────────────────────────────────────────────────

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
  /** null when receiver IS the guesser during active play */
  secretWord: string | null;
  timeRemaining: number;
  submissionProgress: {
    total: number;
    submitted: number;
    submittedIds: string[];
  };
  /**
   * null until CLUE_REVEAL begins.
   * During GUESSING: unique clues only (duplicates hidden for guesser UX,
   * but still included so watchers see all).
   */
  clues: Array<{
    playerId: string;
    playerName: string;
    rawClue: string;
    isDuplicate: boolean;
  }> | null;
  guess: string | null;
  isCorrect: boolean | null;
  scoreDeltas: Record<string, number> | null;
  settings: {
    submissionTimeSec: number;
    guessTimeSec: number;
    roundsPerPlayer: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function normalizeClue(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function detectDuplicates(clues: Map<string, ClueSubmission>): void {
  const freq = new Map<string, number>();
  for (const c of clues.values()) {
    freq.set(c.normalized, (freq.get(c.normalized) || 0) + 1);
  }
  for (const c of clues.values()) {
    c.isDuplicate = (freq.get(c.normalized) || 0) > 1;
  }
}

// ─── State serialization (role-masked) ───────────────────────────────────────

export function buildClientState(room: Room, forPlayerId: string): ClientGameState {
  const playersArr = Array.from(room.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    isHost: p.isHost,
    connected: p.connected,
    avatarSeed: p.avatarSeed,
  }));

  const myPlayer = room.players.get(forPlayerId);
  const guesserId = room.guesserOrder[room.guesserIndex] ?? '';
  const guesserPlayer = room.players.get(guesserId);
  const isGuesser = forPlayerId === guesserId;

  // ── Security: never leak secretWord to guesser during active play ──────────
  const phaseReveal: GamePhase[] = ['ROUND_RESULT', 'GAME_OVER', 'LOBBY'];
  const secretWord = (isGuesser && !phaseReveal.includes(room.phase))
    ? null
    : room.secretWord || null;

  // ── Clue visibility rules ──────────────────────────────────────────────────
  //  - LOBBY / ROUND_INTRO / CLUE_SUBMISSION: no clue text to anyone
  //  - CLUE_REVEAL onwards: full list with isDuplicate flags
  let cluesArray: ClientGameState['clues'] = null;
  const clueVisiblePhases: GamePhase[] = ['CLUE_REVEAL', 'GUESSING', 'ROUND_RESULT', 'GAME_OVER'];
  if (clueVisiblePhases.includes(room.phase)) {
    cluesArray = Array.from(room.clues.values()).map(c => ({
      playerId: c.playerId,
      playerName: room.players.get(c.playerId)?.name ?? 'Unknown',
      rawClue: c.rawClue,
      isDuplicate: c.isDuplicate,
    }));
  }

  // Submission progress (no text, just status)
  const giversTotal = Math.max(0, room.players.size - (room.guesserOrder.length > 0 ? 1 : 0));

  return {
    roomCode: room.code,
    phase: room.phase,
    players: playersArr,
    myId: forPlayerId,
    isHost: myPlayer?.isHost ?? false,
    roundNumber: room.roundNumber,
    totalRounds: room.totalRounds,
    guesserId,
    guesserName: guesserPlayer?.name ?? '',
    isGuesser,
    category: room.category ?? '',
    secretWord,
    timeRemaining: room.timeRemaining,
    submissionProgress: {
      total: giversTotal,
      submitted: room.clues.size,
      submittedIds: Array.from(room.clues.keys()),
    },
    clues: cluesArray,
    guess: room.guess,
    isCorrect: room.isCorrect,
    scoreDeltas: room.scoreDeltas,
    settings: {
      submissionTimeSec: room.settings.submissionTimeSec,
      guessTimeSec: room.settings.guessTimeSec,
      roundsPerPlayer: room.settings.roundsPerPlayer,
    },
  };
}
