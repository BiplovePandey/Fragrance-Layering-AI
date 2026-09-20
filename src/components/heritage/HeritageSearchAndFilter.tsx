import React from 'react';
import { Search, Filter, Sparkles, MapPin, Layers, BookOpen, Flame, Droplets } from 'lucide-react';

export type HeritageViewTab =
  | 'all'
  | 'map'
  | 'botanicals'
  | 'kannauj'
  | 'craft'
  | 'attars'
  | 'cabinet';

interface HeritageSearchAndFilterProps {
  activeTab: HeritageViewTab;
  onSelectTab: (tab: HeritageViewTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cabinetMatchesCount: number;
}

export const HeritageSearchAndFilter: React.FC<HeritageSearchAndFilterProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  cabinetMatchesCount
}) => {
  const tabs: { id: HeritageViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Archive', icon: Layers },
    { id: 'map', label: 'Olfactory Map', icon: MapPin },
    { id: 'botanicals', label: 'Botanicals', icon: BookOpen },
    { id: 'kannauj', label: 'Kannauj Workshop', icon: Flame },
    { id: 'craft', label: 'Craft & Stills', icon: Filter },
    { id: 'attars', label: 'Attars & Oils', icon: Droplets },
    { id: 'cabinet', label: `My Cabinet (${cabinetMatchesCount})`, icon: Sparkles }
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#1C1713] border border-[#3E3228]">
      {/* Secondary Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#B45309] text-white font-medium shadow-[0_2px_8px_rgba(180,83,9,0.4)]'
                  : 'text-[#A8988B] hover:text-[#FAF5F0] hover:bg-[#241B16]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Real-time Archival Search Bar */}
      <div className="relative min-w-[220px]">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7D70]" />
        <input
          type="text"
          placeholder="Search materials, regions, notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#241B16] text-xs text-[#FAF5F0] pl-8 pr-3 py-1.5 rounded-xl border border-[#3E3228] focus:outline-none focus:border-[#D97706] placeholder-[#8C7D70]"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono-lab text-[#8C7D70] hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
