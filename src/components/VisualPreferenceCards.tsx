import React from 'react';
import { UserPreferences, Season, Occasion } from '../types.js';
import { Sparkles, Sun, CloudRain, Wind, Snowflake, Check, DollarSign, Globe, Award, Heart } from 'lucide-react';

interface VisualPreferenceCardsProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onInstantCalculate?: () => void;
  isLoading?: boolean;
}

interface BudgetOption {
  id: string;
  label: string;
  amount: number | null;
  tier: string;
  description: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  emoji: string;
}

const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'everyday',
    label: '₹500',
    amount: 800,
    tier: 'Everyday Ease',
    description: 'Pocket-friendly gems & authentic Kannauj attars',
    gradient: 'from-[#EBFBFA] to-[#D8F8EE]',
    borderColor: '#55BFA3',
    textColor: '#0F766E',
    emoji: '💚'
  },
  {
    id: 'explorer',
    label: '₹1,500',
    amount: 1800,
    tier: 'Curious Explorer',
    description: 'Quality indie brands, pure ruh oils & modern EDPs',
    gradient: 'from-[#F0F9FF] to-[#DCEEFB]',
    borderColor: '#74C0FC',
    textColor: '#0369A1',
    emoji: '💙'
  },
  {
    id: 'premium',
    label: '₹3,500',
    amount: 3800,
    tier: 'Niche Connoisseur',
    description: 'Artisanal Indian luxury & curated western blends',
    gradient: 'from-[#F9F3FC] to-[#E9D9F3]',
    borderColor: '#7B3F98',
    textColor: '#5B2186',
    emoji: '💜'
  },
  {
    id: 'luxury',
    label: '₹5,000+',
    amount: null,
    tier: 'Haute Parfumerie',
    description: 'Masterpiece extraits, vintage ouds & global luxury',
    gradient: 'from-[#FFF7ED] to-[#FFE8D1]',
    borderColor: '#F2A65A',
    textColor: '#9A3412',
    emoji: '🧡'
  }
];

interface SeasonOption {
  id: Season;
  title: string;
  emoji: string;
  vibe: string;
  notes: string;
  gradient: string;
  accent: string;
}

const SEASON_OPTIONS: SeasonOption[] = [
  {
    id: 'Summer',
    title: 'Summer Sunlight',
    emoji: '☀️',
    vibe: 'Crisp, Airy & Cooling',
    notes: 'Citrus, Mint, Neroli, Aquatic Sea Salt',
    gradient: 'from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/40',
    accent: '#D97706'
  },
  {
    id: 'Monsoon',
    title: 'Monsoon Rain',
    emoji: '🌧️',
    vibe: 'Earthy, Petrichor & Calm',
    notes: 'Mitti Attar, Wild Khus, Damp Woods, Green Leaves',
    gradient: 'from-[#EBFBFA] via-[#D8F8EE] to-[#CCFBF1]',
    accent: '#0F766E'
  },
  {
    id: 'Fall',
    title: 'Autumn Twilight',
    emoji: '🍂',
    vibe: 'Warm, Resinous & Cozy',
    notes: 'Toasted Spices, Sandalwood, Cardamom, Amber',
    gradient: 'from-[#FFF7ED] via-[#FFE8D1] to-[#FED7AA]/40',
    accent: '#EA580C'
  },
  {
    id: 'Winter',
    title: 'Winter Radiance',
    emoji: '❄️',
    vibe: 'Deep, Sultry & Opulent',
    notes: 'Aged Assam Oud, Bourbon Vanilla, Smoked Resins',
    gradient: 'from-[#F9F3FC] via-[#E9D9F3] to-[#DDD6FE]/40',
    accent: '#7B3F98'
  }
];

interface OccasionOption {
  id: Occasion;
  emoji: string;
  label: string;
}

const OCCASION_OPTIONS: OccasionOption[] = [
  { id: 'Casual', emoji: '☕', label: 'Casual Day' },
  { id: 'Office', emoji: '💼', label: 'Office & Focus' },
  { id: 'Date', emoji: '❤️', label: 'Intimate Date' },
  { id: 'Special Event', emoji: '💃', label: 'Evening Party' },
  { id: 'Wedding', emoji: '💍', label: 'Festive & Wedding' },
  { id: 'Signature', emoji: '✨', label: 'Signature Daily' }
];

