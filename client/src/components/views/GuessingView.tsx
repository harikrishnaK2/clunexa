import React, { useState } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { RadialTimer } from '../ui/Global';

// ─── Guesser's view ───────────────────────────────────────────────────────────

export const GuessingView = ({
  gameState,
  actions,
  timeRemaining,
}: {
  gameState: ClientGameState;
  actions: GameActions;
  timeRemaining: number;
}) => {
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const uniqueClues = (gameState.clues ?? []).filter(c => !c.isDuplicate);
  const allDuplicated = (gameState.clues ?? []).length > 0 && uniqueClues.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !submitted) {
      actions.submitGuess(guess.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <div>
          <div className="text-xs text-muted uppercase tracking-widest font-semibold mb-1">
            Round {gameState.roundNumber} / {gameState.totalRounds}
          </div>
          <div className="inline-flex items-center gap-2 bg-cyan-glow/15 border border-cyan-glow/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            <span className="text-cyan-glow text-xs font-bold uppercase tracking-wide">Your Guess</span>
          </div>
        </div>
        <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.guessTimeSec ?? 30} />
      </div>

      {/* Category header */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
          What's the secret word?
        </h2>
        <div className="inline-block mt-2 bg-surface-alt border border-white/10 rounded-full px-4 py-1 text-muted text-sm font-semibold">
          Category: {gameState.category}
        </div>
      </div>

      {/* Clue chips */}
      <div className="mb-8">
        {allDuplicated ? (
          <div className="bg-crimson-clash/10 border-2 border-crimson-clash/40 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">💥</div>
            <h3 className="font-display text-xl font-bold text-crimson-clash mb-1">All clues were duplicates!</h3>
            <p className="text-muted text-sm">You're on your own for this one…</p>
          </div>
        ) : uniqueClues.length === 0 ? (
          <div className="bg-surface border border-white/8 rounded-2xl p-6 text-center text-muted">
            No clues available — waiting for reveal…
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {uniqueClues.map((c, i) => (
              <div
                key={i}
                className="bg-surface border-2 border-emerald-alive/60 rounded-xl px-6 py-4 text-center shadow-lg shadow-emerald-alive/10 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="font-display text-2xl md:text-3xl font-bold uppercase text-ink tracking-wide">
                  {c.rawClue}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guess form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto">
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Type your guess…"
            autoFocus
            autoComplete="off"
            className="bg-surface-alt border border-white/10 text-ink rounded-xl px-5 py-5 focus:outline-none focus:border-cyan-glow/60 focus:ring-2 focus:ring-cyan-glow/20 w-full text-center text-3xl font-display font-bold uppercase tracking-wider transition-all duration-150 placeholder:text-white/20 placeholder:font-normal placeholder:text-xl placeholder:tracking-normal"
          />
          <button
            type="submit"
            disabled={!guess.trim()}
            className="py-5 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-cyan-glow hover:bg-cyan-glow/80 text-void shadow-lg shadow-cyan-glow/30"
          >
            Submit Guess →
          </button>
          <p className="text-center text-muted text-xs">
            Press Enter or click Submit to lock in your answer
          </p>
        </form>
      ) : (
        <div className="bg-surface border border-brand/20 rounded-2xl p-8 text-center mt-auto">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="font-display text-xl font-bold text-brand-light">Guess submitted!</h3>
          <p className="text-muted text-sm mt-2">Waiting for the verdict…</p>
        </div>
      )}
    </div>
  );
};

// ─── Spectator view (clue givers watching the guesser) ───────────────────────

export const GuesserWatchingView = ({
  gameState,
  timeRemaining,
}: {
  gameState: ClientGameState;
  timeRemaining: number;
}) => {
  const uniqueClues = (gameState.clues ?? []).filter(c => !c.isDuplicate);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-6 pb-8">
        <div>
          <div className="text-xs text-muted uppercase tracking-widest font-semibold mb-1">
            Round {gameState.roundNumber} / {gameState.totalRounds}
          </div>
          <div className="inline-flex items-center gap-2 bg-surface-alt border border-white/10 rounded-full px-3 py-1">
            <span className="text-muted text-xs font-bold uppercase tracking-wide">Watching</span>
          </div>
        </div>
        <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.guessTimeSec ?? 30} />
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🤔</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-light">
          {gameState.guesserName} is thinking…
        </h2>
        <p className="text-muted mt-2 text-sm">Category: <span className="text-ink">{gameState.category}</span></p>
      </div>

      {/* Surviving clues (visible to watchers too) */}
      {uniqueClues.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {uniqueClues.map((c, i) => (
            <div
              key={i}
              className="bg-surface border border-white/15 rounded-xl px-5 py-3 text-center"
            >
              <div className="font-display text-xl font-bold uppercase text-muted">{c.rawClue}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-crimson-clash/10 border border-crimson-clash/30 rounded-2xl p-6 text-center">
          <p className="text-crimson-clash font-bold">No clues survived — guesser is flying blind!</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-light animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
