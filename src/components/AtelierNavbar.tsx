import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  FlaskConical,
  Compass,
  Layers,
  HeartHandshake,
  Flame,
  Users,
  Dna,
  CloudSun,
  Award,
  ChevronDown
} from 'lucide-react';
import { MainNavId, WeatherCondition, UserGamification } from '../types.js';
import { MOTION_SPRINGS } from '../motion/config.js';

interface AtelierNavbarProps {
  activeTab: MainNavId;
  setActiveTab: (tab: MainNavId) => void;
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  gamification: UserGamification;
  wardrobeCount: number;
}

export const AtelierNavbar: React.FC<AtelierNavbarProps> = ({
  activeTab,
  setActiveTab,
  weather,
  onOpenWeatherModal,
  gamification,
  wardrobeCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: MainNavId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'atelier', label: 'ATELIER', icon: Sparkles },
    { id: 'layer', label: 'LAYER', icon: FlaskConical },
    { id: 'explore', label: 'EXPLORE', icon: Compass },
    { id: 'wardrobe', label: 'WARDROBE', icon: Layers },
    { id: 'discover', label: 'DISCOVER', icon: Flame },
    { id: 'heritage', label: 'HERITAGE', icon: HeartHandshake },
    { id: 'community', label: 'COMMUNITY', icon: Users },
    { id: 'mydna', label: 'MY DNA', icon: Dna }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0E0C0A]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand Identity */}
          <motion.div
            id="nav-logo"
            onClick={() => setActiveTab('atelier')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-rose-700 to-purple-950 p-[1px] shadow-lg transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-xl bg-[#120F0D] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl tracking-wide font-medium text-stone-100 leading-tight">
                  Olfactory AI
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-amber-950/70 text-amber-300 rounded border border-amber-800/60 font-semibold">
                  Atelier
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-sans tracking-wide hidden md:block">
                Your Fragrance Universe. Your Scent Intelligence.
              </p>
            </div>
          </motion.div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06] relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium tracking-wider uppercase inline-flex items-center gap-1.5 cursor-pointer relative z-10 transition-colors duration-200 ${
                    isActive
                      ? 'text-amber-200 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {/* Shared Liquid Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-nav-pill"
                      className="absolute inset-0 rounded-xl bg-amber-500/15 border border-amber-500/40 shadow-xs -z-10"
                      transition={MOTION_SPRINGS.spatialLayout}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'wardrobe' && wardrobeCount > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-900/60 text-amber-300 font-mono font-bold">
                      {wardrobeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges: Weather & Gamification XP */}
          <div className="flex items-center gap-2.5">
            {/* Live Weather Trigger */}
            <motion.button
              id="weather-status-btn"
              type="button"
              onClick={onOpenWeatherModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              title="Current Olfactory Climate Modifiers"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-stone-300 text-xs transition cursor-pointer"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="flex flex-col text-left leading-none hidden sm:flex">
                <span className="text-[9px] text-stone-400 font-mono uppercase">Atmosphere</span>
                <span className="text-[11px] font-medium text-stone-200 mt-0.5">
                  {weather.temperature_c}°C • {weather.humidity_pct}%
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-500 hidden sm:block" />
            </motion.button>

            {/* Gamification Level Badge */}
            <motion.div
              id="user-xp-badge"
              onClick={() => setActiveTab('mydna')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              title={`Rank: ${gamification.title} (${gamification.xp} XP)`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-amber-950/60 border border-amber-600/30 text-xs cursor-pointer hover:border-amber-500/60 transition group shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider font-semibold">
                  Lvl {gamification.level}
                </span>
                <span className="text-[11px] font-medium text-stone-200 mt-0.5 max-w-[90px] sm:max-w-none truncate">
                  {gamification.title}
                </span>
              </div>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              id="mobile-menu-toggle-btn"
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-stone-300"
            >
              <Layers className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION_SPRINGS.luxurySoft}
              className="lg:hidden py-3 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-2 overflow-hidden"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-medium tracking-wide uppercase inline-flex items-center gap-2 text-left cursor-pointer transition ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                        : 'bg-white/[0.02] text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
