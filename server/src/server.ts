import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as RM from './RoomManager.js';
import * as GE from './GameEngine.js';
import { TimerManager } from './TimerManager.js';
import { pickWord } from './WordBank.js';

import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
  pingTimeout: 30000,
  pingInterval: 10000,
});
const timerManager = new TimerManager();

const PORT = process.env.PORT || 3001;

// Serve React client in production
const clientDist = join(__dirname, '../../client/dist');
const indexPath = join(clientDist, 'index.html');

if (existsSync(indexPath)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get('*', (_req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>CLUNEXA Server</title></head>
        <body style="font-family: sans-serif; background: #0B0B14; color: #F8FAFC; text-align: center; padding: 50px;">
          <h1 style="color: #A78BFA;">🎮 CLUNEXA Server is Live</h1>
          <p>WebSocket server is running on port ${PORT}.</p>
          <p style="color: #94A3B8;">Frontend build not found at <code>${clientDist}</code>.</p>
        </body>
      </html>
    `);
  });
}

// ─── Broadcast helpers ────────────────────────────────────────────────────────

function broadcastState(room: GE.Room) {
  for (const [playerId] of room.players) {
    const state = GE.buildClientState(room, playerId);
    io.to(playerId).emit('state_update', state);
  }
}

function sendError(socketId: string, message: string) {
  io.to(socketId).emit('error_toast', { message, type: 'error' });
}

function sendInfo(socketId: string, message: string) {
  io.to(socketId).emit('error_toast', { message, type: 'info' });
}

// ─── Game flow helpers ────────────────────────────────────────────────────────

function startRound(room: GE.Room) {
  const order = room.clueGiverOrder.length > 0 ? room.clueGiverOrder : room.guesserOrder;
  const total = order.length;
  if (total < 2) {
    room.phase = 'LOBBY';
    broadcastState(room);
    return;
  }

  // Advance clue giver, skip disconnected
  let attempts = 0;
  do {
    room.clueGiverIndex = (room.clueGiverIndex + 1) % total;
    attempts++;
  } while (
    !room.players.get(order[room.clueGiverIndex])?.connected &&
    attempts <= total
  );

  room.guesserIndex = room.clueGiverIndex;
  room.guesserOrder = order;

  // Reset round state
  room.clue = null;
  room.clues.clear();
  room.guesses.clear();
  room.guess = null;
  room.isCorrect = null;
  room.scoreDeltas = null;

  // Pick a fresh word
  const filter = room.categoryFilter && room.categoryFilter !== 'All Mix' ? room.categoryFilter : null;
  const wordEntry = pickWord(room.usedWords, filter);
  room.secretWord = wordEntry.word;
  room.category = wordEntry.category;

  room.phase = 'ROUND_INTRO';
  broadcastState(room);

  // After 3s intro, start clue submission
  setTimeout(() => {
    if (room.phase !== 'ROUND_INTRO') return;
    room.phase = 'CLUE_SUBMISSION';
    broadcastState(room);

    timerManager.startTimer(
      room,
      room.settings.submissionTimeSec,
      (rem) => {
        room.timeRemaining = rem;
        io.to(room.code).emit('timer_tick', rem);
      },
      () => endClueSubmission(room)
    );
  }, 3000);
}

function endClueSubmission(room: GE.Room) {
  timerManager.clearTimer(room);
  room.phase = 'CLUE_REVEAL';
  broadcastState(room);

  // Give clients 3.5s to view the revealed clue, then start guessing
    setTimeout(() => {
    if (room.phase !== 'CLUE_REVEAL') return;
    room.phase = 'GUESSING';
    room.guessingStartTime = Date.now();
    broadcastState(room);

    timerManager.startTimer(
      room,
      room.settings.guessTimeSec,
      (rem) => {
        room.timeRemaining = rem;
        io.to(room.code).emit('timer_tick', rem);
      },
      () => endGuessing(room)
    );
  }, 3500);
}

function endGuessing(room: GE.Room) {
  timerManager.clearTimer(room);
  room.phase = 'ROUND_RESULT';

  const order = room.clueGiverOrder.length > 0 ? room.clueGiverOrder : room.guesserOrder;
  const clueGiverId = order[room.clueGiverIndex] ?? '';

  const deltas: Record<string, number> = {};
  for (const [pid] of room.players) deltas[pid] = 0;

  // Active guessers in the round (all connected players except the clue giver)
  const activeGuessers = Array.from(room.players.values()).filter(
    p => p.connected && p.id !== clueGiverId
  );
  const totalGuessers = Math.max(1, activeGuessers.length);

  // Sort correct guessers by speed
  const correctGuessers = Array.from(room.guesses.values())
    .filter(g => g.isCorrect)
    .sort((a, b) => a.guessTimeMs - b.guessTimeMs);

  const speedBonuses = [25, 15, 10, 5];

  let correctCount = 0;
  for (const guess of Array.from(room.guesses.values())) {
    const player = room.players.get(guess.playerId);
    if (!player) continue;
    if (guess.isCorrect) {
      correctCount++;
      const speedRank = correctGuessers.findIndex(g => g.playerId === guess.playerId);
      const speedBonus = speedBonuses[speedRank] ?? 0;
      const base = 100;
      
      const currentStreak = (room.streak.get(guess.playerId) || 0) + 1;
      room.streak.set(guess.playerId, currentStreak);
      const streakBonus = currentStreak >= 3 ? 20 : currentStreak === 2 ? 10 : 0;
      
      const total = base + speedBonus + streakBonus;
      deltas[guess.playerId] = total;
      player.score += total;
    } else {
      room.streak.set(guess.playerId, 0);
      deltas[guess.playerId] = 0;
    }
  }

  // Clue Typer score: based on how many people guessed, but capped at <= 50!
  const clueGiverScore = correctCount > 0 ? Math.round((correctCount / totalGuessers) * 50) : 0;
  if (clueGiverId) {
    deltas[clueGiverId] = clueGiverScore;
    const clueGiver = room.players.get(clueGiverId);
    if (clueGiver) clueGiver.score += clueGiverScore;
  }

  room.scoreDeltas = deltas;
  broadcastState(room);

  // After 7s result display, go to next round or game over
  setTimeout(() => {
    if (room.phase !== 'ROUND_RESULT') return;
    if (room.roundNumber < room.totalRounds) {
      room.roundNumber++;
      startRound(room);
    } else {
      room.phase = 'GAME_OVER';
      broadcastState(room);
    }
  }, 7000);
}

// ─── Socket handlers ──────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  let currentRoom: GE.Room | null = null;
  let currentPlayerId: string | null = null;

  // ── create_room ──────────────────────────────────────────────────────────
  socket.on('create_room', (data: { playerName: string; playerToken: string }) => {
    try {
      if (!data.playerName || data.playerName.trim().length === 0) {
        return sendError(socket.id, 'Please enter your name.');
      }
      const sanitizedName = data.playerName.trim().substring(0, 16)
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const token = data.playerToken || '';

      const room = RM.createRoom(socket.id, sanitizedName, token);
      currentRoom = room;
      currentPlayerId = socket.id;

      socket.join(room.code);
      socket.emit('token_update', room.players.get(socket.id)?.token || '');
      broadcastState(room);
    } catch (err) {
      sendError(socket.id, 'Failed to create room. Please try again.');
    }
  });

  // ── join_room ────────────────────────────────────────────────────────────
  socket.on('join_room', (data: { roomCode: string; playerName: string; playerToken: string }) => {
    try {
      const code = (data.roomCode || '').trim().toUpperCase();
      if (code.length !== 4) return sendError(socket.id, 'Room code must be 4 letters.');

      const room = RM.getRoom(code);
      if (!room) return sendError(socket.id, `Room "${code}" not found.`);

      const sanitizedName = (data.playerName || '').trim().substring(0, 16)
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (!sanitizedName) return sendError(socket.id, 'Please enter your name.');

      const token = data.playerToken || '';

      // Check reconnect by token
      let isRejoin = false;
      for (const p of room.players.values()) {
        if (p.token === token && token.length > 0) {
          isRejoin = true;
          break;
        }
      }

      if (!isRejoin) {
        if (room.players.size >= 8) return sendError(socket.id, 'Room is full (max 8 players).');
        if (room.phase !== 'LOBBY') return sendError(socket.id, 'Game already started. Wait for the next game.');
      }

      const player = RM.addPlayer(room, socket.id, sanitizedName, token);
      currentRoom = room;
      currentPlayerId = socket.id;

      socket.join(room.code);
      socket.emit('token_update', player.token);
      broadcastState(room);
    } catch (err) {
      sendError(socket.id, 'Failed to join room. Please try again.');
    }
  });

  // ── start_game ───────────────────────────────────────────────────────────
  socket.on('start_game', (data: { rounds?: number }) => {
    try {
      if (!currentRoom || !currentPlayerId) return;
      if (currentRoom.hostId !== currentPlayerId) return sendError(socket.id, 'Only the host can start the game.');
      if (currentRoom.phase !== 'LOBBY') return;

      const connectedPlayers = Array.from(currentRoom.players.values()).filter(p => p.connected);
      if (connectedPlayers.length < 2) return sendError(socket.id, 'Need at least 2 players to start.');

      const roundsPerPlayer = Math.max(1, Math.min(5, data?.rounds || 1));
      currentRoom.settings.roundsPerPlayer = roundsPerPlayer;
      currentRoom.totalRounds = connectedPlayers.length * roundsPerPlayer;
      currentRoom.roundNumber = 1;

      // Build clue giver rotation from connected players in order
      currentRoom.clueGiverOrder = connectedPlayers.map(p => p.id);
      currentRoom.clueGiverIndex = -1; // startRound will advance to 0
      currentRoom.guesserOrder = currentRoom.clueGiverOrder;
      currentRoom.guesserIndex = -1;

      startRound(currentRoom);
    } catch (err) {
      sendError(socket.id, 'Failed to start game. Please try again.');
    }
  });

  // ── submit_clue ──────────────────────────────────────────────────────────
  socket.on('submit_clue', (data: { clue: string }) => {
    try {
      if (!currentRoom || !currentPlayerId) return;
      if (currentRoom.phase !== 'CLUE_SUBMISSION') return;

      const order = currentRoom.clueGiverOrder.length > 0 ? currentRoom.clueGiverOrder : currentRoom.guesserOrder;
      const clueGiverId = order[currentRoom.clueGiverIndex];
      if (clueGiverId !== currentPlayerId) {
        return sendError(socket.id, 'Only the Clue Typer can submit a clue this round!');
      }

      const raw = (data.clue || '').trim();
      if (raw.length === 0) return sendError(socket.id, 'Clue cannot be empty.');
      if (/\s/.test(raw)) return sendError(socket.id, 'Clue must be a single word (no spaces).');
      if (raw.length > 20) return sendError(socket.id, 'Clue too long (max 20 characters).');

      // Reject emojis, numbers, and symbols: English letters only
      if (!/^[a-zA-Z]+$/.test(raw)) {
        return sendError(socket.id, 'Emojis, numbers, and symbols are not allowed. Please use letters only!');
      }

      // Reject if clue IS the secret word (player is NOT locked out, can try again)
      if (GE.normalizeClue(raw) === GE.normalizeClue(currentRoom.secretWord)) {
        return sendError(socket.id, 'You cannot use the secret word as your clue! Try another word.');
      }

      currentRoom.clue = raw;
      currentRoom.clues.set(currentPlayerId, {
        playerId: currentPlayerId,
        rawClue: raw,
        normalized: GE.normalizeClue(raw),
        isDuplicate: false,
      });

      endClueSubmission(currentRoom);
    } catch (err) {
      sendError(socket.id, 'Failed to submit clue.');
    }
  });

  // ── submit_guess ─────────────────────────────────────────────────────────
  socket.on('set_category_filter', (data: { filter: string }) => {
    if (!currentRoom || !currentPlayerId) return;
    if (currentRoom.hostId !== currentPlayerId) return;
    if (currentRoom.phase !== 'LOBBY') return;
    currentRoom.categoryFilter = data.filter || 'All Mix';
    broadcastState(currentRoom);
  });

  socket.on('emoji_react', (data: { emoji: string }) => {
    if (!currentRoom || !currentPlayerId) return;
    const player = currentRoom.players.get(currentPlayerId);
    if (!player) return;
    io.to(currentRoom.code).emit('emoji_burst', {
      emoji: data.emoji,
      playerId: currentPlayerId,
      playerName: player.name,
    });
  });

  socket.on('submit_guess', (data: { guess: string }) => {
    try {
      if (!currentRoom || !currentPlayerId) return;
      if (currentRoom.phase !== 'GUESSING') return;

      const order = currentRoom.clueGiverOrder.length > 0 ? currentRoom.clueGiverOrder : currentRoom.guesserOrder;
      const clueGiverId = order[currentRoom.clueGiverIndex];
      if (clueGiverId === currentPlayerId) {
        return sendError(socket.id, 'You are the Clue Typer — other players are guessing!');
      }

      if (currentRoom.guesses.has(currentPlayerId)) {
        return sendError(socket.id, 'You have already submitted your guess for this round.');
      }

      const raw = (data.guess || '').trim();
      if (!raw) return sendError(socket.id, 'Guess cannot be empty.');

      const isCorrect = GE.normalizeClue(raw) === GE.normalizeClue(currentRoom.secretWord);
      const player = currentRoom.players.get(currentPlayerId);

      const guessTimeMs = Date.now() - (currentRoom.guessingStartTime || Date.now());
      currentRoom.guesses.set(currentPlayerId, {
        playerId: currentPlayerId,
        playerName: player?.name ?? 'Player',
        guess: raw,
        isCorrect,
        guessTimeMs,
      });

      // Check if all active guessers have now submitted
      const activeGuessers = Array.from(currentRoom.players.values()).filter(
        p => p.connected && p.id !== clueGiverId
      );

      if (currentRoom.guesses.size >= activeGuessers.length) {
        endGuessing(currentRoom);
      } else {
        broadcastState(currentRoom);
      }
    } catch (err) {
      sendError(socket.id, 'Failed to submit guess.');
    }
  });

  // ── play_again ───────────────────────────────────────────────────────────
  socket.on('play_again', () => {
    try {
      if (!currentRoom || !currentPlayerId) return;
      if (currentRoom.hostId !== currentPlayerId) return;
      if (currentRoom.phase !== 'GAME_OVER') return;

      // Reset game state, keep players
      currentRoom.phase = 'LOBBY';
      currentRoom.clue = null;
      currentRoom.clues.clear();
      currentRoom.guesses.clear();
      // Preserve usedWords across games so words do not repeat on "Play Again"
      if (currentRoom.usedWords.size >= 250) {
        currentRoom.usedWords.clear();
      }
      currentRoom.guess = null;
      currentRoom.isCorrect = null;
      currentRoom.scoreDeltas = null;
      currentRoom.secretWord = '';
      currentRoom.category = '';
      currentRoom.roundNumber = 0;
      currentRoom.totalRounds = 0;
      currentRoom.clueGiverIndex = -1;
      currentRoom.clueGiverOrder = [];
      currentRoom.guesserIndex = -1;
      currentRoom.guesserOrder = [];
      currentRoom.streak.clear();
      currentRoom.guessingStartTime = 0;
      timerManager.clearTimer(currentRoom);

      // Reset all scores
      for (const p of currentRoom.players.values()) {
        p.score = 0;
        if (p.connected) {
          currentRoom.clueGiverOrder.push(p.id);
          currentRoom.guesserOrder.push(p.id);
        }
      }

      broadcastState(currentRoom);
    } catch (err) {
      sendError(socket.id, 'Failed to reset game.');
    }
  });

  function handlePlayerDeparture(room: GE.Room, playerId: string) {
    const connectedCount = Array.from(room.players.values()).filter(p => p.connected).length;
    if (connectedCount === 0) {
      timerManager.clearTimer(room);
      return;
    }

    // If mid-game and the clue giver left/disconnected, advance the round or end game
    if (room.phase !== 'LOBBY' && room.phase !== 'GAME_OVER') {
      const order = room.clueGiverOrder.length > 0 ? room.clueGiverOrder : room.guesserOrder;
      const clueGiverId = order[room.clueGiverIndex];
      if (clueGiverId === playerId) {
        timerManager.clearTimer(room);
        if (room.roundNumber < room.totalRounds) {
          room.roundNumber++;
          startRound(room);
          return;
        } else {
          room.phase = 'GAME_OVER';
          broadcastState(room);
          return;
        }
      }

      // If guessers left during GUESSING, check if remaining submitted
      if (room.phase === 'GUESSING') {
        const remainingGuessers = Array.from(room.players.values()).filter(
          p => p.connected && p.id !== clueGiverId
        );
        if (remainingGuessers.length === 0 || room.guesses.size >= remainingGuessers.length) {
          endGuessing(room);
          return;
        }
      }
    }

    broadcastState(room);
  }

  // ── leave_room ───────────────────────────────────────────────────────────
  socket.on('leave_room', () => {
    try {
      if (!currentRoom || !currentPlayerId) return;

      const roomToLeave = currentRoom;
      const pid = currentPlayerId;

      socket.leave(roomToLeave.code);
      currentRoom = null;
      currentPlayerId = null;

      if (roomToLeave.phase === 'LOBBY' || roomToLeave.phase === 'GAME_OVER') {
        RM.deletePlayer(roomToLeave, pid);
      } else {
        RM.removePlayer(roomToLeave, pid);
      }

      handlePlayerDeparture(roomToLeave, pid);
    } catch (err) {
      // ignore
    }
  });

  // ── disconnect ───────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (!currentRoom || !currentPlayerId) return;

    const roomToLeave = currentRoom;
    const pid = currentPlayerId;

    RM.removePlayer(roomToLeave, pid);
    handlePlayerDeparture(roomToLeave, pid);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🎮 CLUNEXA server running on port ${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
});
