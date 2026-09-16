import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FlaskConical, Compass, Layers, HeartHandshake } from 'lucide-react';
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
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#120F0D]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-2 shadow-2xl md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Atelier */}
        <motion.button
          id="bottom-nav-atelier"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('atelier')}
          className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer relative py-1 ${
            activeTab === 'atelier' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Atelier</span>
        </motion.button>

        {/* Explore */}
        <motion.button
          id="bottom-nav-explore"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer relative py-1 ${
            activeTab === 'explore' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Galaxy</span>
        </motion.button>

        {/* Center Prominent Layer Lab Button */}
        <div className="relative -top-4">
          <motion.button
            id="bottom-nav-layer-center"
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={MOTION_SPRINGS.tactilePress}
            onClick={() => setActiveTab('layer')}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-700 to-amber-700 text-stone-100 flex items-center justify-center shadow-xl border-2 border-[#1E1B18] cursor-pointer"
          >
            <FlaskConical className="w-5 h-5 text-amber-200" />
          </motion.button>
        </div>

        {/* Wardrobe */}
        <motion.button
          id="bottom-nav-wardrobe"
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('wardrobe')}
          className={`relative flex flex-col items-center justify-center gap-1 transition cursor-pointer py-1 ${
            activeTab === 'wardrobe' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Vault</span>
          {wardrobeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-[8px] font-bold text-white flex items-center justify-center"
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
          className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer py-1 ${
            activeTab === 'heritage' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Heritage</span>
        </motion.button>
      </div>
    </div>
  );
};
