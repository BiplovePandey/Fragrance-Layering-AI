import React from 'react';
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Share2,
  Sparkles,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';
import { HERITAGE_ENTRIES } from '../../data/heritageAtlas.js';

interface HeritageConversationThread {
  id: string;
  heritageId: string;
  heritageName: string;
  hindiName: string;
  region: string;
  author: string;
  authorBadge: string;
  userReflection: string;
  verifiedFact: string;
  timestamp: string;
}

interface SocietyHeritageConversationsProps {
  onExploreHeritageSpecimen?: (specimenId: string) => void;
  onNavigateToAtlas?: () => void;
  onOpenComments: (targetId: string, title: string) => void;
  onShareItem: (title: string, note: string) => void;
}

export const SocietyHeritageConversations: React.FC<SocietyHeritageConversationsProps> = ({
  onExploreHeritageSpecimen,
  onNavigateToAtlas,
  onOpenComments,
  onShareItem,
}) => {
  const threads: HeritageConversationThread[] = [
    {
      id: 'thread-kannauj-mitti',
      heritageId: 'kannauj-mitti-attar',
      heritageName: 'Kannauj Mitti Attar',
      hindiName: 'मिट्टी का अत्तर (Baked Earth)',
      region: 'Kannauj, Uttar Pradesh',
      author: 'Vikram S.',
      authorBadge: '🏛️',
      userReflection:
        'When the pre-monsoon heat reached 42°C in Delhi, applying a tiny drop of traditional Mitti Attar to my wrists instantly centered my focus. The scent of baked alluvial clay breaking under water felt almost restorative.',
      verifiedFact:
        'Hydro-distilled using 400-year-old Deg & Bhapka copper stills, condensing sun-dried clay steam directly into base sandalwood oil over 15–20 days. GI Tag registered.',
      timestamp: 'Yesterday',
    },
    {
      id: 'thread-wild-ruh-khus',
      heritageId: 'wild-ruh-khus',
      heritageName: 'Wild Ruh Khus',
      hindiName: 'रूह खस (Wild Indian Vetiver)',
      region: 'Bharatpur & Kannauj riverbeds',
      author: 'Ananya R.',
      authorBadge: '🌿',
      userReflection:
        'In Mumbai humidity, Bourbon vetiver can turn sour on my skin within 3 hours. Pure green Ruh Khus remains crisp, rooty, and shockingly cool even after 10 hours in the rain.',
      verifiedFact:
        'Vedic hydro-distillation of wild riverbed roots yielding natural emerald-green essential oil with natural Pitta-cooling properties cited in classical Ayurvedic texts.',
      timestamp: '3 days ago',
    },
    {
      id: 'thread-mysore-sandalwood',
      heritageId: 'mysore-sandalwood',
      heritageName: 'Mysore Sandalwood & Kashmiri Nargis',
      hindiName: 'मैसूर चंदन (Santalum Album)',
      region: 'Mysore, Karnataka & Kashmir Valley',
      author: 'Elena Perfumista',
      authorBadge: '✨',
      userReflection:
        'Layering fragile Kashmiri narcissus water with aged Mysore sandalwood created an almost imperial aura. The sandalwood heartwood kept the white floral petals radiant until dusk.',
      verifiedFact:
        'Santalum album heartwood yields high santalol concentrations renowned globally for its velvety tenacity and spiritual anchor qualities.',
      timestamp: '5 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-emerald-400">
            <Landmark className="w-3.5 h-3.5" />
            <span>Chapter VI • Heritage Conversations</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
            Living Botanical Heritage Threads
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1 font-sans">
            Conversations bridging personal contemporary wears with India&apos;s 5,000-year living perfumery legacy.
          </p>
        </div>

        {onNavigateToAtlas && (
          <button
            type="button"
            onClick={onNavigateToAtlas}
            className="px-4 py-2 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-600/30 text-emerald-900 font-semibold text-xs tracking-wider font-brand uppercase transition cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Enter Heritage Atlas</span>
          </button>
        )}
      </div>

      {/* Threads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {threads.map((thread) => {
          return (
            <div
              key={thread.id}
              className="rounded-3xl bg-[#14110E] border border-amber-500/20 p-6 sm:p-7 text-[#F8F5EE] shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition"
            >
              <div className="space-y-4">
                {/* Author Calling Card */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{thread.authorBadge}</span>
                    <div>
                      <span className="font-serif text-sm font-medium text-amber-200 block leading-tight">
                        {thread.author}
                      </span>
                      <span className="text-[10px] font-mono-lab text-stone-400">
                        {thread.region}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-lab text-stone-400">
                    {thread.timestamp}
                  </span>
                </div>

                {/* Heritage Thread Tag */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] font-brand uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{thread.region}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-medium text-[#F8F5EE] group-hover:text-emerald-300 transition mt-1">
                    {thread.heritageName}
                  </h3>
                  <p className="text-xs text-emerald-400/80 font-mono-lab">
                    {thread.hindiName}
                  </p>
                </div>

                {/* User Impression Box */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                  <span className="text-[9px] font-mono-lab uppercase text-stone-400 tracking-wider block">
                    Connoisseur Scent Impression
                  </span>
                  <p className="text-xs text-stone-300 italic font-serif leading-relaxed">
                    &ldquo;{thread.userReflection}&rdquo;
                  </p>
                </div>

                {/* Scientific & Historical Honesty: Verified Archival Record */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-brand tracking-wider uppercase text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Archival Record</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
                    {thread.verifiedFact}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenComments(thread.id, `${thread.heritageName} — Heritage Thread`)
                    }
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono-lab text-[11px]">Discuss</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onShareItem(
                        `Heritage Note: ${thread.heritageName}`,
                        `${thread.userReflection}\n\nArchival Record: ${thread.verifiedFact}`
                      )
                    }
                    className="p-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {onNavigateToAtlas && (
                  <button
                    type="button"
                    onClick={onNavigateToAtlas}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>View in Atlas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
