import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, FlaskConical, ArrowRight, Layers, Award, BookOpen } from 'lucide-react';
import { HeritageEntry, Fragrance } from '../../types.js';
import { isFragranceHeritageMatch } from '../../services/heritageService.js';

interface HeritageCabinetBridgeProps {
  ownedFragrances: Fragrance[];
  heritageEntries: HeritageEntry[];
  onSelectSpecimen: (entry: HeritageEntry) => void;
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLab?: (fragranceA: Fragrance, fragranceB?: Fragrance) => void;
  onWearToday?: (fragrance: Fragrance) => void;
  onNavigate?: (tab: any) => void;
}

export const HeritageCabinetBridge: React.FC<HeritageCabinetBridgeProps> = ({
  ownedFragrances,
  heritageEntries,
  onSelectSpecimen,
  onInspectInChamber,
  onSendToLab,
  onWearToday,
  onNavigate
}) => {
  // Map each owned fragrance to its matching heritage materials
  const matchedOwnedFragrances = ownedFragrances.map((frag) => {
    const matches = heritageEntries
      .map((entry) => {
        const res = isFragranceHeritageMatch(frag, entry);
        return {
          entry,
          isMatch: res.isMatch,
          matchReason: res.matchReason,
          relationshipType: res.relationshipType
        };
      })
      .filter((m) => m.isMatch);

    return {
      fragrance: frag,
      heritageMatches: matches
    };
  }).filter((item) => item.heritageMatches.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#3E3228] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#F59E0B]">
            <Sparkles className="w-3.5 h-3.5" />
            Cabinet Lineage & Connections
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] mt-1">
            Heritage in Your Cabinet
          </h2>
          <p className="text-sm text-[#A8988B] mt-1 max-w-xl">
            Flacons in your personal wardrobe that directly embody or share olfactory DNA with
            India’s classical distillation and botanical traditions.
          </p>
        </div>

        <div className="text-xs font-mono-lab text-[#D6C7B2] bg-[#2A221C] px-3.5 py-1.5 rounded-xl border border-[#44362B] self-start md:self-auto">
          {matchedOwnedFragrances.length} Connected Flacons
        </div>
      </div>

      {/* Grid of Matched Owned Fragrances */}
      {matchedOwnedFragrances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedOwnedFragrances.map(({ fragrance, heritageMatches }) => (
            <motion.div
              key={fragrance.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 bg-[#1F1813] border border-[#3E3228] hover:border-[#D97706]/70 transition-all flex flex-col justify-between space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-lab uppercase text-[#F59E0B] bg-[#2A1F17] px-2 py-0.5 rounded border border-[#443325]">
                    {fragrance.brand}
                  </span>
                  <span className="text-[10px] font-mono-lab text-[#8C7D70]">
                    {fragrance.format || 'EDP'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-[#FAF5F0] font-medium">
                    {fragrance.name}
                  </h3>
                  <div className="text-xs text-[#A8988B] mt-0.5">
                    Family: {fragrance.fragrance_family}
                  </div>
                </div>

                {/* Connected Heritage Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono-lab uppercase text-[#9C8D80] tracking-wider">
                    Connected Traditions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {heritageMatches.map(({ entry, matchReason }) => (
                      <button
                        key={entry.id}
                        onClick={() => onSelectSpecimen(entry)}
                        className="text-[11px] font-serif px-2.5 py-1 rounded-lg bg-[#2A1E16] hover:bg-[#3D2C1F] text-[#FDE68A] border border-[#523A25] transition-colors flex items-center gap-1"
                        title={matchReason}
                      >
                        <span>{entry.name}</span>
                        <span className="text-[9px] text-[#F59E0B]">↗</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Match Reason */}
                <p className="text-xs text-[#C8BAAB] leading-relaxed italic bg-[#16110E] p-2.5 rounded-xl border border-[#3E3228]/60">
                  {heritageMatches[0]?.matchReason}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#3E3228]/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {onInspectInChamber && (
                    <button
                      onClick={() => onInspectInChamber(fragrance)}
                      className="px-2.5 py-1 rounded-lg bg-[#2E2219] hover:bg-[#D97706] text-xs font-mono-lab text-[#FAF5F0] transition-colors border border-[#4A3728] flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3" />
                      Chamber
                    </button>
                  )}
                  {onSendToLab && (
                    <button
                      onClick={() => onSendToLab(fragrance)}
                      className="px-2.5 py-1 rounded-lg bg-[#2E2219] hover:bg-[#D97706] text-xs font-mono-lab text-[#FAF5F0] transition-colors border border-[#4A3728] flex items-center gap-1"
                    >
                      <FlaskConical className="w-3 h-3" />
                      Lab
                    </button>
                  )}
                </div>

                {onWearToday && (
                  <button
                    onClick={() => onWearToday(fragrance)}
                    className="text-xs font-mono-lab text-[#F59E0B] hover:text-[#FEF3C7] transition-colors"
                  >
                    Wear Today
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-[#1C1713] border border-[#3E3228] text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#D97706] mx-auto opacity-40" />
          <h3 className="font-serif text-xl text-[#FAF5F0]">
            No direct heritage matches in your cabinet yet
          </h3>
          <p className="text-xs text-[#A8988B] max-w-md mx-auto leading-relaxed">
            Your wardrobe currently contains modern compositions that do not feature verified Indian
            botanicals like Mitti Attar, Mysore Sandalwood, or Wild Ruh Khus.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('atelier')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B45309] text-xs font-mono-lab uppercase text-white hover:bg-[#D97706] transition-colors"
            >
              Explore Heritage Bottles in Atelier
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
