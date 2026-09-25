import React, { useEffect } from 'react';
import { sounds } from '../../utils/sounds';

// ─── Radial countdown timer ───────────────────────────────────────────────────

export const RadialTimer = ({
  seconds,
  maxSeconds,
}: {
  seconds: number;
  maxSeconds: number;
}) => {
  useEffect(() => { if (seconds > 0) { if (seconds <= 5) sounds.urgentTick(); else if (seconds <= 10) sounds.tick(); } }, [seconds]);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const pct = maxSeconds > 0 ? Math.max(0, Math.min(1, seconds / maxSeconds)) : 0;
  const offset = circumference - pct * circumference;

  let color = '#10B981'; // emerald
  if (pct < 0.2) color = '#EF4444'; // crimson
  else if (pct < 0.5) color = '#F59E0B'; // amber

  const isUrgent = seconds <= 10 && seconds > 0;

  return (
    <div className={`relative flex items-center justify-center w-20 h-20 flex-shrink-0 ${isUrgent ? 'animate-pulse' : ''}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <circle
          cx="48" cy="48" r={radius}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      <div
        className="absolute font-mono font-bold text-xl"
        style={{ color }}
      >
        {seconds}
      </div>
    </div>
  );
};

// ─── Player avatar chip ───────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#7C3AED', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#3B82F6', '#EC4899',
];

export const PlayerAvatar = ({
  name,
  seed,
  isHost,
  showName = true,
  size = 'md',
}: {
  name: string;
  seed: number;
  isHost?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const color = AVATAR_COLORS[seed % AVATAR_COLORS.length];
  const initial = name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}
          style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}40` }}
        >
          {initial}
        </div>
        {isHost && (
          <div
            className="absolute -top-2 -right-2 text-sm leading-none p-1 rounded-full border-2 border-void bg-amber-hot"
            title="Host"
          >
            👑
          </div>
        )}
      </div>
      {showName && (
        <div className="text-xs font-semibold text-muted truncate max-w-[72px] text-center">
          {name}
        </div>
      )}
    </div>
  );
};

// ─── Error / info toast ───────────────────────────────────────────────────────

export const ErrorToast = ({ message }: { message: string | null }) => {
  if (!message) return null;

  // Detect info vs error by content heuristic
  const isInfo = message.toLowerCase().includes('copied') || message.toLowerCase().includes('link');

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl animate-slide-up flex items-center gap-3 font-semibold max-w-xs ${
        isInfo
          ? 'bg-emerald-alive text-void'
          : 'bg-crimson-clash text-white'
      }`}
    >
      <span className="text-lg">{isInfo ? '✓' : '!'}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

// ─── Disconnect banner ────────────────────────────────────────────────────────

export const ConnectionBanner = ({ state }: { state: string }) => {
  if (state === 'connected') return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-hot text-void text-center py-2 font-bold text-sm flex items-center justify-center gap-2">
      <div className="w-2 h-2 rounded-full bg-void/40 animate-ping" />
      {state === 'connecting'
        ? 'Connecting to game server… (may take a moment if server is waking up)'
        : 'Disconnected from server — trying to reconnect…'}
    </div>
  );
};
