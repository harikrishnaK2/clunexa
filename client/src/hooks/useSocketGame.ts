import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientGameState } from '../types/game';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin);

export interface GameActions {
  createRoom: (name: string) => void;
  joinRoom: (name: string, code: string) => void;
  startGame: (rounds: number) => void;
  submitClue: (clue: string) => void;
  submitGuess: (guess: string) => void;
  playAgain: () => void;
  copyRoomLink: () => void;
}

export function useSocketGame() {
  // Use a ref to always have access to the live socket instance
  // regardless of React state batching timing.
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<ClientGameState | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      setConnectionState('connected');

      const savedToken = sessionStorage.getItem('clunexa-token') || sessionStorage.getItem('clue-clash-token');
      const savedRoom  = sessionStorage.getItem('clunexa-room')  || sessionStorage.getItem('clue-clash-room');
      const savedName  = localStorage.getItem('clunexa-name')   || localStorage.getItem('clue-clash-name');

      // Auto-rejoin on reconnect (page refresh / network blip)
      if (savedToken && savedRoom && savedName) {
        s.emit('join_room', {
          roomCode: savedRoom,
          playerName: savedName,
          playerToken: savedToken,
        });
      }
    });

    s.on('connect_error', () => {
      setConnectionState('disconnected');
    });

    s.on('disconnect', () => {
      setConnectionState('disconnected');
    });

    s.on('reconnect', () => {
      setConnectionState('connected');
    });

    s.on('state_update', (state: ClientGameState) => {
      setGameState(state);
      setTimeRemaining(state.timeRemaining);
      setIsJoining(false);
      sessionStorage.setItem('clunexa-room', state.roomCode);
    });

    s.on('timer_tick', (rem: number) => {
      setTimeRemaining(rem);
    });

    // BUG FIX: server sends { message, type } object — handle both string and object
    s.on('error_toast', (payload: string | { message: string; type?: string }) => {
      const msg = typeof payload === 'string' ? payload : payload?.message ?? 'Unknown error';
      setErrorMessage(msg);
      setIsJoining(false);
      setTimeout(() => setErrorMessage(null), 4000);
    });

    s.on('token_update', (token: string) => {
      sessionStorage.setItem('clunexa-token', token);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  // BUG FIX: use the ref (always has the live socket) instead of
  // the React state (which may lag by one render cycle).
  const emit = useCallback((event: string, data?: unknown) => {
    const s = socketRef.current;
    if (!s) {
      setErrorMessage('Not connected to server. Please refresh.');
      return false;
    }
    if (!s.connected) {
      setErrorMessage('Connection lost. Reconnecting…');
      return false;
    }
    if (data !== undefined) s.emit(event, data);
    else s.emit(event);
    return true;
  }, []);

  const createRoom = useCallback((name: string) => {
    if (!name.trim()) { setErrorMessage('Please enter your name.'); return; }
    localStorage.setItem('clunexa-name', name.trim());
    setIsJoining(true);
    const ok = emit('create_room', {
      playerName: name.trim(),
      playerToken: sessionStorage.getItem('clunexa-token') || sessionStorage.getItem('clue-clash-token') || '',
    });
    if (!ok) setIsJoining(false);
  }, [emit]);

  const joinRoom = useCallback((name: string, code: string) => {
    if (!name.trim()) { setErrorMessage('Please enter your name.'); return; }
    const upperCode = code.trim().toUpperCase();
    if (upperCode.length !== 4) { setErrorMessage('Room code must be 4 letters.'); return; }
    localStorage.setItem('clunexa-name', name.trim());
    setIsJoining(true);
    const ok = emit('join_room', {
      roomCode: upperCode,
      playerName: name.trim(),
      playerToken: sessionStorage.getItem('clunexa-token') || sessionStorage.getItem('clue-clash-token') || '',
    });
    if (!ok) setIsJoining(false);
  }, [emit]);

  const startGame = useCallback((rounds: number = 1) => {
    emit('start_game', { rounds });
  }, [emit]);

  const submitClue = useCallback((clue: string) => {
    emit('submit_clue', { clue });
  }, [emit]);

  const submitGuess = useCallback((guess: string) => {
    emit('submit_guess', { guess });
  }, [emit]);

  const playAgain = useCallback(() => {
    emit('play_again');
  }, [emit]);

  const copyRoomLink = useCallback(() => {
    if (gameState?.roomCode) {
      const url = `${window.location.origin}?room=${gameState.roomCode}`;
      navigator.clipboard.writeText(url)
        .then(() => {
          setErrorMessage('✓ Link copied!');
          setTimeout(() => setErrorMessage(null), 2500);
        })
        .catch(() => {
          // Fallback: show the code prominently
          setErrorMessage(`Room code: ${gameState.roomCode}`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  }, [gameState]);

  return {
    gameState,
    timeRemaining,
    connectionState,
    errorMessage,
    isJoining,
    actions: {
      createRoom,
      joinRoom,
      startGame,
      submitClue,
      submitGuess,
      playAgain,
      copyRoomLink,
    },
    socket,
    clearError: useCallback(() => setErrorMessage(null), []),
  };
}
