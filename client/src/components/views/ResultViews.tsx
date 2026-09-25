import React, { useEffect } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { PlayerAvatar } from '../ui/Global';
import confetti from 'canvas-confetti';

// ─── Round Result ─────────────────────────────────────────────────────────────

export const RoundResultView = ({ gameState }: { gameState: ClientGameState }) => {
  const isCorrect = gameState.isCorrect;
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col animate-fade-in pb-10">
      {/* Result banner */}
      <div className={`text-center py-8 rounded-2xl mt-6 mb-6 ${
        isCorrect
          ? 'bg-emerald-alive/10 border-2 border-emerald-alive/40'
          : 'bg-crimson-clash/10 border-2 border-crimson-clash/40'
      }`}>
        {isCorrect ? (
          <>
            <div className="font-display text-4xl md:text-5xl font-bold text-emerald-alive animate-score-pop">
              CORRECT! 🎉
            </div>
            <p className="text-muted mt-3 text-lg">
              <span className="text-ink font-bold">{gameState.guesserName}</span> guessed it!
            </p>
            <div className="mt-3 bg-surface-alt inline-block px-4 py-1 rounded-full">
              <span className="font-mono font-bold text-emerald-alive">
                {gameState.secretWord?.toUpperCase()}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="font-display text-4xl md:text-5xl font-bold text-crimson-clash">
              {gameState.guess ? 'WRONG!' : "TIME'S UP!"}
            </div>
            {gameState.guess && (
              <p className="text-muted mt-2">
                <span className="text-ink font-bold">{gameState.guesserName}</span> guessed:{' '}
                <span className="text-crimson-clash font-bold">{gameState.guess}</span>
              </p>
            )}
            <p className="text-muted mt-3">The word was</p>
            <div className="mt-1 font-display text-3xl font-bold text-ink">
              {gameState.secretWord}
            </div>
          </>
        )}
      </div>

      {/* Clue audit */}
      {gameState.clues && gameState.clues.length > 0 && (
        <div className="bg-surface border border-white/8 rounded-2xl p-5 mb-6">
          <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-4">Clue Breakdown</h3>

          {/* Guesser row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-glow uppercase bg-cyan-glow/20 px-2 py-0.5 rounded-full">Guesser</span>
              <span className="font-semibold text-sm">{gameState.guesserName}</span>
            </div>
            <div className={`font-bold font-mono text-lg ${isCorrect ? 'text-emerald-alive' : 'text-muted'}`}>
              {isCorrect ? '+100' : '+0'}
            </div>
          </div>

          <div className="w-full h-px bg-white/8 my-2" />

          {gameState.clues.map((c, i) => {
            const delta = gameState.scoreDeltas?.[c.playerId] ?? 0;
            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-alt/50 mb-1.5 last:mb-0"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate">{c.playerName}</span>
                  <span className="text-muted text-sm">"{c.rawClue}"</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {c.isDuplicate ? (
                    <span className="text-xs font-bold text-crimson-clash bg-crimson-clash/10 px-2 py-0.5 rounded-full">
                      DUPLICATE
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-alive bg-emerald-alive/10 px-2 py-0.5 rounded-full">
                      UNIQUE
                    </span>
                  )}
                  <div className={`font-bold font-mono w-10 text-right ${delta > 0 ? 'text-emerald-alive' : 'text-muted'}`}>
                    +{delta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live leaderboard */}
      <div className="bg-surface border border-white/8 rounded-2xl p-5">
        <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-4">Leaderboard</h3>
        <div className="flex flex-col gap-2">
          {sortedPlayers.map((p, i) => {
            const maxScore = sortedPlayers[0]?.score || 1;
            const barWidth = maxScore > 0 ? Math.max(4, (p.score / maxScore) * 100) : 4;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-5 text-center font-bold text-xs text-muted">{i + 1}</div>
                <div className="font-semibold text-sm w-24 truncate">{p.name}</div>
                <div className="flex-1 bg-surface-alt rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-700"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <div className="font-mono font-bold text-sm text-brand-light w-10 text-right">
                  {p.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-muted text-xs mt-6 animate-pulse">
        Next round starting in a few seconds…
      </p>
    </div>
  );
};

// ─── Game Over / Winner Podium ────────────────────────────────────────────────

export const GameOverView = ({
  gameState,
  actions,
}: {
  gameState: ClientGameState;
  actions: GameActions;
}) => {
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const [first, second, third] = sortedPlayers;

  useEffect(() => {
    // Launch confetti!
    const burst = () => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5, x: 0.3 },
        colors: ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#A78BFA'],
      });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5, x: 0.7 },
        colors: ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#A78BFA'],
      });
    };
    burst();
    const t = setTimeout(burst, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col items-center animate-fade-in pb-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-light mt-8 mb-2">
        GAME OVER
      </h1>
      <p className="text-muted mb-10">
        🏆 <span className="text-ink font-bold">{first?.name}</span> wins!
      </p>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 w-full mb-10">
        {/* 2nd place */}
        <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '300ms' }}>
          <PlayerAvatar name={second?.name ?? ''} seed={second?.avatarSeed ?? 1} />
          <div className="w-24 md:w-28 bg-surface-alt border border-white/10 h-20 mt-3 rounded-t-xl flex flex-col items-center justify-end pb-2">
            <span className="font-display font-bold text-2xl text-muted">2</span>
          </div>
          <div className="font-mono text-sm font-bold text-muted mt-1">{second?.score ?? 0} pts</div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center animate-slide-up z-10" style={{ animationDelay: '500ms' }}>
          <div className="text-3xl mb-1 animate-bounce">👑</div>
          <PlayerAvatar name={first?.name ?? ''} seed={first?.avatarSeed ?? 0} size="lg" />
          <div className="w-28 md:w-32 bg-brand/20 border-2 border-brand h-32 mt-3 rounded-t-xl flex flex-col items-center justify-end pb-2">
            <span className="font-display font-bold text-3xl text-brand-light">1</span>
          </div>
          <div className="font-mono text-sm font-bold text-brand-light mt-1">{first?.score ?? 0} pts</div>
        </div>

        {/* 3rd place */}
        {third && (
          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '100ms' }}>
            <PlayerAvatar name={third.name} seed={third.avatarSeed} />
            <div className="w-24 md:w-28 bg-surface-alt/50 border border-white/8 h-12 mt-3 rounded-t-xl flex flex-col items-center justify-end pb-2">
              <span className="font-display font-bold text-xl text-muted/60">3</span>
            </div>
            <div className="font-mono text-sm font-bold text-muted/70 mt-1">{third.score} pts</div>
          </div>
        )}
      </div>

      {/* Full scores */}
      <div className="bg-surface border border-white/8 rounded-2xl p-5 w-full mb-8">
        <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-4">Final Scores</h3>
        <div className="flex flex-col gap-2">
          {sortedPlayers.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-brand/10 border border-brand/20' : 'bg-surface-alt/50'}`}
            >
              <div className="w-5 text-center font-bold text-xs text-muted">{i + 1}</div>
              <div className="font-semibold text-sm flex-1">{p.name}</div>
              {i === 0 && <span className="text-xs">👑</span>}
              <div className={`font-mono font-bold text-lg ${i === 0 ? 'text-brand-light' : 'text-muted'}`}>
                {p.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {gameState.isHost ? (
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={actions.playAgain}
            className="w-full py-5 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 bg-brand hover:bg-brand-light text-ink shadow-lg shadow-brand/30"
          >
            Play Again 🔄
          </button>
          <button
            onClick={actions.leaveRoom}
            className="w-full py-3 font-semibold text-base rounded-xl transition-all duration-200 border border-white/10 text-muted hover:text-ink hover:border-white/20"
          >
            Leave Game
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted font-semibold">Waiting for host to play again…</p>
          <button
            onClick={actions.leaveRoom}
            className="mt-4 px-6 py-2 font-semibold text-sm rounded-xl border border-white/10 text-muted hover:text-ink transition-colors"
          >
            Leave Game
          </button>
        </div>
      )}
    </div>
  );
};
