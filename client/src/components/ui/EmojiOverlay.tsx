import React from 'react';

interface EmojiBurst {
  id: string;
  emoji: string;
  playerName: string;
  x: number;
}

export const EmojiOverlay = ({ bursts }: { bursts: EmojiBurst[] }) => (
  <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
    {bursts.map(b => (
      <div
        key={b.id}
        className="absolute animate-emoji-float text-4xl select-none"
        style={{ left: `${b.x}%`, bottom: '80px' }}
      >
        {b.emoji}
      </div>
    ))}
  </div>
);

export const EmojiBar = ({ onSend }: { onSend: (emoji: string) => void }) => {
  const emojis = ['🔥', '😂', '💀', '😱', '👏', '🧠', '💯', '🎯'];
  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
      {emojis.map(e => (
        <button
          key={e}
          type="button"
          onClick={() => onSend(e)}
          className="text-xl w-10 h-10 rounded-2xl bg-surface-alt/80 border border-white/10 hover:bg-white/10 hover:scale-125 active:scale-90 transition-all duration-150 shadow-lg"
        >
          {e}
        </button>
      ))}
    </div>
  );
};
