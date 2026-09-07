import React from 'react';
import { UserPreferences, Fragrance } from '../types.js';
import { Sun, Calendar, Clock, Sparkles, Sliders, ShieldCheck, Flame, Compass } from 'lucide-react';

interface PreferenceFormProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  fragrances: Fragrance[];
  onSubmitLayering: () => void;
  isLoading: boolean;
  onReset: () => void;
}

const SEASONS: Array<'Spring' | 'Summer' | 'Monsoon' | 'Fall' | 'Winter'> = [
  'Spring', 'Summer', 'Monsoon', 'Fall', 'Winter'
];
const OCCASIONS: Array<'Office' | 'Date' | 'Casual' | 'Evening' | 'Signature' | 'Special Event' | 'Wedding' | 'Festive / Puja' | 'Meditation / Spiritual'> = [
  'Office', 'Date', 'Casual', 'Evening', 'Signature', 'Special Event', 'Wedding', 'Festive / Puja', 'Meditation / Spiritual'
];
const TIMES_OF_DAY: Array<'Day' | 'Evening' | 'Night' | 'Any'> = ['Day', 'Evening', 'Night', 'Any'];

const FAMILIES = [
  'Woody Aromatic',
  'Amber Vanilla',
  'Citrus Floral',
  'Aromatic Fougère',
  'Floral Fruity',
  'Amber Spicy',
  'Aromatic Aquatic',
  'Chypre Fruity',
  'Earthy Clay / Petrichor',
  'Sacred Wood & Resins',
  'Traditional Attar Compound'
];

const NOTE_OPTIONS = [
  'Bergamot', 'Vanilla', 'Sandalwood', 'Cardamom', 'Rose', 'Iris',
  'Tonka Bean', 'Cedar', 'Ambergris', 'Lavender', 'Jasmine', 'Pink Pepper',
  'Mitti (Baked Earth)', 'Ruh Khus', 'Mogra / Bela', 'Shamama', 'Kewra', 'Saffron / Kesar', 'Dehn al Oud'
];

