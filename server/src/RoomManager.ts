import { v4 as uuidv4 } from 'uuid';
import { Room, Player } from './GameEngine.js';

const rooms = new Map<string, Room>();

export function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms.has(code));
  return code;
}

export function createRoom(hostId: string, hostName: string, hostToken: string): Room {
  const code = generateCode();
  const room: Room = {
    code,
    hostId,
    players: new Map<string, Player>(),
    phase: 'LOBBY',
    settings: { roundsPerPlayer: 1, submissionTimeSec: 45, guessTimeSec: 30 },
    roundNumber: 0,
    totalRounds: 0,
    clueGiverIndex: -1,
    secretWord: '',
    category: '',
    categoryFilter: 'All Mix',
    clue: null,
    clues: new Map(),
    guesses: new Map(),
    guess: null,
    isCorrect: null,
    scoreDeltas: null,
    usedWords: new Set<string>(),
    guessingStartTime: 0,
    streak: new Map(),
    timerHandle: null,
    timeRemaining: 0,
    clueGiverOrder: [],
    guesserOrder: [],
    guesserIndex: -1,
  };
  const validHostToken = (hostToken && hostToken.trim().length > 0) ? hostToken.trim() : uuidv4();
  addPlayer(room, hostId, hostName, validHostToken);
  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function addPlayer(room: Room, socketId: string, name: string, token: string): Player {
  const cleanToken = (token || '').trim();

  // If reconnecting with a valid non-empty token
  if (cleanToken.length > 0) {
    for (const [id, p] of room.players.entries()) {
      if (p.token && p.token === cleanToken) {
        // Update socket ID for reconnecting player
        const updatedPlayer = { ...p, id: socketId, connected: true };
        room.players.delete(id);
        room.players.set(socketId, updatedPlayer);
        if (room.hostId === id) room.hostId = socketId;
        
        // Update guesserOrder
        const idx = room.guesserOrder.indexOf(id);
        if (idx !== -1) room.guesserOrder[idx] = socketId;
        
        return updatedPlayer;
      }
    }
  }
  
  // New player — always guarantee a non-empty unique token
  const playerToken = cleanToken.length > 0 ? cleanToken : uuidv4();
  const player: Player = {
    id: socketId,
    token: playerToken,
    name: name.substring(0, 16).replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    score: 0,
    isHost: room.players.size === 0,
    connected: true,
    avatarSeed: Math.floor(Math.random() * 8)
  };
  room.players.set(socketId, player);
  if (room.phase === 'LOBBY') {
    room.clueGiverOrder.push(socketId);
    room.guesserOrder.push(socketId);
  }
  return player;
}

export function deletePlayer(room: Room, socketId: string): void {
  const player = room.players.get(socketId);
  if (!player) return;

  room.players.delete(socketId);
  const cgIdx = room.clueGiverOrder.indexOf(socketId);
  if (cgIdx !== -1) room.clueGiverOrder.splice(cgIdx, 1);
  const orderIdx = room.guesserOrder.indexOf(socketId);
  if (orderIdx !== -1) room.guesserOrder.splice(orderIdx, 1);

  // If was host, promote next connected player
  if (room.hostId === socketId) {
    const nextHost = Array.from(room.players.values()).find(p => p.connected);
    if (nextHost) {
      room.hostId = nextHost.id;
      nextHost.isHost = true;
    }
  }

  // If no players remain, delete the room
  if (room.players.size === 0) {
    rooms.delete(room.code);
  }
}

export function removePlayer(room: Room, socketId: string): void {
  const player = room.players.get(socketId);
  if (player) {
    player.connected = false;
    if (room.hostId === socketId) {
      // promote next connected
      const nextHost = Array.from(room.players.values()).find(p => p.connected);
      if (nextHost) {
        room.hostId = nextHost.id;
        nextHost.isHost = true;
      }
    }
  }
}

export function cleanup(): void {
  // Clean up rooms older than 2 hours with 0 connected players
}
