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
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center gap-2 pb-3 pt-2 bg-gradient-to-t from-void/90 to-transparent">
      {emojis.map(e => (
        <button
          key={e}
          type="button"
          onClick={() => onSend(e)}
          className="text-2xl w-11 h-11 rounded-2xl bg-surface-alt/80 border border-white/10 hover:bg-white/10 hover:scale-125 active:scale-95 transition-all duration-150"
        >
          {e}
        </button>
      ))}
    </div>
  );
};
