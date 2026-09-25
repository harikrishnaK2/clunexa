import React, { useState } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { RadialTimer } from '../ui/Global';
import { sounds } from '../../utils/sounds';

// ───────────────────────────────────────────────────────────

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

  const isAlreadySubmitted = submitted || gameState.hasGuessed;
  const clueWord = gameState.clue || (gameState.clues && gameState.clues[0]?.rawClue) || '???';
  const clueGiverName = gameState.clueGiverName || gameState.guesserName || 'Clue Typer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGuess = guess.trim();
    if (cleanGuess && !isAlreadySubmitted) {
      actions.submitGuess(cleanGuess);
      sounds.ding();
      setSubmitted(true);
    }
  };

  const totalGuessers = gameState.guessProgress?.total ?? Math.max(1, gameState.players.length - 1);
  const submittedGuessers = gameState.guessProgress?.submitted ?? (isAlreadySubmitted ? 1 : 0);

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
            <span className="text-cyan-glow text-xs font-bold uppercase tracking-wide">Guess the Word</span>
          </div>
        </div>
        <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.guessTimeSec ?? 30} />
      </div>

      {/* Category header */}
      <div className="text-center mb-4">
        <div className="inline-block bg-surface-alt border border-white/10 rounded-full px-4 py-1 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
          Category: <span className="text-ink font-bold">{gameState.category}</span>
        </div>
        <p className="text-muted text-xs">Clue given by {clueGiverName}</p>
      </div>

      {/* Dynamically-sized Clue card that adjusts to the size of the word */}
      <div className="flex justify-center mb-6 w-full">
        <div
          className={`bg-surface border-2 border-emerald-alive/80 rounded-2xl shadow-xl shadow-emerald-alive/15 animate-slide-up inline-flex flex-col items-center justify-center max-w-full text-center transition-all duration-300 ${
            clueWord.length > 12
              ? 'px-4 py-4 w-full'
              : clueWord.length > 7
              ? 'px-8 py-5 w-auto'
              : 'px-10 py-5 w-auto'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-alive animate-pulse" />
            <p className="text-[11px] uppercase tracking-widest text-emerald-alive font-bold">
              The Clue
            </p>
          </div>
          <div
            className={`font-display font-bold uppercase text-ink break-words break-all max-w-full my-1 leading-tight ${
              clueWord.length > 15
                ? 'text-xl sm:text-2xl tracking-normal'
                : clueWord.length > 11
                ? 'text-2xl sm:text-3xl tracking-wide'
                : clueWord.length > 7
                ? 'text-3xl sm:text-4xl tracking-wider'
                : 'text-4xl sm:text-5xl tracking-widest'
            }`}
          >
            {clueWord}
          </div>
        </div>
      </div>

      {/* Guess form or locked-in state */}
      {!isAlreadySubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto">
          <input
            type="text"
            value={guess}
            onChange={e => {
              // English letters and spaces only
              const clean = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setGuess(clean);
            }}
            placeholder="Type your guess..."
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
        <div className="bg-surface border border-brand/20 rounded-2xl p-8 text-center mt-auto animate-score-pop">
          <div className="text-4xl mb-3 text-emerald-alive">✓</div>
          <h3 className="font-display text-xl font-bold text-cyan-glow">Guess Locked In!</h3>
          <p className="text-muted text-sm mt-2">Waiting for other players to submit their guesses...</p>
        </div>
      )}

      {/* Live guess progress indicator */}
      <div className="pt-6 pb-4 text-center">
        <p className="text-xs text-muted">
          <span className="text-ink font-bold">{submittedGuessers}</span> of {totalGuessers} players have guessed
        </p>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────

export const GuesserWatchingView = ({
  gameState,
  timeRemaining,
}: {
  gameState: ClientGameState;
  timeRemaining: number;
}) => {
  const clueWord = gameState.clue || (gameState.clues && gameState.clues[0]?.rawClue) || '???';
  const totalGuessers = gameState.guessProgress?.total ?? Math.max(1, gameState.players.length - 1);
  const submittedGuessers = gameState.guessProgress?.submitted ?? 0;

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col animate-fade-in text-center">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-6 pb-6">
        <div>
          <div className="text-xs text-muted uppercase tracking-widest font-semibold mb-1">
            Round {gameState.roundNumber} / {gameState.totalRounds}
          </div>
          <div className="inline-flex items-center gap-2 bg-brand/15 border border-brand/30 rounded-full px-3 py-1">
            <span className="text-brand-light text-xs font-bold uppercase tracking-wide">Clue Typer</span>
          </div>
        </div>
        <RadialTimer seconds={timeRemaining} maxSeconds={gameState.settings?.guessTimeSec ?? 30} />
      </div>

      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-brand-light">
          Players are guessing!
        </h2>
        <p className="text-muted mt-2 text-sm">
          They're trying to deduce the secret word from your clue.
        </p>
      </div>

      {/* Secret Word & Clue summary card */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8 text-left flex flex-col gap-4">
        <div>
          <span className="text-xs text-muted uppercase tracking-wider font-semibold block">Secret Word</span>
          <span className="text-2xl font-display font-bold text-cyan-glow uppercase tracking-wide">
            {gameState.secretWord}
          </span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <span className="text-xs text-muted uppercase tracking-wider font-semibold block">Your Clue</span>
          <span className="text-2xl font-display font-bold text-emerald-alive uppercase tracking-wide">
            {clueWord}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-auto bg-surface-alt/50 border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-sm font-semibold text-ink mb-3">
          {submittedGuessers} of {totalGuessers} players have locked in their guess
        </p>
        <div className="w-full bg-surface rounded-full h-3 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-brand to-cyan-glow h-full transition-all duration-300"
            style={{ width: `${totalGuessers > 0 ? (submittedGuessers / totalGuessers) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-3">
          ⭐ The more players guess correctly, the more points you earn (up to 50 pts)!
        </p>
      </div>
    </div>
  );
};


