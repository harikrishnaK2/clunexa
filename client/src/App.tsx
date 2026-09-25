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

function App() {
  const { gameState, timeRemaining, connectionState, errorMessage, isJoining, actions } = useSocketGame();

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
      <div className="min-h-screen bg-void text-ink overflow-x-hidden">
        {renderView()}
      </div>
    </>
  );
}

export default App;
