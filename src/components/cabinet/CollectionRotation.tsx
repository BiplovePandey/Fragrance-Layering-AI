import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Clock, Sparkles, Shirt, Calendar, Droplet } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface CollectionRotationProps {
  ownedFragrances: Fragrance[];
  onInspect: (fragrance: Fragrance) => void;
  onWearToday: (fragrance: Fragrance) => void;
}

export const CollectionRotation: React.FC<CollectionRotationProps> = ({
  ownedFragrances,
  onInspect,
  onWearToday
}) => {
  const recentWears = useMemo(() => {
    return olfactoryIntelligence.getRecentWears().slice(0, 4);
  }, []);

  const neglected = useMemo(() => {
    return olfactoryIntelligence.getNeglectedFragrances(ownedFragrances);
  }, [ownedFragrances]);

  return (
    <div className="rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#16120E] via-[#100D0A] to-[#0A0806] p-6 sm:p-8 shadow-2xl text-stone-100 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rotation Intelligence &bull; Scent Logs</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
            Collection Rotation & Rediscovery
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Balance olfactory fatigue by rotating your signatures and rediscovering unworn cabinet flacons.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMN 1: RECENTLY WORN (SCENT CALENDAR) */}
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h4 className="font-serif text-lg font-medium text-stone-200">
                Recent Scent Journal
              </h4>
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
              Wear History
            </span>
          </div>

          <div className="space-y-2.5">
            {recentWears.map((item) => {
              const matchedFrag = ownedFragrances.find(f => f.id === item.fragranceId);
              const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={item.id}
                  onClick={() => matchedFrag && onInspect(matchedFrag)}
                  className="p-3 rounded-xl bg-stone-950/70 hover:bg-stone-900 border border-stone-800/80 flex items-center justify-between gap-3 transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="font-serif text-sm font-medium text-stone-200 block truncate">
                      {item.fragranceName}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate">
                      {item.occasion} &bull; {item.weatherSummary}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono text-amber-300 font-semibold block">
                      {item.satisfactionRating}/10
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 block">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: NEGLECTED / REDISCOVER CABINET FLACONS */}
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-serif text-lg font-medium text-stone-200">
                Time to Rediscover
              </h4>
            </div>
            <span className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider">
              Awaiting Wear
            </span>
          </div>

          <p className="text-xs text-stone-400">
            These bottles have rested in your cabinet without recent wear. Introduce them into your daily rotation:
          </p>

          <div className="space-y-2.5">
            {neglected.map((frag) => (
              <div
                key={frag.id}
                className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => onInspect(frag)}
                  className="min-w-0 cursor-pointer group"
                >
                  <span className="font-serif text-sm font-medium text-stone-200 group-hover:text-amber-200 block truncate transition-colors">
                    {frag.name}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 block truncate">
                    {frag.brand} &bull; {frag.fragrance_family}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onWearToday(frag)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition cursor-pointer"
                  >
                    Wear
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspect(frag)}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs transition cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
