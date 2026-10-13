import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  CloudSun,
  Award,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Presentation
} from 'lucide-react';
import { MainNavId, WeatherCondition, UserGamification, UserProfile } from '../types.js';
import { MOTION_SPRINGS } from '../motion/config.js';
import { ScentFamilyAtmosphere, ATMOSPHERE_PROFILES } from './AtmosphericFragranceCanvas.js';
import { ambientAudioEngine } from '../services/ambientAudioEngine.js';
import { resolveVisualWorld } from '../utils/visualWorlds.js';
import { UserProfileMenu } from './auth/UserProfileMenu.js';
import {
  AtelierGlyph,
  WearGlyph,
  LayeringGlyph,
  ExploreGlyph,
  VaultGlyph,
  HeritageGlyph,
  CommunityGlyph,
  PortraitGlyph,
  ScannerGlyph,
  AcademyGlyph,
  GlyphProps
} from './ui/AtelierGlyphs.js';

interface AtelierNavbarProps {
  activeTab: MainNavId;
  setActiveTab: (tab: MainNavId) => void;
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  gamification: UserGamification;
  wardrobeCount: number;
  currentAtmosphere?: ScentFamilyAtmosphere;
  onOpenAtmosphere?: () => void;
  onTriggerSurprise?: () => void;
  onOpenPresentation?: () => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const AtelierNavbar: React.FC<AtelierNavbarProps> = ({
  activeTab,
  setActiveTab,
  weather,
  onOpenWeatherModal,
  gamification,
  wardrobeCount,
  currentAtmosphere = 'default',
  onOpenAtmosphere,
  onTriggerSurprise,
  onOpenPresentation,
  currentUser,
  onOpenLogin,
  onLogout
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
  const world = resolveVisualWorld(activeTab);

  const navItems: {
    id: MainNavId;
    label: string;
    glyph: React.FC<GlyphProps>;
  }[] = [
    { id: 'atelier', label: 'Atelier', glyph: AtelierGlyph },
    { id: 'wear', label: 'Wear', glyph: WearGlyph },
    { id: 'layer', label: 'Layering', glyph: LayeringGlyph },
    { id: 'explore', label: 'Explore', glyph: ExploreGlyph },
    { id: 'wardrobe', label: 'Vault', glyph: VaultGlyph },
    { id: 'heritage', label: 'Heritage', glyph: HeritageGlyph },
    { id: 'community', label: 'Society', glyph: CommunityGlyph },
    { id: 'mydna', label: 'Portrait', glyph: PortraitGlyph },
    { id: 'scanner', label: 'Scanner', glyph: ScannerGlyph },
    { id: 'academy', label: 'Academy', glyph: AcademyGlyph }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/85 dark:bg-[#120F0D]/90 backdrop-blur-2xl border-b border-black/[0.04] dark:border-white/[0.08] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Quiet Luxury Fragrance House Identity */}
          <motion.div
            id="nav-logo"
            onClick={() => setActiveTab('atelier')}
            whileHover={{ opacity: 0.85 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/15 flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.03] transition-colors group-hover:border-amber-600/40">
              <AtelierGlyph size={15} strokeWidth={1.25} className="text-amber-800 dark:text-amber-400" />
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg tracking-[0.22em] font-medium text-[#1A1613] dark:text-[#F3EFEA] uppercase leading-none">
                Olfactory AI
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8.5px] font-mono tracking-[0.2em] text-[#8A7E72] dark:text-[#A69B8F] uppercase leading-none">
                  {world.name.replace('The ', '')}
                </span>
                <span className="w-1 h-1 rounded-full bg-amber-600/40" />
                <span className="text-[8px] font-mono tracking-wider text-[#A89D91] hidden sm:inline leading-none">
                  {world.emotion.split(' • ')[0]}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Center Quiet Navigation Rail (Desktop) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-black/[0.02] dark:bg-white/[0.03] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
            {navItems.map((item) => {
              const Glyph = item.glyph;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wider uppercase inline-flex items-center gap-1.5 cursor-pointer relative transition-all duration-200 select-none ${
                    isActive
                      ? 'text-[#1A1613] dark:text-white font-semibold'
                      : 'text-[#7C7167] hover:text-[#26201B] dark:text-[#9E9387] dark:hover:text-[#F0EBE3]'
                  }`}
                >
                  {/* Understated Brass Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="atelier-desktop-nav-active"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-[#201A15] border border-amber-500/25 dark:border-amber-400/30 shadow-[0_2px_8px_rgba(217,119,6,0.08)] -z-10"
                      transition={MOTION_SPRINGS.tactilePress}
                    />
                  )}
                  <Glyph
                    size={14}
                    strokeWidth={1.3}
                    className={isActive ? 'text-amber-700 dark:text-amber-400' : 'text-[#9A8D80] dark:text-[#7A6F64]'}
                  />
                  <span>{item.label}</span>
                  {item.id === 'wardrobe' && wardrobeCount > 0 && (
                    <span className="text-[9px] px-1 py-0.2 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 font-mono font-bold leading-none">
                      {wardrobeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Accessories (Understated & Quiet) */}
          <div className="flex items-center gap-2">
            {/* Project Presentation Deck & PPTX Download */}
            {onOpenPresentation && (
              <motion.button
                id="navbar-presentation-btn"
                type="button"
                onClick={onOpenPresentation}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:border-amber-600/30 text-[#4A3F36] dark:text-[#D1C7BB] text-[11px] font-mono transition cursor-pointer select-none"
                title="Project Presentation Deck & Download PPT"
              >
                <Presentation className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Deck</span>
              </motion.button>
            )}

            {/* Surprise Me Serendipity */}
            {onTriggerSurprise && (
              <motion.button
                id="navbar-surprise-btn"
                type="button"
                onClick={onTriggerSurprise}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:border-amber-600/30 text-[#4A3F36] dark:text-[#D1C7BB] text-[11px] font-mono transition cursor-pointer select-none"
                title="Serendipitous Fragrance Discovery"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Serendipity</span>
              </motion.button>
            )}

            {/* Atmosphere Soundscape Trigger */}
            <motion.button
              id="navbar-ambiance-btn"
              type="button"
              onClick={onOpenAtmosphere}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={`Active Atmosphere: ${atmosphereProfile.name}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:border-amber-600/30 text-xs cursor-pointer text-[#4A3F36] dark:text-[#D1C7BB] transition select-none"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: atmosphereProfile.accentColor }}
              />
              <span className="text-[11px] font-mono tracking-wider hidden lg:inline">
                {atmosphereProfile.name.split(' ')[0]}
              </span>
              {isAudioActive && (
                <Volume2 className="w-3 h-3 text-amber-700 dark:text-amber-400 animate-pulse shrink-0" />
              )}
            </motion.button>

            {/* Weather / Climate Trigger */}
            <motion.button
              id="weather-status-btn"
              type="button"
              onClick={onOpenWeatherModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Olfactory Climate Factors"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:border-amber-600/30 text-xs cursor-pointer text-[#4A3F36] dark:text-[#D1C7BB] transition select-none"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span className="text-[11px] font-mono tracking-tight">
                {weather.temperature_c}°C
              </span>
            </motion.button>

            {/* Level / Rank Badge */}
            <motion.div
              id="user-xp-badge"
              onClick={() => setActiveTab('mydna')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={`Rank: ${gamification.title} (${gamification.xp} XP)`}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-xs cursor-pointer text-[#4A3F36] dark:text-[#D1C7BB] select-none"
            >
              <Award className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span className="text-[10px] font-mono tracking-wider font-semibold">
                Lvl {gamification.level}
              </span>
            </motion.div>

            {/* Scent Passport & User Profile Menu */}
            {onOpenLogin && (
              <UserProfileMenu
                currentUser={currentUser || null}
                onOpenLogin={onOpenLogin}
                onLogout={onLogout || (() => {})}
                onNavigateToDna={() => setActiveTab('mydna')}
                onNavigateToWardrobe={() => setActiveTab('wardrobe')}
              />
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              id="mobile-menu-toggle-btn"
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-[#3D352E] dark:text-[#E8E2D9] cursor-pointer"
              aria-label="Toggle Atelier Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Rail */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION_SPRINGS.luxurySoft}
              className="xl:hidden py-3 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-5 gap-1.5 overflow-hidden"
            >
              {/* Mobile Profile / Scent Passport Strip */}
              {onOpenLogin && (
                <div className="col-span-2 sm:col-span-5 pb-2 mb-1 border-b border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentUser && currentUser.role !== 'guest' ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-amber-700 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                          {currentUser.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-[#1A1613] dark:text-[#F4EFEA]">
                          {currentUser.name}
                        </span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/15 text-amber-900 dark:text-amber-300">
                          Lvl {currentUser.level}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-[#7A6E63] dark:text-[#A89C8F]">
                        Visiting Atelier Guest
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-medium text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {currentUser && currentUser.role !== 'guest' ? 'Switch Persona' : 'Sign In'}
                  </button>
                </div>
              )}
              {navItems.map((item) => {
                const Glyph = item.glyph;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-lg text-xs font-medium tracking-wide uppercase inline-flex items-center gap-2 text-left cursor-pointer transition select-none ${
                      isActive
                        ? 'bg-amber-600/10 text-amber-950 dark:text-amber-300 font-semibold border border-amber-600/25'
                        : 'text-[#6B6056] dark:text-[#A99D91] hover:text-[#1A1613] hover:bg-black/[0.02]'
                    }`}
                  >
                    <Glyph size={14} strokeWidth={1.3} className={isActive ? 'text-amber-700 dark:text-amber-400' : 'text-[#8A7E74]'} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              {onOpenPresentation && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenPresentation();
                    setMobileMenuOpen(false);
                  }}
                  className="col-span-2 sm:col-span-5 p-2 rounded-lg text-xs font-semibold tracking-wide uppercase inline-flex items-center justify-center gap-2 text-center cursor-pointer transition select-none bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30"
                >
                  <Presentation size={14} className="text-amber-700 dark:text-amber-400" />
                  <span>Project Presentation Deck (Download PPT)</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
