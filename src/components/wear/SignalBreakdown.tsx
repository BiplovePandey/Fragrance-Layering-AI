import React from 'react';
import { Sparkles, CloudSun, Calendar, Briefcase, Heart, Clock, ShieldCheck } from 'lucide-react';
import { WearRecommendationMatchBreakdown } from '../../types.js';

interface SignalBreakdownProps {
  match: WearRecommendationMatchBreakdown;
  score: number;
}

export const SignalBreakdown: React.FC<SignalBreakdownProps> = ({ match, score }) => {
  const signals: { key: keyof WearRecommendationMatchBreakdown; label: string; icon: React.ComponentType<{ className?: string }>; value?: number; desc: string }[] = [
    {
      key: 'preference',
      label: 'Preference DNA',
      icon: Sparkles,
      value: match.preference,
      desc: 'Harmony with your personal 8D fragrance vector and note preferences'
    },
    {
      key: 'weather',
      label: 'Atmospheric Fit',
      icon: CloudSun,
      value: match.weather,
      desc: 'Evaporation balance with ambient temperature & humidity moisture retention'
    },
    {
      key: 'season',
      label: 'Seasonal Harmony',
      icon: Calendar,
      value: match.season,
      desc: 'Climatic resonance with the current astronomical season'
    },
    {
      key: 'occasion',
      label: 'Occasion Alignment',
      icon: Briefcase,
      value: match.occasion,
      desc: 'Social setting, formality, and venue appropriateness'
    },
    {
      key: 'mood',
      label: 'Mood Resonance',
      icon: Heart,
      value: match.mood,
      desc: 'Aura alignment with your emotional mindset or psychological archetype'
    },
    {
      key: 'timeOfDay',
      label: 'Diurnal Harmony',
      icon: Clock,
      value: match.timeOfDay,
      desc: 'Natural opening-to-drydown curve matching morning, day, or night cycles'
    },
    {
      key: 'performance',
      label: 'Performance Endurance',
      icon: ShieldCheck,
      value: match.performance,
      desc: 'Longevity and projection stamina suited for venue expectations'
    }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-2.5">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1613] flex items-center gap-1.5">
            <span>Atmospheric &amp; Context Signal Breakdown</span>
          </h4>
          <p className="text-[11px] text-[#7A6F66] mt-0.5">
            Contextual compatibility reflects environmental and situational harmony today, not absolute perfume quality.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono-lab uppercase text-[#7A6F66] block">Aggregate Fit</span>
          <span className="text-sm font-mono-lab font-bold text-amber-900">{score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {signals.map((sig) => {
          const Icon = sig.icon;
          const val = sig.value !== undefined ? Math.round(sig.value) : null;
          if (val === null) return null;

          return (
            <div key={sig.key} className="p-3 rounded-xl bg-white/80 border border-white/90 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-xs font-semibold text-[#1A1613]">{sig.label}</span>
                </div>
                <span className="text-xs font-mono-lab font-bold text-amber-900">{val}%</span>
              </div>

              {/* Segmented Meter */}
              <div className="w-full bg-[#EDE6DC] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                />
              </div>

              <p className="text-[10px] text-[#7A6F66] leading-tight">
                {sig.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
