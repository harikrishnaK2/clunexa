import React, { useState, useEffect } from 'react';
import { GameActions } from '../../hooks/useSocketGame';

const HOW_TO_STEPS = [
  { num: '1', title: 'One player is the Guesser', desc: 'They cannot see the secret word or clues until the reveal.' },
  { num: '2', title: 'Everyone else gives ONE clue', desc: 'Submit a single word to help the guesser.' },
  { num: '3', title: "Don't copy another player's clue", desc: 'If two players submit the same clue, BOTH get eliminated!' },
  { num: '4', title: 'Matching clues disappear', desc: 'Only unique clues survive to reach the guesser.' },
  { num: '5', title: 'Guesser sees surviving clues', desc: 'They must deduce the secret word from what remains.' },
  { num: '6', title: 'Score points, rotate roles', desc: 'Correct guess = 100pts guesser + 50pts per unique clue. Highest score wins!' },
];

export const LandingView = ({
  actions,
  isJoining,
  connectionState,
}: {
  actions: GameActions;
  isJoining: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected';
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlRoomCode = urlParams.get('room')?.toUpperCase() || '';
  const hasUrlRoom = urlRoomCode.length === 4;

  // If URL has ?room=XXXX, default to join tab
  const [tab, setTab] = useState<'join' | 'create'>(hasUrlRoom ? 'join' : 'create');
  const [name, setName] = useState(
    localStorage.getItem('clunexa-name') || localStorage.getItem('clue-clash-name') || ''
  );
  const [roomCode, setRoomCode] = useState(urlRoomCode);
  const [showHowTo, setShowHowTo] = useState(false);

  // Auto-switch tab if URL room param detected after mount
  useEffect(() => {
    if (hasUrlRoom) {
      setTab('join');
      setRoomCode(urlRoomCode);
    }
  }, [hasUrlRoom, urlRoomCode]);

  const handleJoin = () => {
    if (name.trim() && roomCode.trim().length === 4) {
      actions.joinRoom(name.trim(), roomCode.trim().toUpperCase());
    }
  };

  const handleCreate = () => {
    if (name.trim()) {
      actions.createRoom(name.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      tab === 'join' ? handleJoin() : handleCreate();
    }
  };

  const canJoin   = name.trim().length > 0 && roomCode.trim().length === 4 && !isJoining;
  const canCreate = name.trim().length > 0 && !isJoining;
  const isConnecting = connectionState !== 'connected';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_90%,rgba(6,182,212,0.08),transparent)]" />
      </div>

      <div className="z-10 w-full max-w-md flex flex-col gap-5 animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-1">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              <div className="w-2.5 h-7 bg-brand rounded-sm" />
              <div className="w-2.5 h-7 bg-cyan-glow rounded-sm" style={{ transform: 'translateY(4px)' }} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-ink to-cyan-glow select-none">
              CLUNEXA
            </h1>
            <div className="flex gap-1">
              <div className="w-2.5 h-7 bg-cyan-glow rounded-sm" style={{ transform: 'translateY(4px)' }} />
              <div className="w-2.5 h-7 bg-brand rounded-sm" />
            </div>
          </div>
          <p className="text-muted text-base">
            Outsmart your friends.{' '}
            <span className="text-brand-light font-semibold">One clue at a time.</span>
          </p>
        </div>

        {/* ── SPECIAL INVITE VIEW: URL has ?room=XXXX ─────────────────────── */}
        {hasUrlRoom ? (
          <div className="bg-surface border border-brand/30 rounded-2xl shadow-xl shadow-brand/10 p-6">
            <div className="text-center mb-5">
              <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-2">You're invited to join</p>
              <div className="font-mono text-5xl font-bold tracking-[0.3em] text-brand-light">
                {urlRoomCode}
              </div>
            </div>

            <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
              <div>
                <label className="block text-xs text-muted uppercase tracking-wider mb-2 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name to join…"
                  maxLength={16}
                  autoFocus
                  disabled={isConnecting || isJoining}
                  className="bg-surface-alt border border-white/10 text-ink rounded-xl px-4 py-3 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 w-full text-lg transition-all duration-150 placeholder:text-white/20 disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!canJoin || isConnecting}
                className="w-full py-4 font-display font-bold text-xl rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-brand hover:bg-brand-light text-ink shadow-lg shadow-brand/30 flex items-center justify-center gap-2"
              >
                {isJoining ? (
                  <>
                    <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    Joining…
                  </>
                ) : isConnecting ? (
                  'Connecting…'
                ) : (
                  `→ Join Room ${urlRoomCode}`
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  // Clear the URL param and switch to create tab
                  window.history.replaceState({}, '', window.location.pathname);
                  setTab('create');
                  setRoomCode('');
                }}
                className="text-muted text-xs hover:text-brand-light transition-colors underline underline-offset-2"
              >
                Create your own room instead
              </button>
            </div>
          </div>
        ) : (
          /* ── NORMAL CREATE / JOIN VIEW ─────────────────────────────────── */
          <div className="bg-surface border border-white/8 rounded-2xl shadow-xl shadow-brand/10 p-6">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-white/10">
              <button
                className={`flex-1 pb-3 font-semibold text-sm transition-all duration-200 ${
                  tab === 'create'
                    ? 'text-ink border-b-2 border-brand-light'
                    : 'text-muted hover:text-ink'
                }`}
                onClick={() => setTab('create')}
              >
                🎮 Create Game
              </button>
              <button
                className={`flex-1 pb-3 font-semibold text-sm transition-all duration-200 ${
                  tab === 'join'
                    ? 'text-ink border-b-2 border-brand-light'
                    : 'text-muted hover:text-ink'
                }`}
                onClick={() => setTab('join')}
              >
                🔗 Join Game
              </button>
            </div>

            <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
              <div>
                <label className="block text-xs text-muted uppercase tracking-wider mb-2 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Detective Dan"
                  maxLength={16}
                  autoFocus
                  disabled={isJoining}
                  className="bg-surface-alt border border-white/10 text-ink rounded-xl px-4 py-3 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 w-full text-base transition-all duration-150 placeholder:text-white/20 disabled:opacity-50"
                />
              </div>

              {tab === 'join' && (
                <div>
                  <label className="block text-xs text-muted uppercase tracking-wider mb-2 font-semibold">
                    Room Code
                    <span className="ml-2 text-muted/50 normal-case font-normal">(4 letters from your friend)</span>
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={e =>
                      setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))
                    }
                    placeholder="ABCD"
                    maxLength={4}
                    disabled={isJoining}
                    className="bg-surface-alt border border-white/10 text-ink rounded-xl px-4 py-3 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 w-full text-center text-2xl font-mono tracking-[0.4em] uppercase transition-all duration-150 placeholder:text-white/20 placeholder:text-base placeholder:tracking-normal disabled:opacity-50"
                  />
                  {roomCode.length > 0 && roomCode.length < 4 && (
                    <p className="text-amber-hot text-xs mt-1 text-center">
                      {4 - roomCode.length} more letter{4 - roomCode.length !== 1 ? 's' : ''}…
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={tab === 'join' ? handleJoin : handleCreate}
                disabled={tab === 'join' ? !canJoin : !canCreate}
                className="w-full py-4 font-display font-bold text-lg rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-brand hover:bg-brand-light text-ink mt-1 shadow-lg shadow-brand/30 flex items-center justify-center gap-2"
              >
                {isJoining ? (
                  <>
                    <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    {tab === 'join' ? 'Joining…' : 'Creating…'}
                  </>
                ) : tab === 'join' ? (
                  '→ Join Game'
                ) : (
                  '→ Create Game'
                )}
              </button>
            </div>
          </div>
        )}

        {/* How to play */}
        <div className="text-center">
          <button
            className="text-muted hover:text-brand-light text-sm font-semibold underline underline-offset-2 transition-colors duration-200"
            onClick={() => setShowHowTo(v => !v)}
          >
            {showHowTo ? '▲ Hide rules' : '▼ How to Play'}
          </button>
        </div>

        {showHowTo && (
          <div className="bg-surface border border-white/8 rounded-2xl p-5 animate-slide-up">
            <h3 className="font-display font-bold text-brand-light mb-4 text-center">How to Play</h3>
            <div className="flex flex-col gap-3">
              {HOW_TO_STEPS.map(step => (
                <div key={step.num} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand/20 text-brand-light font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{step.title}</div>
                    <div className="text-muted text-xs mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-hot/10 border border-amber-hot/20 rounded-xl">
              <p className="text-amber-hot text-xs font-semibold text-center">
                ⚡ Strategic tension: Be helpful enough to guide the guesser, but unique enough to survive!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
