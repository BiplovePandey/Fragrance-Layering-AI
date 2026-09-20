import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  Thermometer,
  ShieldAlert,
  Flame,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';
import { EmptyState } from '../ui/EmptyState.js';

export interface SocietyJournalItem {
  id: string;
  fragrance_id: number;
  fragrance_name: string;
  brand: string;
  author_name: string;
  author_badge?: string;
  occasion: string;
  worn_date: string;
  longevity_hours: number;
  compliments_count: number;
  weather_temp: number;
  weather_humidity: number;
  notes: string;
  mood?: string;
  category?: 'first_impression' | 'todays_wear' | 'drydown_diary' | 'layering_note';
  likes?: number;
  has_liked?: boolean;
}

interface SocietyScentJournalProps {
  entries: any[];
  isLoading: boolean;
  allFragrances: Fragrance[];
  weather: WeatherCondition;
  onOpenComposer: () => void;
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLab?: (fragA: Fragrance, fragB?: Fragrance) => void;
  onOpenComments: (targetId: string, title: string) => void;
  onShareItem: (title: string, note: string) => void;
}

export const SocietyScentJournal: React.FC<SocietyScentJournalProps> = ({
  entries,
  isLoading,
  allFragrances,
  weather,
  onOpenComposer,
  onInspectInChamber,
  onSendToLab,
  onOpenComments,
  onShareItem,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [likedEntries, setLikedEntries] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('society_liked_journals');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [savedEntries, setSavedEntries] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('society_saved_journals');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleLike = (id: string) => {
    setLikedEntries((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('society_liked_journals', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleSave = (id: string) => {
    setSavedEntries((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('society_saved_journals', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Convert raw DB journal entries into rich Society Journal Items
  const enrichedEntries: SocietyJournalItem[] = entries.map((entry, index) => {
    const matchedFrag = allFragrances.find((f) => f.id === entry.fragrance_id);
    return {
      id: String(entry.id || `entry-${index}`),
      fragrance_id: entry.fragrance_id,
      fragrance_name: entry.fragrance_name || matchedFrag?.name || 'Selected Scent',
      brand: entry.brand || matchedFrag?.brand_name || matchedFrag?.brand || 'Artisanal House',
      author_name: entry.author_name || (index % 2 === 0 ? 'Elena Perfumista' : 'Aarav Nose'),
      author_badge: index % 2 === 0 ? '🌿' : '🧪',
      occasion: entry.occasion || 'Evening Wear',
      worn_date: entry.worn_date || new Date().toISOString(),
      longevity_hours: entry.longevity_hours ?? 8,
      compliments_count: entry.compliments_count ?? 2,
      weather_temp: entry.weather_temp ?? weather.temperature_c,
      weather_humidity: entry.weather_humidity ?? weather.humidity_pct,
      notes: entry.notes || 'Intricate evolution from radiant top notes to warm balsamic drydown.',
      category: entry.occasion?.toLowerCase().includes('office') ? 'todays_wear' : 'drydown_diary',
      likes: 12 + (index * 7) % 23,
      has_liked: likedEntries[String(entry.id || `entry-${index}`)] || false,
    };
  });

  const filtered = enrichedEntries.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'saved') return savedEntries[item.id];
    return item.category === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-amber-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chapter II • Collector's Journal</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
            Scent Journal Entries
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1 font-sans">
            Personal wear notes, drydown diaries, and skin-chemistry performance logs recorded under real microclimates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenComposer}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-stone-950 font-semibold text-xs tracking-wider font-brand uppercase shadow-md shadow-amber-900/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Today's Wear</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono-lab">
        {[
          { id: 'all', label: `All Entries (${enrichedEntries.length})` },
          { id: 'todays_wear', label: "Today's Wear" },
          { id: 'drydown_diary', label: 'Drydown Diaries' },
          { id: 'saved', label: 'Bookmarked' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              filterType === tab.id
                ? 'bg-amber-900/10 text-amber-900 border-amber-500/40 font-semibold'
                : 'bg-white/60 text-[#7A6F66] border-[#E3DACB] hover:text-[#1A1613]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Journal Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono-lab text-[#7A6F66] rounded-3xl bg-white/70 border border-[#E3DACB]">
          Retrieving Society journal scrolls...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="The Journal is Quiet"
          description={
            filterType === 'saved'
              ? 'You have not bookmarked any journal entries yet. Tap the bookmark ribbon on any entry to preserve it.'
              : 'Be the first to record how a fragrance unfolds on your skin.'
          }
          actionLabel="Record Journal Entry"
          onAction={onOpenComposer}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((entry) => {
            const matchedFrag = allFragrances.find((f) => f.id === entry.fragrance_id);
            const isLiked = likedEntries[entry.id];
            const isSaved = savedEntries[entry.id];
            const displayLikes = (entry.likes || 14) + (isLiked ? 1 : 0);

            return (
              <div
                key={entry.id}
                className="rounded-3xl bg-[#14110E] border border-amber-500/20 p-6 text-[#F8F5EE] shadow-xl flex flex-col justify-between group transition hover:border-amber-500/40"
              >
                <div>
                  {/* Top Calling Card: Author & Date */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{entry.author_badge || '✒️'}</span>
                      <div>
                        <span className="font-serif text-sm font-medium text-amber-200 block leading-tight">
                          {entry.author_name}
                        </span>
                        <span className="text-[10px] font-mono-lab text-stone-400">
                          {entry.occasion}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-lab text-stone-400 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                      {new Date(entry.worn_date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Hero Fragrance Duo / Single Bottle View */}
                  <div className="flex items-start gap-4 my-4">
                    <div className="shrink-0 p-1 rounded-2xl bg-black/40 border border-white/[0.08]">
                      <ScentBottle
                        name={entry.fragrance_name}
                        brand={entry.brand}
                        family={matchedFrag?.fragrance_family}
                        size="sm"
                        showAura={false}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-amber-400/90">
                        {matchedFrag?.fragrance_family || 'Fine Extrait'}
                      </span>
                      <h3 className="font-serif text-xl font-medium text-[#F8F5EE] group-hover:text-amber-300 transition">
                        {entry.fragrance_name}
                      </h3>
                      <p className="text-xs text-stone-400">
                        by {entry.brand}
                      </p>
                      {matchedFrag?.top_notes && (
                        <p className="text-[11px] font-mono-lab text-stone-400 pt-1">
                          Notes: {matchedFrag.top_notes.slice(0, 2).join(', ')} → {matchedFrag.base_notes?.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Personal Sensory Note */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-stone-300 leading-relaxed font-serif italic">
                    &ldquo;{entry.notes}&rdquo;
                  </div>

                  {/* Context Telemetry: Weather & Skin Performance */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-mono-lab">
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-stone-400 block">Longevity</span>
                      <span className="text-amber-300 font-semibold">{entry.longevity_hours} hrs</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-stone-400 block">Compliments</span>
                      <span className="text-amber-300 font-semibold">{entry.compliments_count}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-stone-400 block">Ambient</span>
                      <span className="text-stone-300 font-semibold">{entry.weather_temp}°C</span>
                    </div>
                  </div>

                  {/* Scientific Honesty Notice */}
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-lab text-stone-400/80">
                    <ShieldAlert className="w-3 h-3 text-amber-500/60" />
                    <span>Personal skin observation under {entry.weather_humidity}% relative humidity</span>
                  </div>
                </div>

                {/* Subordinate Social Controls & Deep Links */}
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  {/* Subtle aged brass actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleLike(entry.id)}
                      aria-label="Resonate with note"
                      className={`flex items-center gap-1 text-xs transition cursor-pointer ${
                        isLiked ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-amber-300'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-amber-400 text-amber-400' : 'text-stone-400'
                        }`}
                      />
                      <span className="font-mono-lab text-[11px]">{displayLikes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenComments(
                          entry.id,
                          `${entry.fragrance_name} — Journal Note`
                        )
                      }
                      aria-label="Salon reflection comments"
                      className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-mono-lab text-[11px]">Reflect</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSave(entry.id)}
                      aria-label="Bookmark entry"
                      className={`p-1 text-xs transition cursor-pointer ${
                        isSaved ? 'text-amber-400' : 'text-stone-400 hover:text-amber-300'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onShareItem(
                          `${entry.fragrance_name} by ${entry.brand}`,
                          entry.notes
                        )
                      }
                      aria-label="Share journal citation"
                      className="p-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Atelier Exploration Links */}
                  <div className="flex items-center gap-2">
                    {matchedFrag && onInspectInChamber && (
                      <button
                        type="button"
                        onClick={() => onInspectInChamber(matchedFrag)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono-lab border border-amber-500/20 transition cursor-pointer"
                      >
                        Chamber
                      </button>
                    )}
                    {matchedFrag && onSendToLab && (
                      <button
                        type="button"
                        onClick={() => onSendToLab(matchedFrag)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-mono-lab border border-amber-500/30 transition cursor-pointer"
                      >
                        Layer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
