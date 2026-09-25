import React from 'react';
import { useSocketGame } from './hooks/useSocketGame';
import { ErrorToast, ConnectionBanner } from './components/ui/Global';
import { LandingView } from './components/views/LandingView';
import { LobbyView } from './components/views/LobbyView';
import { ClueSubmissionView, GuesserWaitingView } from './components/views/ClueSubmissionView';
import { ClueRevealView } from './components/views/ClueRevealView';
import { GuessingView, GuesserWatchingView } from './components/views/GuessingView';
import { RoundResultView, GameOverView } from './components/views/ResultViews';

function RoundIntroView({
  roundNumber,
  totalRounds,
  clueGiverName,
  isClueGiver,
}: {
  roundNumber: number;
  totalRounds: number;
  clueGiverName: string;
  isClueGiver: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-void text-center p-4">
      <div className="animate-slide-up">
        <div className="text-muted text-sm uppercase tracking-widest font-semibold mb-4">
          Round {roundNumber} of {totalRounds}
        </div>
        <h1 className="font-display text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-light to-brand">
          {roundNumber}
        </h1>
        <div className="mt-6 text-xl font-semibold text-ink">
          {isClueGiver ? (
            <span className="text-amber-hot">You are the <strong>Clue Typer</strong> this round!</span>
          ) : (
            <span>
              <strong className="text-amber-hot">{clueGiverName || 'Clue Typer'}</strong> is the Clue Typer
            </span>
          )}
        </div>
        <p className="text-muted text-sm mt-3">
          {isClueGiver
            ? "You'll see the secret word. Give one single-word clue for everyone to guess!"
            : "Wait for the clue, then race to guess the secret word!"}
        </p>
      </div>
    </div>
  );
}

function ExitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-white/10 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl shadow-void/70 animate-slide-up">
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-crimson-clash/15 border border-crimson-clash/30 flex items-center justify-center text-crimson-clash">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        <h3 className="font-display text-2xl font-bold text-ink mb-2">
          Leave Game?
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Are you sure you want to leave this game? You will return to the home screen and lose your current progress in this room.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-base bg-crimson-clash hover:bg-crimson-clash/90 text-ink shadow-lg shadow-crimson-clash/30 transition-all active:scale-95"
          >
            Yes, Exit Game
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-muted hover:text-ink hover:bg-white/5 transition-all"
          >
            Cancel (Stay in Game)
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { gameState, timeRemaining, connectionState, errorMessage, isJoining, actions } = useSocketGame();
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  const renderView = () => {
    if (!gameState) {
      return (
        <LandingView
          actions={actions}
          isJoining={isJoining}
          connectionState={connectionState}
        />
      );
    }

    switch (gameState.phase) {
      case 'LOBBY':
        return <LobbyView gameState={gameState} actions={actions} />;

      case 'ROUND_INTRO':
        return (
          <RoundIntroView
            roundNumber={gameState.roundNumber}
            totalRounds={gameState.totalRounds}
            clueGiverName={gameState.clueGiverName}
            isClueGiver={gameState.isClueGiver}
          />
        );

      case 'CLUE_SUBMISSION':
        return gameState.isClueGiver
          ? (
              <ClueSubmissionView
                gameState={gameState}
                actions={actions}
                timeRemaining={timeRemaining}
                errorMessage={errorMessage}
              />
            )
          : <GuesserWaitingView gameState={gameState} timeRemaining={timeRemaining} />;

      case 'CLUE_REVEAL':
        return <ClueRevealView gameState={gameState} />;

      case 'GUESSING':
        return gameState.isClueGiver
          ? <GuesserWatchingView gameState={gameState} timeRemaining={timeRemaining} />
          : <GuessingView gameState={gameState} actions={actions} timeRemaining={timeRemaining} />;

      case 'ROUND_RESULT':
        return <RoundResultView gameState={gameState} />;

      case 'GAME_OVER':
        return <GameOverView gameState={gameState} actions={actions} />;

      default:
        return (
          <LandingView
            actions={actions}
            isJoining={isJoining}
            connectionState={connectionState}
          />
        );
    }
  };

  return (
    <>
      <ConnectionBanner state={connectionState} />
      <ErrorToast message={errorMessage} />

      {/* In-Game Header with Room Info & Exit Game Option */}
      {gameState && (
        <header className="fixed top-0 left-0 right-0 z-30 h-12 px-4 flex items-center justify-between bg-void/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-sm tracking-wider text-brand-light">CLUNEXA</span>
            <span className="text-white/20 text-xs">/</span>
            <span className="font-mono text-xs font-semibold text-muted bg-surface-alt px-2.5 py-0.5 rounded-full border border-white/5">
              Room {gameState.roomCode}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt/80 hover:bg-crimson-clash/20 border border-white/10 hover:border-crimson-clash/40 text-muted hover:text-crimson-clash text-xs font-semibold transition-all active:scale-95 shadow-sm"
            title="Exit Game"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Exit Game</span>
          </button>
        </header>
      )}

      {/* Confirmation Modal */}
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setShowExitConfirm(false);
          actions.leaveRoom();
        }}
      />

      <div className={`min-h-screen bg-void text-ink overflow-x-hidden ${gameState ? 'pt-12' : ''}`}>
        {renderView()}
      </div>
    </>
  );
}

export default App;
