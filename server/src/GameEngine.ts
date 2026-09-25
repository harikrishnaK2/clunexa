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

export interface PlayerGuess {
  playerId: string;
  playerName: string;
  guess: string;
  isCorrect: boolean;
  guessTimeMs: number;
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
  clueGiverIndex: number;
  secretWord: string;
  category: string;
  categoryFilter: string;
  clue: string | null;
  clues: Map<string, ClueSubmission>;
  guesses: Map<string, PlayerGuess>;
  guess: string | null;
  isCorrect: boolean | null;
  scoreDeltas: Record<string, number> | null;
  usedWords: Set<string>;
  guessingStartTime: number;
  streak: Map<string, number>;
  timerHandle: ReturnType<typeof setInterval> | null;
  timeRemaining: number;
  clueGiverOrder: string[];
  // Backwards compatibility aliases
  guesserOrder: string[];
  guesserIndex: number;
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
  const clueGiverOrder = room.clueGiverOrder.length > 0 ? room.clueGiverOrder : room.guesserOrder;
  const clueGiverIdx = room.clueGiverIndex >= 0 ? room.clueGiverIndex : (room.guesserIndex >= 0 ? room.guesserIndex : 0);
  const clueGiverId = clueGiverOrder[clueGiverIdx] ?? '';
  const clueGiverPlayer = room.players.get(clueGiverId);
  const isClueGiver = forPlayerId === clueGiverId;
  const isGuesser = !isClueGiver;

  // ── Security: never leak secretWord to guessers during active play ──────────
  const phaseReveal: GamePhase[] = ['ROUND_RESULT', 'GAME_OVER', 'LOBBY'];
  const secretWord = (!isClueGiver && !phaseReveal.includes(room.phase))
    ? null
    : room.secretWord || null;

  // ── Clue visibility rules ──────────────────────────────────────────────────
  //  - LOBBY / ROUND_INTRO: no clue text
  //  - CLUE_SUBMISSION: clue giver sees their own draft, guessers see nothing
  //  - CLUE_REVEAL onwards: visible to everyone
  const clueVisiblePhases: GamePhase[] = ['CLUE_REVEAL', 'GUESSING', 'ROUND_RESULT', 'GAME_OVER'];
  const visibleClue = clueVisiblePhases.includes(room.phase) ? (room.clue || null) : null;

  let cluesArray: ClientGameState['clues'] = null;
  if (visibleClue) {
    cluesArray = [{
      playerId: clueGiverId,
      playerName: clueGiverPlayer?.name ?? 'Clue Giver',
      rawClue: visibleClue,
      isDuplicate: false,
    }];
  }

  // Guesses list: only revealed in ROUND_RESULT / GAME_OVER to prevent copying
  let guessesArray: ClientGameState['guesses'] = null;
  if (['ROUND_RESULT', 'GAME_OVER'].includes(room.phase)) {
    guessesArray = Array.from(room.guesses.values()).map(g => ({
      playerId: g.playerId,
      playerName: g.playerName,
      guess: g.guess,
      isCorrect: g.isCorrect,
    }));
  }

  // Guessing progress
  const activeGuessers = Array.from(room.players.values()).filter(p => p.connected && p.id !== clueGiverId);
  const totalGuessers = activeGuessers.length;
  const submittedGuessCount = Array.from(room.guesses.keys()).filter(id => {
    const pl = room.players.get(id);
    return pl && pl.connected && id !== clueGiverId;
  }).length;
  const hasGuessed = room.guesses.has(forPlayerId);

  // Clue submission progress (1 clue giver)
  const isClueSubmitted = room.clue !== null;

  return {
    roomCode: room.code,
    phase: room.phase,
    players: playersArr,
    myId: forPlayerId,
    isHost: myPlayer?.isHost ?? false,
    roundNumber: room.roundNumber,
    totalRounds: room.totalRounds,
    clueGiverId,
    clueGiverName: clueGiverPlayer?.name ?? '',
    isClueGiver,
    isGuesser,
    guesserId: clueGiverId,
    guesserName: clueGiverPlayer?.name ?? '',
    category: room.category ?? '',
    categoryFilter: room.categoryFilter ?? 'All Mix',
    secretWord,
    clue: visibleClue,
    timeRemaining: room.timeRemaining,
    streaks: Object.fromEntries(room.streak || new Map()),
    submissionProgress: {
      total: 1,
      submitted: isClueSubmitted ? 1 : 0,
      submittedIds: isClueSubmitted ? [clueGiverId] : [],
    },
    clues: cluesArray,
    guesses: guessesArray,
    hasGuessed,
    guessProgress: {
      total: totalGuessers,
      submitted: submittedGuessCount,
    },
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
