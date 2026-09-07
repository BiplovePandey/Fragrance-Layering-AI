import React from 'react';
import { Home, Compass, Sparkles, Wine, User, Layers } from 'lucide-react';

export type MainTab = 'home' | 'explore' | 'layer' | 'collection' | 'profile';

interface AppBottomNavProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  savedCount: number;
  cabinetCount: number;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  cabinetCount
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0E6DD] px-3 py-2 shadow-lg sm:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Home */}
        <button
          id="bottom-nav-home"
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-[#7B3F98]' : 'text-[#786F6A] hover:text-[#292323]'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium leading-none">Home</span>
        </button>

        {/* Explore */}
        <button
          id="bottom-nav-explore"
          type="button"
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'explore' ? 'text-[#7B3F98]' : 'text-[#786F6A] hover:text-[#292323]'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium leading-none">Explore</span>
        </button>

        {/* Center Prominent Layer Button */}
        <div className="relative -top-5">
          <button
            id="bottom-nav-layer-center"
            type="button"
            onClick={() => setActiveTab('layer')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7B3F98] via-[#E86A92] to-[#F2A65A] text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-[#FFF9F3]"
          >
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </button>
          <span className="text-[9px] font-bold text-[#7B3F98] block text-center mt-1">
            Layer
          </span>
        </div>

        {/* Collection */}
        <button
          id="bottom-nav-collection"
          type="button"
          onClick={() => setActiveTab('collection')}
          className={`relative flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'collection' ? 'text-[#7B3F98]' : 'text-[#786F6A] hover:text-[#292323]'
          }`}
        >
          <Wine className={`w-5 h-5 ${activeTab === 'collection' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium leading-none">Collection</span>
          {cabinetCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#E86A92] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {cabinetCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          id="bottom-nav-profile"
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-[#7B3F98]' : 'text-[#786F6A] hover:text-[#292323]'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium leading-none">Profile</span>
        </button>
      </div>
    </div>
  );
};
