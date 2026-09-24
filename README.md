# CLUNEXA 🎮

> **The multiplayer secret-word deduction party game.**  
> Outsmart your friends. One clue at a time.

[![Built with Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org)
[![Built with React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-orange)](https://socket.io)

---

## How to Play

1. **One player** is the **Guesser** — they cannot see the secret word
2. **Everyone else** submits exactly **one word clue** to help the guesser
3. **Matching clues cancel out** — if two players give the same clue, both disappear!
4. The guesser sees only the surviving unique clues and must deduce the secret word
5. Score points and rotate roles — highest score after all rounds wins

**The strategic tension:** Be helpful enough to guide the guesser, but unique enough that nobody copies your clue!

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
```

### Development (two terminals)

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Client starts on http://localhost:5173
```

Open `http://localhost:5173` in two browser windows to test multiplayer.

### Production (Single Server)

```bash
# Build the client first
cd client && npm run build

# Build the server
cd ../server && npm run build

# Start production server (serves both API + built client)
cd server && npm start
# Open http://localhost:3001
```

---

## Deployment

### Option 1: Render.com (Recommended, Free Tier)

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install && npm run build`
   - **Start Command:** `cd server && node dist/server.js`
   - **Environment:** Node
5. Add environment variables: `NODE_ENV=production`
6. Deploy → You'll get a public URL with WebSocket support

### Option 2: Railway.app

1. Push to GitHub
2. Create new Railway project → Deploy from GitHub
3. Set start command: `node server/dist/server.js`
4. Railway auto-detects the Procfile

### Option 3: Fly.io

```bash
fly launch
fly deploy
```

---

## Architecture

```
clunexa/
├── server/                 # Node.js + Express + Socket.IO backend
│   └── src/
│       ├── server.ts       # Express app, Socket.IO handlers, game flow
│       ├── GameEngine.ts   # State machine, scoring, security masking
│       ├── RoomManager.ts  # In-memory room store, player management
│       ├── TimerManager.ts # Server-authoritative countdown timers
│       └── WordBank.ts     # 60+ curated secret words across 6 categories
└── client/                 # React 18 + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── App.tsx          # Phase-based view router
        ├── hooks/
        │   └── useSocketGame.ts  # All Socket.IO client logic
        ├── types/game.ts         # Shared TypeScript types
        └── components/
            ├── ui/               # Reusable components (Timer, Avatar, Toast)
            └── views/            # Full-screen game states
```

### Game State Machine
```
LOBBY → ROUND_INTRO (3s) → CLUE_SUBMISSION (45s) → CLUE_REVEAL (6s) → GUESSING (30s) → ROUND_RESULT (7s) → [next round or GAME_OVER]
```

### Security (Server-Authoritative)
- Secret word is **never sent** to the Guesser's browser during active play
- Clue text is **hidden from all clients** until CLUE_REVEAL phase
- All phase transitions, timers, scoring, and duplicate detection run on the server
- Clients cannot manipulate scores or game state

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Space Grotesk, JetBrains Mono |
| Animations | CSS keyframes, canvas-confetti |
| Backend | Node.js, Express, Socket.IO v4 |
| State | Server-authoritative in-memory (Map) |
| Deployment | Single-server (Express serves React build) |

---

## Word Categories (60+ words)

- 🍕 Food & Drinks
- 🐧 Animals & Nature  
- 🎸 Objects & Inventions
- 🏛️ Places & Landmarks
- 🚀 People & Roles
- 🎒 Everyday Life

---

*Built for the Handshake AI Skills Studio × OpenAI "Create a Multiplayer Game" challenge.*
