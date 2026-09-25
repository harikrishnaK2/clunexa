import React, { useState } from 'react';
import { ClientGameState } from '../../types/game';
import { GameActions } from '../../hooks/useSocketGame';
import { PlayerAvatar } from '../ui/Global';

export const LobbyView = ({
  gameState,
  actions,
}: {
  gameState: ClientGameState;
  actions: GameActions;
}) => {
  const [copied, setCopied] = useState(false);
  const [rounds, setRounds] = useState(1);

  const connectedPlayers = gameState.players.filter(p => p.connected);
  const canStart = connectedPlayers.length >= 2;

  const handleCopy = () => {
    const url = `${window.location.origin}?room=${gameState.roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStart = () => {
    actions.startGame(rounds);
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col gap-6 animate-fade-in">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={actions.leaveRoom}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-muted hover:text-ink hover:border-white/20 text-xs font-semibold transition-all duration-150 active:scale-95 bg-surface-alt/50"
        >
          <span>←</span>
          <span>Exit Room</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-light bg-brand/10 border border-brand/20 px-3 py-1 rounded-full">
          Lobby
        </span>
      </div>

      {/* Room code hero */}
      <div className="text-center pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Share this code</p>
        <div className="font-mono text-6xl md:text-7xl font-bold tracking-[0.3em] text-brand-light mb-4">
          {gameState.roomCode}
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl border font-semibold text-sm transition-all duration-200 ${
            copied
              ? 'border-emerald-alive text-emerald-alive bg-emerald-alive/10'
              : 'border-brand/30 text-brand-light hover:bg-brand/10'
          }`}
        >
          {copied ? '✓ Copied!' : 'Copy Invite Link'}
        </button>
        <p className="text-muted text-xs mt-3">
          Or share: <span className="text-brand-light/70 font-mono text-xs">{window.location.origin}?room={gameState.roomCode}</span>
        </p>
      </div>

      {/* Players */}
      <div className="bg-surface border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg">Players</h3>
          <span className="text-muted text-sm bg-surface-alt px-3 py-1 rounded-full">
            {connectedPlayers.length} / 8
          </span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center min-h-[80px]">
          {connectedPlayers.map(p => (
            <div key={p.id} className="animate-slide-up">
              <PlayerAvatar name={p.name} seed={p.avatarSeed} isHost={p.isHost} showName />
            </div>
          ))}
          {connectedPlayers.length < 8 && (
            <div className="w-16 flex flex-col items-center gap-2 opacity-20">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-2xl">
                +
              </div>
              <div className="text-xs text-muted">Invite</div>
            </div>
          )}
        </div>
      </div>

      {/* Game settings (host only) */}
      {gameState.isHost ? (
        <div className="bg-surface border border-white/8 rounded-2xl p-5">
          <h3 className="font-display font-bold text-lg mb-4">Game Settings</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-semibold block mb-2">
                Rounds per player
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setRounds(n)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-150 ${
                      rounds === n
                        ? 'bg-brand text-ink shadow-lg shadow-brand/30'
                        : 'bg-surface-alt text-muted hover:text-ink hover:bg-surface-alt/70'
                    }`}
                  >
                    {n} {n === 1 ? 'Round' : 'Rounds'}
                  </button>
                ))}
              </div>
              <p className="text-muted text-xs mt-2 text-center">
                Total: <span className="text-ink font-semibold">{connectedPlayers.length * rounds} rounds</span> &nbsp;·&nbsp;
                Everyone guesses {rounds} {rounds === 1 ? 'time' : 'times'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-white/8 rounded-2xl p-5 text-center">
          <div className="text-cyan-glow animate-pulse font-semibold text-lg mb-1">
            Waiting for host to start…
          </div>
          <p className="text-muted text-sm">
            Host: <span className="text-ink">{gameState.players.find(p => p.isHost)?.name ?? '?'}</span>
          </p>
        </div>
      )}

      {/* Start button */}
      {gameState.isHost && (
        <div className="pb-8">
          {!canStart && (
            <p className="text-center text-amber-hot text-sm mb-3 font-semibold">
              ⚠ Need at least 2 players to start
            </p>
          )}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full py-5 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-brand hover:bg-brand-light text-ink shadow-lg shadow-brand/30 hover:shadow-brand-light/30"
          >
            Start Game →
          </button>
        </div>
      )}

      {/* Leave room secondary option */}
      <div className="text-center pb-6 -mt-2">
        <button
          onClick={actions.leaveRoom}
          className="text-xs text-muted hover:text-crimson-clash font-semibold transition-colors underline underline-offset-4"
        >
          Exit Room (back to create/join)
        </button>
      </div>
    </div>
  );
};
