import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FlaskConical, Compass, Layers, HeartHandshake, Shirt } from 'lucide-react';
import { MainNavId } from '../types.js';
import { MOTION_SPRINGS } from '../motion/config.js';

interface AppBottomNavProps {
  activeTab: MainNavId;
  setActiveTab: (tab: MainNavId) => void;
  wardrobeCount: number;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  setActiveTab,
  wardrobeCount
}) => {
  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden pointer-events-none">
      <div className="max-w-md mx-auto liquid-glass-dock rounded-3xl px-2 py-1.5 pointer-events-auto flex items-center justify-around relative shadow-[0_8px_32px_rgba(95,70,40,0.12)]">
        {/* Atelier */}
        <motion.button
          id="bottom-nav-atelier"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('atelier')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 transition cursor-pointer relative px-2 py-1 select-none ${
            activeTab === 'atelier' ? 'text-amber-950 font-bold' : 'text-[#7A6F66] hover:text-[#1A1613]'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === 'atelier' ? 'text-amber-700' : ''}`} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Atelier</span>
        </motion.button>

        {/* Wear */}
        <motion.button
          id="bottom-nav-wear"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('wear')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 transition cursor-pointer relative px-2 py-1 select-none ${
            activeTab === 'wear' ? 'text-amber-950 font-bold' : 'text-[#7A6F66] hover:text-[#1A1613]'
          }`}
        >
          <Shirt className={`w-4 h-4 ${activeTab === 'wear' ? 'text-amber-700' : ''}`} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Wear</span>
        </motion.button>

        {/* Center Prominent Layer Lab Button - Liquid Gem */}
        <div className="relative -top-3">
          <motion.button
            id="bottom-nav-layer-center"
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={MOTION_SPRINGS.tactilePress}
            onClick={() => setActiveTab('layer')}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-700 to-rose-700 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(217,119,6,0.38)] border border-white/90 cursor-pointer backdrop-blur-md"
            aria-label="Open Layering Laboratory"
          >
            <FlaskConical className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Wardrobe */}
        <motion.button
          id="bottom-nav-wardrobe"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('wardrobe')}
          className={`min-h-[44px] min-w-[44px] relative flex flex-col items-center justify-center gap-0.5 transition cursor-pointer px-2 py-1 select-none ${
            activeTab === 'wardrobe' ? 'text-amber-950 font-bold' : 'text-[#7A6F66] hover:text-[#1A1613]'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'wardrobe' ? 'text-amber-700' : ''}`} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Vault</span>
          {wardrobeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute 0.5 right-1 w-3.5 h-3.5 rounded-full bg-amber-600 text-[8px] font-bold text-white flex items-center justify-center shadow-2xs"
            >
              {wardrobeCount}
            </motion.span>
          )}
        </motion.button>

        {/* Heritage */}
        <motion.button
          id="bottom-nav-heritage"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('heritage')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 transition cursor-pointer px-2 py-1 select-none ${
            activeTab === 'heritage' ? 'text-amber-950 font-bold' : 'text-[#7A6F66] hover:text-[#1A1613]'
          }`}
        >
          <HeartHandshake className={`w-4 h-4 ${activeTab === 'heritage' ? 'text-amber-700' : ''}`} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Heritage</span>
        </motion.button>
      </div>
    </div>
  );
};
