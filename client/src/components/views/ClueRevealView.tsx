import React from 'react';
import { ClientGameState } from '../../types/game';

export const ClueRevealView = ({ gameState }: { gameState: ClientGameState }) => {
  const clueGiverName = gameState.clueGiverName || gameState.guesserName || 'Clue Typer';
  const clueText = gameState.clue || (gameState.clues && gameState.clues[0]?.rawClue) || '???';

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col items-center justify-center animate-fade-in text-center">
      <div className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">
        Round {gameState.roundNumber} / {gameState.totalRounds} · {gameState.category}
      </div>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-light mb-8 animate-slide-up">
        THE CLUE IS IN!
      </h1>

      {/* Hero Clue Card */}
      <div className="w-full bg-surface border-2 border-emerald-alive rounded-3xl p-8 shadow-2xl shadow-emerald-alive/20 animate-score-pop relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-emerald-alive to-cyan-glow" />

        <p className="text-xs uppercase tracking-widest text-emerald-alive font-bold mb-3">
          Clue from {clueGiverName}
        </p>

        <div className="font-display text-5xl md:text-6xl font-bold uppercase tracking-wider text-ink my-4">
          {clueText}
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-alive/10 border border-emerald-alive/30 rounded-full px-4 py-1.5 mt-2">
          <span className="text-emerald-alive text-xs font-bold uppercase tracking-wide">
            ✓ Official Clue
          </span>
        </div>
      </div>

      <p className="text-muted mt-8 text-sm animate-pulse">
        {gameState.isClueGiver
          ? 'Other players are preparing their guesses…'
          : 'Prepare your guess! Guessing starts now…'}
      </p>
    </div>
  );
};
