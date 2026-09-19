import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Volume2,
  Shirt
} from 'lucide-react';
import { MainNavId, WeatherCondition, UserGamification } from '../types.js';
import { MOTION_SPRINGS } from '../motion/config.js';
import { ScentFamilyAtmosphere, ATMOSPHERE_PROFILES } from './AtmosphericFragranceCanvas.js';
import { ambientAudioEngine } from '../services/ambientAudioEngine.js';

interface AtelierNavbarProps {
  activeTab: MainNavId;
  setActiveTab: (tab: MainNavId) => void;
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  gamification: UserGamification;
  wardrobeCount: number;
  currentAtmosphere?: ScentFamilyAtmosphere;
  onOpenAtmosphere?: () => void;
}

export const AtelierNavbar: React.FC<AtelierNavbarProps> = ({
  activeTab,
  setActiveTab,
  weather,
  onOpenWeatherModal,
  gamification,
  wardrobeCount,
  currentAtmosphere = 'default',
  onOpenAtmosphere
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(ambientAudioEngine.isPlaying());

  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setIsAudioActive(ambientAudioEngine.isPlaying());
    });
    return unsub;
  }, []);

  const atmosphereProfile = ATMOSPHERE_PROFILES[currentAtmosphere] || ATMOSPHERE_PROFILES.default;

  const navItems: { id: MainNavId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'atelier', label: 'ATELIER', icon: Sparkles },
    { id: 'wear', label: 'WEAR TODAY', icon: Shirt },
    { id: 'layer', label: 'LAYER', icon: FlaskConical },
    { id: 'explore', label: 'EXPLORE', icon: Compass },
    { id: 'wardrobe', label: 'WARDROBE', icon: Layers },
    { id: 'discover', label: 'DISCOVER', icon: Flame },
    { id: 'heritage', label: 'HERITAGE', icon: HeartHandshake },
    { id: 'community', label: 'COMMUNITY', icon: Users },
    { id: 'mydna', label: 'MY DNA', icon: Dna }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-[0_8px_32px_0_rgba(95,70,40,0.05)] transition-all">
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
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/80 via-amber-600/70 to-amber-800/80 p-[1px] shadow-[0_4px_16px_rgba(217,119,6,0.25)] transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl flex items-center justify-center border border-white/90">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl tracking-wide font-semibold text-[#1A1613] leading-tight">
                  Olfactory AI
                </span>
                <span className="text-[9px] font-mono-lab uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/80 text-amber-900 border border-white shadow-2xs font-semibold backdrop-blur-md">
                  Atelier
                </span>
              </div>
              <p className="text-[10px] text-[#7A6F66] font-sans tracking-wide hidden md:block">
                Your Fragrance Universe. Your Scent Intelligence.
              </p>
            </div>
          </motion.div>

          {/* Center Navigation Links (Desktop) - Liquid Glass Capsule */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/45 backdrop-blur-xl p-1.5 rounded-2xl border border-white/75 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),_0_4px_20px_rgba(0,0,0,0.03)] relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium tracking-wider uppercase inline-flex items-center gap-1.5 cursor-pointer relative z-10 transition-all duration-200 ${
                    isActive
                      ? 'text-amber-950 font-bold'
                      : 'text-[#6B6056] hover:text-[#1A1613]'
                  }`}
                >
                  {/* Shared Liquid Indicator Pill (Illuminated Atelier Room Feel) */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-nav-pill"
                      className="absolute inset-0 rounded-xl bg-white border border-amber-300/80 shadow-[0_4px_16px_rgba(217,119,6,0.14),_inset_0_1px_1.5px_rgba(255,255,255,1)] -z-10"
                      transition={MOTION_SPRINGS.spatialLayout}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-[#8A7E74]'}`} />
                  <span>{item.label}</span>
                  {item.id === 'wardrobe' && wardrobeCount > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-950 border border-amber-500/30 font-mono font-bold backdrop-blur-xs">
                      {wardrobeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges: Atmosphere Soundscape, Weather & Gamification XP */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Atmosphere & Heritage Soundscape Trigger */}
            <motion.button
              id="navbar-ambiance-btn"
              type="button"
              onClick={onOpenAtmosphere}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              title={`Active Atmosphere: ${atmosphereProfile.name}`}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl liquid-glass-pill text-[#3D352E] text-xs cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm animate-pulse"
                style={{ backgroundColor: atmosphereProfile.accentColor }}
              />
              <div className="flex flex-col text-left leading-none hidden md:flex">
                <span className="text-[9px] text-[#7A6F66] font-mono-lab uppercase">Ambiance</span>
                <span className="text-[11px] font-medium text-[#1A1613] mt-0.5 truncate max-w-[100px]">
                  {atmosphereProfile.name.split(' ')[0]}
                </span>
              </div>
              {isAudioActive && (
                <Volume2 className="w-3.5 h-3.5 text-amber-700 animate-pulse shrink-0" />
              )}
            </motion.button>

            {/* Live Weather Trigger */}
            <motion.button
              id="weather-status-btn"
              type="button"
              onClick={onOpenWeatherModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              title="Current Olfactory Climate Modifiers"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-glass-pill text-[#3D352E] text-xs cursor-pointer"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <div className="flex flex-col text-left leading-none hidden sm:flex">
                <span className="text-[9px] text-[#7A6F66] font-mono-lab uppercase">Atmosphere</span>
                <span className="text-[11px] font-medium text-[#1A1613] mt-0.5">
                  {weather.temperature_c}°C • {weather.humidity_pct}%
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#8A7E74] hidden sm:block" />
            </motion.button>

            {/* Gamification Level Badge */}
            <motion.div
              id="user-xp-badge"
              onClick={() => setActiveTab('mydna')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              title={`Rank: ${gamification.title} (${gamification.xp} XP)`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-100/80 via-white/80 to-rose-100/80 backdrop-blur-xl border border-white text-xs cursor-pointer shadow-[0_4px_16px_rgba(245,158,11,0.1),_inset_0_1px_1.5px_rgba(255,255,255,1)] hover:border-amber-400/80 transition group"
            >
              <Award className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] text-amber-800 font-mono-lab uppercase tracking-wider font-bold">
                  Lvl {gamification.level}
                </span>
                <span className="text-[11px] font-semibold text-[#1A1613] mt-0.5 max-w-[90px] sm:max-w-none truncate">
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
              className="lg:hidden p-2 rounded-xl liquid-glass-pill text-[#3D352E]"
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
              className="lg:hidden py-3 border-t border-white/60 grid grid-cols-2 sm:grid-cols-4 gap-2 overflow-hidden"
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
                        ? 'bg-white/95 text-amber-950 border border-white shadow-xs font-bold'
                        : 'bg-white/50 text-[#6B6056] hover:text-[#1A1613] border border-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-[#8A7E74]'}`} />
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
