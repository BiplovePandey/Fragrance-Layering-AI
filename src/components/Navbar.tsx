import React from 'react';
import { Sparkles, Bookmark, Wine, Compass, User, Layers, Home, Search } from 'lucide-react';

export type MainNavTab = 'home' | 'explore' | 'layer' | 'collection' | 'profile';

interface NavbarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  savedCount: number;
  cabinetCount: number;
  onReplayOpening?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  cabinetCount,
  onReplayOpening
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#F0E6DD] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Name */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7B3F98] to-[#E86A92] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl tracking-tight font-medium text-[#292323] leading-tight">
                  Scently
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#FFE4EE] text-[#991B4C] rounded-full font-bold border border-[#F8B4CB] shrink-0">
                  Scent Universe
                </span>
              </div>
              <p className="text-[10px] text-[#786F6A] font-sans tracking-wide mt-0.5 hidden sm:block">
                Harmonic Olfactory Layering &bull; Indian &amp; Global Perfumery
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1.5 py-0.5">
            <button
              id="nav-home-btn"
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-[#7B3F98] shadow-xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323] hover:bg-stone-100/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              id="nav-explore-btn"
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white text-[#7B3F98] shadow-xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323] hover:bg-stone-100/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Notes</span>
            </button>

            <button
              id="nav-layer-btn"
              type="button"
              onClick={() => setActiveTab('layer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'layer'
                  ? 'bg-gradient-to-r from-[#7B3F98] to-[#E86A92] text-white shadow-xs'
                  : 'bg-white text-[#7B3F98] border border-[#E9D9F3] hover:bg-[#F9F3FC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Layering Studio</span>
            </button>

            <button
              id="nav-collection-btn"
              type="button"
              onClick={() => setActiveTab('collection')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'collection'
                  ? 'bg-white text-[#7B3F98] shadow-xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323] hover:bg-stone-100/50'
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>Collection</span>
              {(cabinetCount > 0 || savedCount > 0) && (
                <span className="min-w-4.5 h-4.5 px-1.5 inline-flex items-center justify-center text-[10px] font-bold bg-[#E86A92] text-white rounded-full leading-none shrink-0">
                  {cabinetCount + savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-profile-btn"
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-[#7B3F98] shadow-xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323] hover:bg-stone-100/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Scent Profile</span>
            </button>
          </nav>

          {/* Right Action (Story Opening Replay) */}
          <div className="flex items-center gap-2">
            {onReplayOpening && (
              <button
                id="nav-replay-story-btn"
                type="button"
                onClick={onReplayOpening}
                title="Replay The First Impression Story"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif italic text-[#90331A] bg-[#FCE3D8] hover:bg-[#FAD4C0] border border-[#F4B097] transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D95D39] shrink-0" />
                <span>Story Intro</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
