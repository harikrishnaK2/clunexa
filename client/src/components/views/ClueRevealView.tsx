import React, { useEffect, useState } from 'react';
import { ClientGameState } from '../../types/game';

type AnimPhase = 'intro' | 'reveal' | 'collide' | 'done';

export const ClueRevealView = ({ gameState }: { gameState: ClientGameState }) => {
  const [animPhase, setAnimPhase] = useState<AnimPhase>('intro');
  const [visibleCount, setVisibleCount] = useState(0);

  const clues = gameState.clues ?? [];
  const uniqueClues = clues.filter(c => !c.isDuplicate);
  const duplicateClues = clues.filter(c => c.isDuplicate);

  // Build duplicate groups for display (group by normalized value)
  const dupGroups = new Map<string, typeof clues>();
  for (const c of duplicateClues) {
    const key = c.rawClue.toLowerCase().trim();
    if (!dupGroups.has(key)) dupGroups.set(key, []);
    dupGroups.get(key)!.push(c);
  }

  useEffect(() => {
    // Sequence: fade title → stagger cards → collision → done
    const t1 = setTimeout(() => {
      setAnimPhase('reveal');

      let count = 0;
      const stagger = setInterval(() => {
        count++;
        setVisibleCount(count);
        if (count >= clues.length) {
          clearInterval(stagger);
          const t2 = setTimeout(() => {
            setAnimPhase('collide');
            const t3 = setTimeout(() => setAnimPhase('done'), 1500);
            return () => clearTimeout(t3);
          }, 800);
          return () => clearTimeout(t2);
        }
      }, 200);

      return () => clearInterval(stagger);
    }, 700);

    return () => clearTimeout(t1);
  }, [clues.length]);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col items-center pt-12 animate-fade-in overflow-hidden">
      {/* Title */}
      <div
        className={`transition-all duration-700 mb-10 text-center ${
          animPhase !== 'intro' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-light">
          THE CLUES ARE IN
        </h1>
        <p className="text-muted mt-2 text-sm">
          {clues.length === 0 ? 'No clues were submitted!' : `${clues.length} clue${clues.length !== 1 ? 's' : ''} received — checking for duplicates…`}
        </p>
      </div>

      {clues.length === 0 ? (
        <div className="bg-surface border-2 border-crimson-clash/40 rounded-2xl p-8 text-center max-w-sm">
          <div className="text-5xl mb-4">😶</div>
          <h2 className="font-display text-xl font-bold text-crimson-clash">No clues submitted</h2>
          <p className="text-muted mt-2 text-sm">Nobody submitted a clue in time.</p>
        </div>
      ) : (
        <>
          {/* Clue cards grid */}
          <div className="flex flex-wrap justify-center gap-4 w-full mb-8">
            {clues.map((clue, idx) => {
              const isVisible = idx < visibleCount;
              const showCollide = animPhase === 'collide' || animPhase === 'done';

              return (
                <div
                  key={idx}
                  className={`relative transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <div
                    className={`w-36 md:w-44 min-h-[110px] border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      showCollide
                        ? clue.isDuplicate
                          ? 'bg-crimson-clash/10 border-crimson-clash animate-shake'
                          : 'bg-emerald-alive/10 border-emerald-alive shadow-lg shadow-emerald-alive/20'
                        : 'bg-surface border-white/15'
                    }`}
                  >
                    <span className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide leading-tight">
                      {clue.rawClue}
                    </span>
                    {showCollide && (
                      <span className={`text-xs font-bold mt-2 ${clue.isDuplicate ? 'text-crimson-clash/70' : 'text-emerald-alive/70'}`}>
                        {clue.isDuplicate ? clue.playerName : clue.playerName}
                      </span>
                    )}
                  </div>

                  {/* Duplicate stamp */}
                  {showCollide && clue.isDuplicate && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-void/80 backdrop-blur-sm border-2 border-crimson-clash text-crimson-clash font-display font-bold text-sm px-3 py-1.5 rounded-lg animate-stamp-in text-center shadow-xl"
                        style={{ transform: 'rotate(-8deg)' }}
                      >
                        DUPLICATE!
                        <div className="text-xs opacity-70">✕ ELIMINATED</div>
                      </div>
                    </div>
                  )}

                  {/* Unique badge */}
                  {showCollide && !clue.isDuplicate && (
                    <div className="absolute -top-2 -right-2 bg-emerald-alive text-void font-bold text-xs px-2 py-0.5 rounded-full animate-score-pop shadow-lg">
                      ✓ UNIQUE
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Verdict */}
          <div
            className={`transition-all duration-700 text-center ${
              animPhase === 'collide' || animPhase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {uniqueClues.length > 0 ? (
              <div className="bg-surface border border-emerald-alive/20 rounded-2xl px-8 py-4">
                <p className="text-xl font-bold">
                  <span className="text-emerald-alive">{uniqueClues.length}</span>
                  <span className="text-muted"> of </span>
                  <span className="text-ink">{clues.length}</span>
                  <span className="text-muted"> clue{clues.length !== 1 ? 's' : ''} survived!</span>
                </p>
                {duplicateClues.length > 0 && (
                  <p className="text-muted text-sm mt-1">
                    {duplicateClues.length} clue{duplicateClues.length !== 1 ? 's were' : ' was'} eliminated for being identical.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-crimson-clash/10 border border-crimson-clash/30 rounded-2xl px-8 py-4">
                <p className="text-xl font-bold text-crimson-clash">All clues were duplicates!</p>
                <p className="text-muted text-sm mt-1">The guesser is flying blind…</p>
              </div>
            )}
            <p className="text-muted text-xs mt-4 animate-pulse">Switching to guessing phase…</p>
          </div>
        </>
      )}
    </div>
  );
};
