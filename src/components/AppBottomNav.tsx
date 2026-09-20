import React from 'react';
import { motion } from 'motion/react';
import { MainNavId } from '../types.js';
import { resolveVisualWorld } from '../utils/visualWorlds.js';
import {
  AtelierGlyph,
  WearGlyph,
  LayeringGlyph,
  VaultGlyph,
  HeritageGlyph,
  GlyphProps
} from './ui/AtelierGlyphs.js';

interface AppBottomNavProps {
  activeTab: MainNavId;
  setActiveTab: (tab: MainNavId) => void;
  wardrobeCount: number;
}

interface NavRailItem {
  id: MainNavId;
  label: string;
  glyph: React.FC<GlyphProps>;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  setActiveTab,
  wardrobeCount
}) => {
  const world = resolveVisualWorld(activeTab);

  const railItems: NavRailItem[] = [
    { id: 'atelier', label: 'Atelier', glyph: AtelierGlyph },
    { id: 'wear', label: 'Wear', glyph: WearGlyph },
    { id: 'layer', label: 'Layering', glyph: LayeringGlyph },
    { id: 'wardrobe', label: 'Vault', glyph: VaultGlyph },
    { id: 'heritage', label: 'Heritage', glyph: HeritageGlyph }
  ];

  // Tailored material styling according to visual world
  const railMaterial =
    world.id === 'archive'
      ? 'bg-[#221B16]/95 border-[#DECDBA]/20 shadow-[0_8px_32px_rgba(34,27,22,0.45)]'
      : world.id === 'chamber'
      ? 'bg-[#0E0C0A]/95 border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.65)]'
      : 'bg-[#181310]/95 border-white/[0.10] shadow-[0_8px_32px_rgba(24,19,16,0.45)]';

  const highlightBorder =
    world.id === 'archive'
      ? 'border-t-[#C2410C]/40'
      : world.id === 'chamber'
      ? 'border-t-[#D4AF37]/50'
      : 'border-t-[#D97706]/45';

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden pointer-events-none">
      <div
        className={`max-w-md mx-auto ${railMaterial} ${highlightBorder} border rounded-2xl px-3 py-1.5 pointer-events-auto flex items-center justify-around relative backdrop-blur-2xl transition-colors duration-500`}
      >
        {railItems.map((item) => {
          const Glyph = item.glyph;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveTab(item.id)}
              className="min-h-[44px] min-w-[54px] flex flex-col items-center justify-center gap-1 cursor-pointer relative px-2 py-1 select-none group"
              aria-label={`Switch to ${item.label}`}
            >
              {/* Restrained Instrument Activation Notch */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-notch"
                  className="absolute -top-1.5 inset-x-3 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              {/* Glyph with Restrained Instrument Illumination */}
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-sm pointer-events-none" />
                )}
                <Glyph
                  size={17}
                  strokeWidth={isActive ? 1.5 : 1.3}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? 'text-amber-400'
                      : 'text-[#8C8176] group-hover:text-[#D1C7BB]'
                  }`}
                />
              </div>

              {/* Precise Small Monospace Label */}
              <span
                className={`text-[8.5px] font-mono tracking-widest uppercase transition-colors duration-200 leading-none ${
                  isActive
                    ? 'text-amber-200 font-semibold'
                    : 'text-[#7C7166] group-hover:text-[#AAA094]'
                }`}
              >
                {item.label}
              </span>

              {/* Vault Counter Badge */}
              {item.id === 'wardrobe' && wardrobeCount > 0 && (
                <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-amber-500/25 border border-amber-400/40 text-[7.5px] font-mono font-bold text-amber-200 flex items-center justify-center">
                  {wardrobeCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
