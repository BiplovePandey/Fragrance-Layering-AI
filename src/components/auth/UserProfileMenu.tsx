import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  KeyRound,
  User,
  LogOut,
  Sparkles,
  Award,
  ChevronDown,
  Layers,
  Fingerprint,
  Compass,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types.js';
import { MOTION_SPRINGS } from '../../motion/config.js';

interface UserProfileMenuProps {
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateToDna?: () => void;
  onNavigateToWardrobe?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onNavigateToDna,
  onNavigateToWardrobe
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser || currentUser.role === 'guest') {
    return (
      <motion.button
        id="navbar-login-btn"
        type="button"
        onClick={onOpenLogin}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-amber-600/15 hover:border-amber-500/60 text-amber-950 dark:text-amber-200 text-xs font-medium cursor-pointer transition select-none shadow-[0_2px_10px_rgba(217,119,6,0.12)] group"
        title="Sign in to your Olfactory Scent Passport"
      >
        <KeyRound className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="font-serif tracking-wider font-semibold">Scent Passport</span>
      </motion.button>
    );
  }

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const xpProgress = Math.min(100, Math.round(((currentUser.xp % 500) / 500) * 100));

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        id="navbar-user-profile-btn"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] hover:border-amber-500/40 cursor-pointer select-none transition group"
        aria-label="User Scent Passport Profile"
      >
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-5 h-5 rounded-full object-cover border border-amber-600/40"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-amber-700 text-white font-mono text-[9px] flex items-center justify-center font-bold">
            {initials}
          </div>
        )}

        <span className="text-xs font-medium text-[#2A231C] dark:text-[#E8E2D9] max-w-[85px] truncate hidden sm:inline">
          {currentUser.name.split(' ')[0]}
        </span>

        <span className="text-[9.5px] font-mono font-semibold px-1 py-0.5 rounded bg-amber-500/15 text-amber-900 dark:text-amber-300 hidden md:inline">
          Lvl {currentUser.level}
        </span>

        <ChevronDown
          className={`w-3 h-3 text-[#7E7165] dark:text-[#9F9387] transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      {/* Floating Dropdown Panel */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={MOTION_SPRINGS.tactilePress}
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FBF9F5] dark:bg-[#16120F] border border-black/[0.08] dark:border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.30)] p-4 z-50 text-left overflow-hidden"
          >
            {/* Header info */}
            <div className="flex items-start gap-3 pb-3 border-b border-black/[0.05] dark:border-white/[0.08]">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-xl object-cover border border-amber-600/40 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-amber-700 text-white font-mono text-sm flex items-center justify-center font-bold shrink-0">
                  {initials}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-[#1A1613] dark:text-[#F4EFEA] truncate">
                    {currentUser.name}
                  </h4>
                  <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 shrink-0">
                    Lvl {currentUser.level}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6E63] dark:text-[#A89C8F] truncate mt-0.5">
                  {currentUser.title || 'Scent Explorer'}
                </p>
                <p className="text-[10px] text-[#9A8D80] dark:text-[#786D62] truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* XP progress */}
            <div className="py-2.5 border-b border-black/[0.05] dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-[#6B5F54] dark:text-[#B5A99D]">
                <span>Atelier Experience</span>
                <span>{currentUser.xp} XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Accords preview */}
            {currentUser.signature_notes && currentUser.signature_notes.length > 0 && (
              <div className="py-2 border-b border-black/[0.05] dark:border-white/[0.08]">
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#8A7D70] dark:text-[#7A6F64] block mb-1">
                  Signature Accords
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentUser.signature_notes.map((note) => (
                    <span
                      key={note}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-black/[0.03] dark:bg-white/[0.05] text-[#4A3F36] dark:text-[#D1C7BB]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Navigation actions */}
            <div className="pt-2 space-y-1">
              {onNavigateToDna && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateToDna();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs text-[#3E352C] dark:text-[#E8E2D9] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition flex items-center gap-2 cursor-pointer"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Living Olfactory DNA Portrait</span>
                </button>
              )}

              {onNavigateToWardrobe && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateToWardrobe();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs text-[#3E352C] dark:text-[#E8E2D9] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>My Fragrance Vault</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenLogin();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs text-[#3E352C] dark:text-[#E8E2D9] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Account & Password Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 cursor-pointer pt-2 border-t border-black/[0.04] dark:border-white/[0.06]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Atelier</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
