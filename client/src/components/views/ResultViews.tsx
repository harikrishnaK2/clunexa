import React, { useEffect } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { PlayerAvatar } from '../ui/Global';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/sounds';

export const RoundResultView = ({ gameState }: { gameState: ClientGameState }) => {
  useEffect(() => {
    if (gameState.isCorrect === true) sounds.success();
    else if (gameState.isCorrect === false) sounds.fail();
  }, []);

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const clueGiverId = gameState.clueGiverId || gameState.guesserId;
  const clueGiverName = gameState.clueGiverName || gameState.guesserName || 'Clue Typer';
  const clueWord = gameState.clue || (gameState.clues && gameState.clues[0]?.rawClue) || '';
  const clueGiverDelta = gameState.scoreDeltas?.[clueGiverId] ?? 0;

  const guesses = gameState.guesses ?? [];
  const correctCount = guesses.filter(g => g.isCorrect).length;
  const totalGuessers = Math.max(1, gameState.players.length - 1);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col animate-fade-in pb-10">
      {/* Result header banner */}
      <div
        className={`text-center py-7 px-4 rounded-2xl mt-6 mb-6 ${
          correctCount > 0
            ? 'bg-emerald-alive/10 border-2 border-emerald-alive/40'
            : 'bg-crimson-clash/10 border-2 border-crimson-clash/40'
        }`}
      >
        <div
          className={`font-display text-3xl md:text-4xl font-bold ${
            correctCount > 0 ? 'text-emerald-alive' : 'text-crimson-clash'
          } animate-score-pop`}
        >
          {correctCount > 0
            ? `${correctCount} of ${totalGuessers} Guessed Correctly! 🎯`
            : 'Nobody Guessed Correctly! 😢'}
        </div>

        <p className="text-muted mt-2 text-sm">
          Category: <span className="text-ink font-semibold">{gameState.category}</span>
        </p>

        {/* Secret Word & Clue display */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="bg-surface-alt/80 border border-white/10 px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-muted block">Secret Word</span>
            <span className="font-display font-bold text-xl text-cyan-glow uppercase">
              {gameState.secretWord}
            </span>
          </div>
          {clueWord && (
            <div className="bg-surface-alt/80 border border-white/10 px-4 py-2 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-muted block">Clue Word</span>
              <span className="font-display font-bold text-xl text-emerald-alive uppercase">
                {clueWord}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Clue Typer Score Card */}
      <div className="bg-surface border border-brand/30 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-lg shadow-brand/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase bg-brand/20 text-brand-light px-2.5 py-0.5 rounded-full">
              Clue Typer
            </span>
            <span className="font-bold text-ink text-sm">{clueGiverName}</span>
          </div>
          <p className="text-xs text-muted">
            Earned based on {correctCount}/{totalGuessers} correct guesses (max 50)
          </p>
        </div>
        <div className="text-right">
          <span className={`font-mono font-bold text-2xl ${clueGiverDelta > 0 ? 'text-amber-hot' : 'text-muted'}`}>
            +{clueGiverDelta}
          </span>
          <span className="text-xs text-muted block">pts</span>
        </div>
      </div>

      {/* Guessers Breakdown */}
      {guesses.length > 0 && (
        <div className="bg-surface border border-white/8 rounded-2xl p-5 mb-6">
          <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-3">Player Guesses</h3>
          <div className="flex flex-col gap-2">
            {guesses.map((g, i) => {
              const delta = gameState.scoreDeltas?.[g.playerId] ?? (g.isCorrect ? 100 : 0);
              const streak = gameState.streaks?.[g.playerId] || 0;
              const hasSpeed = g.isCorrect && delta > 100 && (delta % 10 !== 0 || delta === 125 || delta === 115 || delta === 110 || delta === 105);
              const speedPoints = delta > 100 ? (delta - 100 - (streak >= 3 ? 20 : streak === 2 ? 10 : 0)) : 0;
              const streakPoints = streak >= 3 ? 20 : streak === 2 ? 10 : 0;

              return (
                <div
                  key={i}
                  className={`flex flex-col gap-1 p-3 rounded-xl border ${
                    g.isCorrect
                      ? 'bg-emerald-alive/10 border-emerald-alive/30'
                      : 'bg-surface-alt/50 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-semibold text-sm truncate">{g.playerName}</span>
                      <span className="text-muted text-xs font-mono uppercase">
                        "{g.guess}"
                      </span>
                      {streak >= 2 && <span className="text-sm" title={`Streak: ${streak}`}>🔥</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          g.isCorrect
                            ? 'bg-emerald-alive/20 text-emerald-alive'
                            : 'bg-crimson-clash/20 text-crimson-clash'
                        }`}
                      >
                        {g.isCorrect ? '✓ Correct' : '✗ Wrong'}
                      </span>
                      <span
                        className={`font-mono font-bold text-base w-12 text-right ${
                          g.isCorrect ? 'text-emerald-alive' : 'text-muted'
                        }`}
                      >
                        +{delta}
                      </span>
                    </div>
                  </div>
                  {g.isCorrect && (speedPoints > 0 || streakPoints > 0) && (
                    <div className="flex gap-3 justify-end text-xs font-semibold pr-16 mt-1">
                      {speedPoints > 0 && <span className="text-amber-hot">⚡ Speed Bonus +{speedPoints}</span>}
                      {streakPoints > 0 && <span className="text-orange-500">🔥 Streak Bonus +{streakPoints}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Leaderboard */}
      <div className="bg-surface border border-white/8 rounded-2xl p-5">
        <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-4">Leaderboard</h3>
        <div className="flex flex-col gap-2.5">
          {sortedPlayers.map((p, i) => {
            const maxScore = sortedPlayers[0]?.score || 1;
            const barWidth = maxScore > 0 ? Math.max(6, (p.score / maxScore) * 100) : 6;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-5 text-center font-bold text-xs text-muted">{i + 1}</div>
                <div className="font-semibold text-sm w-24 truncate">{p.name}</div>
                <div className="flex-1 bg-surface-alt rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-glow transition-all duration-700"
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
    </div>
  );
};

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
    sounds.victory();
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
              className={`flex items-center gap-3 p-3 rounded-xl ${
                i === 0 ? 'bg-brand/10 border border-brand/20' : 'bg-surface-alt/50'
              }`}
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

      {/* Fun Awards */}
      <div className="w-full flex flex-col gap-3 mb-8">
        {Object.entries(gameState.streaks || {}).length > 0 && (() => {
          const maxStreakEntry = Object.entries(gameState.streaks).reduce((max, entry) => entry[1] > max[1] ? entry : max, ['', 0]);
          const speedDemon = gameState.players.find(p => p.id === maxStreakEntry[0]);
          if (speedDemon && maxStreakEntry[1] > 1) return (
            <div className="bg-amber-hot/10 border border-amber-hot/30 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚡</div>
                <div>
                  <div className="font-bold text-amber-hot">Speed Demon</div>
                  <div className="text-xs text-amber-hot/70">Highest Streak ({maxStreakEntry[1]})</div>
                </div>
              </div>
              <div className="font-semibold text-sm">{speedDemon.name}</div>
            </div>
          );
          return null;
        })()}
        <div className="bg-cyan-glow/10 border border-cyan-glow/30 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧠</div>
            <div>
              <div className="font-bold text-cyan-glow">Brain of the Game</div>
              <div className="text-xs text-cyan-glow/70">Highest Total Score</div>
            </div>
          </div>
          <div className="font-semibold text-sm">{first?.name}</div>
        </div>
      </div>

      {/* Actions */}
      {gameState.isHost ? (
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={actions.playAgain}
            className="w-full py-5 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 bg-brand hover:bg-brand-light text-ink shadow-lg shadow-brand/30"
          >
            Play Again 🏆
          </button>
          <button
            onClick={actions.leaveRoom}
            className="w-full py-3 font-semibold text-base rounded-xl transition-all duration-200 border border-white/10 text-muted hover:text-ink hover:border-white/20"
          >
            Leave Game
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <div className="w-full py-4 text-center font-semibold text-brand-light bg-brand/10 border border-brand/20 rounded-xl animate-pulse">
            Waiting for host to play again...
          </div>
          <button
            onClick={actions.leaveRoom}
            className="w-full py-3 font-semibold text-base rounded-xl transition-all duration-200 border border-white/10 text-muted hover:text-ink hover:border-white/20"
          >
            Leave Game
          </button>
        </div>
      )}
    </div>
  );
};