export const PreferenceForm: React.FC<PreferenceFormProps> = ({
  preferences,
  setPreferences,
  fragrances,
  onSubmitLayering,
  isLoading,
  onReset
}) => {
  const getSweetnessLabel = (val: number) => {
    if (val <= 2) return 'Bone-Dry / Crisp Wood';
    if (val <= 4) return 'Subtle Warmth';
    if (val <= 6) return 'Balanced Honeyed Touch';
    if (val <= 8) return 'Rich Tonka & Amber';
    return 'Decadent Bourbon Gourmand';
  };

  const getFreshnessLabel = (val: number) => {
    if (val <= 2) return 'Smoky & Resinous';
    if (val <= 4) return 'Soft Earthy Balsam';
    if (val <= 6) return 'Balanced Aromatic Lift';
    if (val <= 8) return 'Dewy Citrus & Herbs';
    return 'Effervescent Marine Solar';
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 3) return 'Intimate Skin Aura';
    if (val <= 6) return 'Moderate Elegant Sillage';
    if (val <= 8) return 'Bold & Radiating Presence';
    return 'Heady Room-Filling Projection';
  };

  const toggleFamily = (fam: string) => {
    const current = preferences.favorite_family || [];
    if (current.includes(fam)) {
      setPreferences(prev => ({
        ...prev,
        favorite_family: current.filter(f => f !== fam)
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        favorite_family: [...current, fam]
      }));
    }
  };

  const toggleNote = (note: string) => {
    const current = preferences.preferred_notes || [];
    if (current.includes(note)) {
      setPreferences(prev => ({
        ...prev,
        preferred_notes: current.filter(n => n !== note)
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        preferred_notes: [...current, note]
      }));
    }
  };

  return (
    <div id="preference-form-container" className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium tracking-tight">
            Olfactory Profile & Context
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Define your sensory coordinates. The algorithm computes multi-dimensional vector matches and complementary chords.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs uppercase tracking-wider font-semibold text-stone-400 hover:text-stone-700 transition-colors self-start sm:self-auto"
        >
          Reset Defaults
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitLayering();
        }}
        className="space-y-8 mt-6"
      >
        {/* Sliders: Sweetness, Freshness, Intensity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50/80 p-5 rounded-xl border border-stone-200/70 items-stretch">
          {/* Sweetness */}
          <div className="flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between h-5">
              <label htmlFor="sweetness-slider" className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Sweetness Level</span>
              </label>
              <span className="text-sm font-bold text-stone-900 font-mono">
                {preferences.sweetness}/10
              </span>
            </div>
            <input
              id="sweetness-slider"
              type="range"
              min={1}
              max={10}
              step={1}
              value={preferences.sweetness}
              onChange={(e) => setPreferences(prev => ({ ...prev, sweetness: Number(e.target.value) }))}
              className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer my-1"
            />
            <div className="h-5 flex items-center">
              <p className="text-xs text-amber-900/80 font-medium">
                {getSweetnessLabel(preferences.sweetness)}
              </p>
            </div>
          </div>

          {/* Freshness */}
          <div className="flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between h-5">
              <label htmlFor="freshness-slider" className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>Freshness Level</span>
              </label>
              <span className="text-sm font-bold text-stone-900 font-mono">
                {preferences.freshness}/10
              </span>
            </div>
            <input
              id="freshness-slider"
              type="range"
              min={1}
              max={10}
              step={1}
              value={preferences.freshness}
              onChange={(e) => setPreferences(prev => ({ ...prev, freshness: Number(e.target.value) }))}
              className="w-full accent-sky-600 h-2 bg-stone-200 rounded-lg cursor-pointer my-1"
            />
            <div className="h-5 flex items-center">
              <p className="text-xs text-sky-900/80 font-medium">
                {getFreshnessLabel(preferences.freshness)}
              </p>
            </div>
          </div>

          {/* Intensity */}
          <div className="flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between h-5">
              <label htmlFor="intensity-slider" className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span>Desired Intensity</span>
              </label>
              <span className="text-sm font-bold text-stone-900 font-mono">
                {preferences.intensity}/10
              </span>
            </div>
            <input
              id="intensity-slider"
              type="range"
              min={1}
              max={10}
              step={1}
              value={preferences.intensity}
              onChange={(e) => setPreferences(prev => ({ ...prev, intensity: Number(e.target.value) }))}
              className="w-full accent-stone-800 h-2 bg-stone-200 rounded-lg cursor-pointer my-1"
            />
            <div className="h-5 flex items-center">
              <p className="text-xs text-stone-600 font-medium">
                {getIntensityLabel(preferences.intensity)}
              </p>
            </div>
          </div>
        </div>

        {/* Context Controls: Season, Occasion, Time, Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          {/* Season */}
          <div className="space-y-1.5">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Target Season</span>
            </label>
            <select
              id="season-select"
              value={preferences.season || 'Summer'}
              onChange={(e) => setPreferences(prev => ({ ...prev, season: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {SEASONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Occasion */}
          <div className="space-y-1.5">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Wearing Occasion</span>
            </label>
            <select
              id="occasion-select"
              value={preferences.occasion || 'Date'}
              onChange={(e) => setPreferences(prev => ({ ...prev, occasion: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {OCCASIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Time of Day */}
          <div className="space-y-1.5">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Time of Day</span>
            </label>
            <select
              id="time-select"
              value={preferences.time_of_day || 'Evening'}
              onChange={(e) => setPreferences(prev => ({ ...prev, time_of_day: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {TIMES_OF_DAY.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-1.5">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Gender Expression</span>
            </label>
            <select
              id="gender-select"
              value={preferences.preferred_gender || 'all'}
              onChange={(e) => setPreferences(prev => ({ ...prev, preferred_gender: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Styles / Universal</option>
              <option value="unisex">Unisex Niche Focus</option>
              <option value="masculine">Masculine Leaning</option>
              <option value="feminine">Feminine Leaning</option>
            </select>
          </div>

          {/* Origin Tradition Filter */}
          <div className="space-y-1.5">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Perfumery Origin &amp; Style</span>
            </label>
            <select
              id="origin-filter-select"
              value={preferences.origin_filter || 'all'}
              onChange={(e) => setPreferences(prev => ({ ...prev, origin_filter: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Houses (Global Agnostic)</option>
              <option value="fusion">Cross-Origin Fusion (East meets West)</option>
              <option value="indian">Indian Heritage &amp; Attars Only</option>
              <option value="international">Western / International Only</option>
            </select>
          </div>

          {/* Fragrance Format Filter */}
          <div className="space-y-1.5">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Format &amp; Medium</span>
            </label>
            <select
              id="format-filter-select"
              value={preferences.format_filter || 'all'}
              onChange={(e) => setPreferences(prev => ({ ...prev, format_filter: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Formats (Sprays &amp; Pure Oils)</option>
              <option value="attar">Attars &amp; Concentrated Oils Only</option>
              <option value="edp">Sprays Only (EDP / Extrait)</option>
            </select>
          </div>

          {/* Brand Category Filter */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <label className="h-5 text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Curated House Category</span>
            </label>
            <select
              id="brand-category-filter-select"
              value={preferences.brand_category_filter || 'all'}
              onChange={(e) => setPreferences(prev => ({ ...prev, brand_category_filter: e.target.value as any }))}
              className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Categories (Agnostic Discovery)</option>
              <option value="Indian niche">🧴 Indian Niche / Contemporary (Bombay Perfumery, Naso, Kastoor...)</option>
              <option value="Attar">🏺 Traditional Attar &amp; Heritage Houses (Gulabsingh Johrimal, M.L. Ramnarain...)</option>
              <option value="Designer / mass Indian">🇮🇳 Designer &amp; Homegrown Indian (SKINN by Titan, Forest Essentials, Bella Vita...)</option>
              <option value="International luxury">🌍 International Benchmarks &amp; Niche (Creed, MFK, Tom Ford, Diptyque...)</option>
            </select>
          </div>
        </div>

        {/* Owned Fragrance Layering Anchor (Optional) */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Optional: Layer around a bottle you already own</span>
              </span>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Select an anchor perfume from your wardrobe. The engine will find harmonious counterpoints to pair with it.
              </p>
            </div>
            <div className="w-full sm:w-72 shrink-0">
              <select
                id="owned-fragrance-select"
                value={preferences.owned_fragrance_id || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setPreferences(prev => ({ ...prev, owned_fragrance_id: val }));
                }}
                className="w-full h-10 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 font-medium"
              >
                <option value="">No Anchor (Explore Any Pair)</option>
                {fragrances.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.brand}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Fragrance Families Chips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
            Favorite Olfactory Families (Select one or more)
          </label>
          <div className="flex flex-wrap gap-2">
            {FAMILIES.map(fam => {
              const selected = (preferences.favorite_family || []).includes(fam);
              return (
                <button
                  type="button"
                  key={fam}
                  onClick={() => toggleFamily(fam)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selected
                      ? 'bg-stone-900 text-stone-100 shadow-sm border border-stone-900'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
                  }`}
                >
                  {fam}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Note Accents */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
            Desired Key Notes (Optional Accents)
          </label>
          <div className="flex flex-wrap gap-2">
            {NOTE_OPTIONS.map(note => {
              const selected = (preferences.preferred_notes || []).includes(note);
              return (
                <button
                  type="button"
                  key={note}
                  onClick={() => toggleNote(note)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selected
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}
                  {note}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="generate-layering-btn"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-medium text-sm tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></span>
                Computing Chords & Compatibility...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Calculate Best Layering Pairs</span>
              </>
            )}
          </button>

          <p className="text-xs text-stone-500 text-center sm:text-left">
            Calculates 40% chord synergy, 20% preference match, 30% season/occasion, and diversity factor.
          </p>
        </div>
      </form>
    </div>
  );
};