export const VisualPreferenceCards: React.FC<VisualPreferenceCardsProps> = ({
  preferences,
  setPreferences,
  onInstantCalculate,
  isLoading
}) => {
  return (
    <div id="visual-preferences-section" className="space-y-8 bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 shadow-xs">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E6DD] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4EE] text-[#991B4C] text-[11px] font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E86A92]" />
            <span>Interactive Profiler</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292323]">
            Curate Your Layering Canvas
          </h3>
          <p className="text-xs text-[#786F6A]">
            Select your season, setting, and budget. Our ML engine matches complementary accords in real-time.
          </p>
        </div>

        {onInstantCalculate && (
          <button
            id="calculate-layering-top-btn"
            type="button"
            onClick={onInstantCalculate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B3F98] via-[#E86A92] to-[#F2A65A] hover:opacity-95 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isLoading ? 'Composing...' : 'Calculate Layer Pairs'}</span>
          </button>
        )}
      </div>

      {/* 1. Visual Season Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#292323]">
          1. Season &amp; Weather Atmosphere
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {SEASON_OPTIONS.map((season) => {
            const isSelected = preferences.season === season.id;
            return (
              <button
                key={season.id}
                id={`season-opt-${season.id.toLowerCase()}`}
                type="button"
                onClick={() => setPreferences(prev => ({ ...prev, season: season.id }))}
                className={`group p-4 rounded-2xl border text-left flex flex-col justify-between h-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-md scale-[1.02] ring-2'
                    : 'bg-stone-50/70 hover:bg-white hover:shadow-xs border-stone-200/80'
                }`}
                style={{
                  borderColor: isSelected ? season.accent : undefined,
                  boxShadow: isSelected ? `0 0 0 2px ${season.accent}40, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` : undefined
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{season.emoji}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: season.accent }}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#292323]">
                      {season.title}
                    </h4>
                    <p className="text-[11px] text-[#786F6A] font-medium">
                      {season.vibe}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 text-[10px] text-stone-500 line-clamp-1">
                  Chords: {season.notes}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Visual Occasion Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#292323]">
          2. Destination &amp; Occasion
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 items-stretch">
          {OCCASION_OPTIONS.map((occ) => {
            const isSelected = preferences.occasion === occ.id;
            return (
              <button
                key={occ.id}
                id={`occasion-opt-${occ.id.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => setPreferences(prev => ({ ...prev, occasion: occ.id }))}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#7B3F98] text-white border-[#7B3F98] shadow-sm font-semibold scale-105'
                    : 'bg-stone-50 hover:bg-stone-100/80 text-[#292323] border-stone-200'
                }`}
              >
                <span className="text-2xl">{occ.emoji}</span>
                <span className="text-xs">{occ.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Visual Budget Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#292323]">
          3. Budget Tier
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {BUDGET_OPTIONS.map((budget) => {
            const isSelected = preferences.max_budget === budget.amount;
            return (
              <button
                key={budget.id}
                id={`budget-opt-${budget.id}`}
                type="button"
                onClick={() => setPreferences(prev => ({ ...prev, max_budget: budget.amount }))}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-md scale-[1.02] ring-2'
                    : 'bg-stone-50/60 hover:bg-white border-stone-200'
                }`}
                style={{
                  borderColor: isSelected ? budget.borderColor : undefined,
                  boxShadow: isSelected ? `0 0 0 2px ${budget.borderColor}40, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` : undefined
                }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif font-bold" style={{ color: budget.textColor }}>
                      {budget.label}
                    </span>
                    <span className="text-lg">{budget.emoji}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[#292323]">
                    {budget.tier}
                  </h4>
                  <p className="text-[11px] text-[#786F6A] leading-snug">
                    {budget.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-stone-400">Filter Limit</span>
                  <span className="font-semibold text-stone-700">
                    {budget.amount ? `Up to ₹${budget.amount}` : 'All Price Ranges'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Origin & Perfumery Heritage Choice */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#292323]">
          4. Perfumery Heritage &amp; Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
          <button
            type="button"
            onClick={() => setPreferences(prev => ({ ...prev, origin_filter: 'all', format_filter: 'all' }))}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              preferences.origin_filter === 'all'
                ? 'bg-[#FAF6F0] border-[#B58A58] shadow-xs'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
              ✨
            </div>
            <div>
              <div className="text-xs font-bold text-[#292323]">Global &amp; Indian Fusion</div>
              <div className="text-[11px] text-[#786F6A]">Combine Indian botanical attars with French &amp; niche sprays</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreferences(prev => ({ ...prev, origin_filter: 'indian', format_filter: 'all' }))}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              preferences.origin_filter === 'indian'
                ? 'bg-[#FCECE4] border-[#D95D39] shadow-xs'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center text-xl shrink-0">
              🇮🇳
            </div>
            <div>
              <div className="text-xs font-bold text-[#292323]">Pure Indian Heritage</div>
              <div className="text-[11px] text-[#786F6A]">Strictly artisanal Indian houses, pure ruh oils &amp; Kannauj stills</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreferences(prev => ({ ...prev, origin_filter: 'international', format_filter: 'all' }))}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              preferences.origin_filter === 'international'
                ? 'bg-[#EBFBFA] border-[#55BFA3] shadow-xs'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl shrink-0">
              🌎
            </div>
            <div>
              <div className="text-xs font-bold text-[#292323]">International Niche</div>
              <div className="text-[11px] text-[#786F6A]">Western eau de parfums, Grasse florals &amp; modern niche</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
