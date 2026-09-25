import React, { useState } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { RadialTimer } from '../ui/Global';

// ─── Clue Submission (Clue Typer only) ────────────────────────────────────────

export const ClueSubmissionView = ({
  gameState,
  actions,
  timeRemaining,
  errorMessage,
}: {
  gameState: ClientGameState;
  actions: GameActions;
  timeRemaining: number;
  errorMessage?: string | null;
}) => {
  const [clue, setClue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Reset local state if a new round starts
  React.useEffect(() => {
    setHasSubmitted(false);
    setClue('');
    setError('');
  }, [gameState.roundNumber]);

  // Unlock input if server rejected the clue or emitted an error
  React.useEffect(() => {
    if (errorMessage) {
      setHasSubmitted(false);
      setError(errorMessage);
    }
  }, [errorMessage]);

  const isAlreadySubmitted = hasSubmitted && gameState.clue !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = clue.trim();
    if (!trimmed) {
      setError('Please enter a clue.');
      return;
    }
    // Disallow multiple words (any whitespace inside the trimmed clue)
    if (/\s/.test(trimmed)) {
      setError('One word only — no multiple words!');
      return;
    }
    // Reject emojis or non-letters
    if (!/^[a-zA-Z]+$/.test(trimmed)) {
      setError('Letters only! No emojis, numbers, or symbols.');
      return;
    }
    if (trimmed.length > 20) {
      setError('Too long! Max 20 characters.');
      return;
    }
    // Check if clue matches secret word (client-side validation prevents lock-out)
    const normClue = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normSecret = (gameState.secretWord || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normClue && normSecret && normClue === normSecret) {
      setError('You cannot use the secret word as your clue! Try another word.');
      // KEEP INPUT UNLOCKED so the user can immediately retype!
      return;
    }

    setError('');
    actions.submitClue(trimmed);
    setHasSubmitted(true);
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col animate-slide-up">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <div>
          <div className="text-xs text-muted uppercase tracking-widest font-semibold mb-1">
            Round {gameState.roundNumber} / {gameState.totalRounds}
          </div>
          <div className="inline-flex items-center gap-2 bg-brand/15 border border-brand/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-brand-light animate-pulse" />
            <span className="text-brand-light text-xs font-bold uppercase tracking-wide">You are the Clue Typer</span>
          </div>
        </div>
        <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.submissionTimeSec ?? 45} />
      </div>

      {/* Secret word card */}
      <div className="bg-surface border-2 border-cyan-glow/40 rounded-2xl p-6 text-center mb-6 shadow-lg shadow-cyan-glow/10">
        <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-2">
          Secret Word · {gameState.category}
        </p>
        <div className="font-display text-5xl md:text-6xl text-cyan-glow font-bold tracking-wider uppercase my-4">
          {gameState.secretWord}
        </div>
        <div className="bg-amber-hot/10 border border-amber-hot/20 rounded-xl px-4 py-2 inline-block">
          <p className="text-amber-hot text-xs font-semibold">
            💡 Submit ONE clue to help other players guess this word!
          </p>
        </div>
      </div>

      {/* Input or submitted state */}
      {!isAlreadySubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={clue}
              onChange={e => {
                const rawVal = e.target.value;
                if (!rawVal) {
                  setClue('');
                  setError('');
                  return;
                }

                // Strip leading spaces
                const noLeadingSpaces = rawVal.replace(/^\s+/, '');
                if (!noLeadingSpaces) {
                  setClue('');
                  return;
                }

                // Allow 1 word (letters only, max 20) followed by optional spaces
                // Any second word or invalid character typed after the space is completely ignored/not accepted
                const match = noLeadingSpaces.match(/^([a-zA-Z]{1,20})(\s*)/);
                if (match) {
                  const allowedValue = match[1] + match[2];
                  setClue(allowedValue);
                  setError('');
                }
              }}
              placeholder="Type your clue…"
              autoFocus
              autoComplete="off"
              className="bg-surface-alt border border-white/10 text-ink rounded-xl px-5 py-5 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 w-full text-center text-3xl font-display font-bold uppercase tracking-wider transition-all duration-150 placeholder:text-white/20 placeholder:font-normal placeholder:text-lg placeholder:tracking-normal"
            />
            <div className="absolute bottom-2 right-3 text-xs text-muted font-mono">
              {clue.trim().length}/20
            </div>
          </div>

          <p className="text-muted/60 text-xs text-center font-medium">
            Single word · Spaces allowed after the word · Letters only
          </p>

          {error && (
            <div className="p-3 bg-crimson-clash/10 border border-crimson-clash/30 rounded-xl">
              <p className="text-crimson-clash text-sm text-center font-semibold animate-fade-in">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!clue.trim()}
            className="py-5 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-brand hover:bg-brand-light text-ink shadow-lg shadow-brand/30 mt-2 flex items-center justify-center gap-2"
          >
            <span>Lock in Clue</span>
            <span>🔒</span>
          </button>
        </form>
      ) : (
        <div className="bg-surface border border-emerald-alive/30 rounded-2xl p-8 text-center animate-score-pop">
          <div className="w-16 h-16 bg-emerald-alive/20 text-emerald-alive rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="font-display text-xl font-bold text-emerald-alive mb-2">Clue Locked In!</h3>
          <p className="text-muted text-sm mb-4">Revealing clue to other players…</p>
          <button
            type="button"
            onClick={() => setHasSubmitted(false)}
            className="text-xs text-brand-light hover:underline font-medium"
          >
            Edit Clue ✎
          </button>
        </div>
      )}

      {/* Scoring hint for clue giver */}
      <div className="mt-auto pt-8 pb-4 text-center">
        <p className="text-muted/70 text-xs">
          ⭐ You earn up to <strong className="text-amber-hot">50 points</strong> based on how many players guess your clue correctly!
        </p>
      </div>
    </div>
  );
};

// ─── Guesser waiting (while Clue Typer is typing) ─────────────────────────────

export const GuesserWaitingView = ({
  gameState,
  timeRemaining,
}: {
  gameState: ClientGameState;
  timeRemaining: number;
}) => {
  const clueGiverName = gameState.clueGiverName || gameState.guesserName || 'The Clue Typer';

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col items-center justify-center animate-fade-in text-center">
      {/* Role badge */}
      <div className="inline-flex items-center gap-2 bg-cyan-glow/15 border border-cyan-glow/30 rounded-full px-4 py-1.5 mb-8">
        <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
        <span className="text-cyan-glow text-xs font-bold uppercase tracking-wide">You are Guessing</span>
      </div>

      <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.submissionTimeSec ?? 45} />

      <div className="mt-10 mb-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-light">
          {clueGiverName} is typing a clue…
        </h2>
        <p className="text-muted mt-3 text-lg">
          The category is <span className="text-ink font-semibold">{gameState.category}</span>.
        </p>
      </div>

      {/* Radar pulse graphic */}
      <div className="relative w-32 h-32 my-8">
        <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-brand/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        <div className="absolute inset-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center">
          <span className="text-2xl">✍️</span>
        </div>
      </div>

      <p className="text-sm text-muted mb-2">
        Get ready to guess the secret word once the clue is revealed!
      </p>
    </div>
  );
};
