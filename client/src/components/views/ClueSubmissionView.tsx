import React, { useState } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { RadialTimer } from '../ui/Global';

// ─── Clue Submission (non-guesser) ───────────────────────────────────────────

export const ClueSubmissionView = ({
  gameState,
  actions,
  timeRemaining,
}: {
  gameState: ClientGameState;
  actions: GameActions;
  timeRemaining: number;
}) => {
  const [clue, setClue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isAlreadySubmitted =
    hasSubmitted || gameState.submissionProgress.submittedIds.includes(gameState.myId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = clue.trim();
    if (!trimmed) { setError('Please enter a clue.'); return; }
    if (trimmed.includes(' ')) { setError('One word only — no spaces!'); return; }
    if (trimmed.length > 20) { setError('Too long! Max 20 characters.'); return; }
    setError('');
    actions.submitClue(trimmed);
    setHasSubmitted(true);
  };

  const { submitted, total } = gameState.submissionProgress;

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
            <span className="text-brand-light text-xs font-bold uppercase tracking-wide">Clue Giver</span>
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
            ⚡ Submit ONE word · Don't copy others — it cancels out!
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
                setClue(e.target.value);
                setError('');
              }}
              placeholder="Your clue word…"
              maxLength={20}
              autoFocus
              autoComplete="off"
              className="bg-surface-alt border border-white/10 text-ink rounded-xl px-5 py-5 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 w-full text-center text-3xl font-display font-bold uppercase tracking-wider transition-all duration-150 placeholder:text-white/20 placeholder:font-normal placeholder:text-lg placeholder:tracking-normal"
            />
            <div className="absolute bottom-2 right-3 text-xs text-muted font-mono">
              {clue.length}/20
            </div>
          </div>
          {error && (
            <p className="text-crimson-clash text-sm text-center font-semibold animate-fade-in">{error}</p>
          )}
          <button
            type="submit"
            disabled={!clue.trim() || clue.includes(' ')}
            className="py-5 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-brand hover:bg-brand-light text-ink shadow-lg shadow-brand/30"
          >
            Lock In Clue →
          </button>
        </form>
      ) : (
        <div className="bg-surface border border-emerald-alive/30 rounded-2xl p-8 text-center animate-score-pop">
          <div className="w-16 h-16 bg-emerald-alive/20 text-emerald-alive rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="font-display text-xl font-bold text-emerald-alive mb-2">Clue locked in!</h3>
          <p className="text-muted">Waiting for others to submit…</p>
        </div>
      )}

      {/* Submission progress dots */}
      <div className="mt-auto pt-8 pb-6">
        <p className="text-center text-sm text-muted mb-4">
          <span className="text-ink font-semibold">{submitted}</span> of {total} clues submitted
        </p>
        <div className="flex justify-center gap-3">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                i < submitted ? 'bg-emerald-alive scale-110' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Guesser waiting (during clue submission) ─────────────────────────────────

export const GuesserWaitingView = ({
  gameState,
  timeRemaining,
}: {
  gameState: ClientGameState;
  timeRemaining: number;
}) => {
  const { submitted, total } = gameState.submissionProgress;

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col items-center justify-center animate-fade-in text-center">
      {/* Role badge */}
      <div className="inline-flex items-center gap-2 bg-cyan-glow/15 border border-cyan-glow/30 rounded-full px-4 py-1.5 mb-8">
        <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
        <span className="text-cyan-glow text-xs font-bold uppercase tracking-wide">You are the Guesser</span>
      </div>

      <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.submissionTimeSec ?? 45} />

      <div className="mt-10 mb-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-light">
          Your friends are plotting…
        </h2>
        <p className="text-muted mt-3 text-lg">
          They're crafting clues for a <span className="text-ink font-semibold">{gameState.category}</span> word.
        </p>
      </div>

      {/* Radar pulse graphic */}
      <div className="relative w-32 h-32 my-8">
        <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-brand/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        <div className="absolute inset-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center">
          <span className="text-2xl">👁</span>
        </div>
      </div>

      <p className="text-sm text-muted mb-4">
        <span className="text-ink font-semibold">{submitted}</span> of {total} clues submitted
      </p>
      <div className="flex justify-center gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              i < submitted ? 'bg-brand-light scale-110' : 'bg-white/10 animate-pulse'
            }`}
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
};
