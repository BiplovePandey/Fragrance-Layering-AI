import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  FlaskConical,
  Eye,
  SlidersHorizontal,
  X,
  Building2,
  Droplet,
  ArrowRight,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Wind,
  Flame,
  Calendar,
  Sparkle
} from 'lucide-react';
import {
  Fragrance,
  Brand,
  ClusterInfo,
  WeatherCondition,
  UserPreferences,
  RecommendationScore,
  MainNavId
} from '../../types.js';
import {
  DiscoveryCollectionId,
  DISCOVERY_COLLECTIONS,
  computeCollectionCounts,
  getMarketedClassification,
  getMarketedClassificationBadge
} from '../../utils/collectionClassification.js';
import {
  AllCollectionsGlyph,
  ForHimGlyph,
  ForHerGlyph,
  UnisexNicheGlyph,
  COLLECTION_GLYPH_MAP,
  VaultGlyph,
  WearGlyph,
  HeritageGlyph,
  LayeringGlyph
} from '../ui/AtelierGlyphs.js';
import { DAILY_MOOD_PRESETS } from '../../data/moods.js';
import { CollectionLandingHero } from './CollectionLandingHero.js';
import { HeroFlacon } from '../atelier/HeroFlacon.js';

export interface FragranceUniverseViewProps {
  fragrances: Fragrance[];
  brands: Brand[];
  clusters: ClusterInfo[];
  weather: WeatherCondition;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  initialCollection?: DiscoveryCollectionId;
  onCollectionChange?: (col: DiscoveryCollectionId) => void;
  // Phase 12: Personalization & Cross-Page Flows
  ownedFragrances?: Fragrance[];
  userPreferences?: UserPreferences;
  recommendationScores?: RecommendationScore[];
  onWearToday?: (frag: Fragrance) => void;
  onAddToCabinet?: (fragId: number) => void;
  onNavigate?: (tab: MainNavId) => void;
  onNavigateToHeritage?: (materialOrOrigin?: string) => void;
}

export const FragranceUniverseView: React.FC<FragranceUniverseViewProps> = ({
  fragrances,
  brands,
  clusters,
  weather,
  onSelectFragranceForChamber,
  onSendToLab,
  initialCollection = 'all',
  onCollectionChange,
  ownedFragrances = [],
  userPreferences,
  recommendationScores = [],
  onWearToday,
  onAddToCabinet,
  onNavigate,
  onNavigateToHeritage
}) => {
  const [selectedCollection, setSelectedCollection] = useState<DiscoveryCollectionId>(initialCollection);
  const [viewMode, setViewMode] = useState<'galaxy' | 'catalog'>('galaxy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedConcentration, setSelectedConcentration] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<Fragrance | null>(null);

  // Sync when initialCollection changes from outside navigation
  useEffect(() => {
    if (initialCollection) {
      setSelectedCollection(initialCollection);
    }
  }, [initialCollection]);

  const handleSelectCollection = (colId: DiscoveryCollectionId) => {
    setSelectedCollection(colId);
    onCollectionChange?.(colId);
  };

  // Live accurate counts for all collections from verified catalogue records
  const collectionCounts = useMemo(() => {
    return computeCollectionCounts(fragrances);
  }, [fragrances]);

  // Fragrances belonging to the active collection (before other query filters)
  const collectionScopedFragrances = useMemo(() => {
    if (selectedCollection === 'all') return fragrances;
    const target = DISCOVERY_COLLECTIONS[selectedCollection]?.marketedTarget;
    return fragrances.filter((f) => getMarketedClassification(f) === target);
  }, [fragrances, selectedCollection]);

  // Available families in current catalogue scope
  const availableFamilies = useMemo(() => {
    const set = new Set<string>();
    collectionScopedFragrances.forEach((f) => {
      if (f.fragrance_family) set.add(f.fragrance_family);
    });
    return Array.from(set).sort();
  }, [collectionScopedFragrances]);

  // Available brands in current catalogue scope
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    collectionScopedFragrances.forEach((f) => {
      const b = f.brand || f.brand_name;
      if (b) set.add(b.trim());
    });
    return Array.from(set).sort();
  }, [collectionScopedFragrances]);

  // Available concentrations in current catalogue scope
  const availableConcentrations = useMemo(() => {
    const set = new Set<string>();
    collectionScopedFragrances.forEach((f) => {
      const conc = f.concentration?.split(' ')[0] || f.format;
      if (conc) set.add(conc.trim());
    });
    return Array.from(set).sort();
  }, [collectionScopedFragrances]);

  // Canonical occasion taxonomy definition
  const CANONICAL_OCCASIONS = useMemo(() => [
    'Casual',
    'Date',
    'Evening',
    'Festive / Wedding',
    'Formal',
    'Meditation / Spiritual',
    'Office',
    'Signature',
    'Special Event'
  ], []);

  // Available occasions normalized to canonical taxonomy based on scoped fragrances
  const availableOccasions = useMemo(() => {
    const activeOccasions = new Set<string>();
    collectionScopedFragrances.forEach((f) => {
      const occs = (f.occasion || []).map((o) => o.toLowerCase());
      CANONICAL_OCCASIONS.forEach((canonical) => {
        const target = canonical.toLowerCase();
        const matches = occs.some((o) => {
          if (target.includes(o) || o.includes(target)) return true;
          if (target.includes('wedding') && (o.includes('festive') || o.includes('wedding') || o.includes('puja') || o.includes('ceremonial'))) return true;
          if (target.includes('office') && (o.includes('work') || o.includes('boardroom') || o.includes('business') || o.includes('executive'))) return true;
          if (target.includes('date') && (o.includes('romantic') || o.includes('intimate') || o.includes('dates'))) return true;
          if (target.includes('meditation') && (o.includes('spiritual') || o.includes('prayer') || o.includes('prayers'))) return true;
          if (target.includes('casual') && (o.includes('brunch') || o.includes('weekend') || o.includes('daily') || o.includes('relax'))) return true;
          return false;
        });
        if (matches) activeOccasions.add(canonical);
      });
    });
    return Array.from(activeOccasions).sort();
  }, [collectionScopedFragrances, CANONICAL_OCCASIONS]);

  // Canonical season taxonomy definition
  const CANONICAL_SEASONS = useMemo(() => ['Spring', 'Summer', 'Monsoon', 'Fall', 'Winter'], []);

  // Available seasons normalized to canonical seasons based on scoped fragrances
  const availableSeasons = useMemo(() => {
    const activeSeasons = new Set<string>();
    collectionScopedFragrances.forEach((f) => {
      const seasons = (f.season || []).map((s) => s.toLowerCase());
      CANONICAL_SEASONS.forEach((canonical) => {
        const target = canonical.toLowerCase();
        const matches = seasons.some((s) => {
          if (s === target) return true;
          if (target === 'fall' && (s === 'autumn' || s.includes('fall'))) return true;
          if (s.includes(target)) return true;
          return false;
        });
        if (matches) activeSeasons.add(canonical);
      });
    });
    return Array.from(activeSeasons).sort();
  }, [collectionScopedFragrances, CANONICAL_SEASONS]);

  // Top iconic notes normalized and deduplicated across current scope
  const keyNotesList = useMemo(() => {
    const counts: Record<string, { label: string; count: number }> = {};
    collectionScopedFragrances.forEach((f) => {
      const notes = [
        ...(f.top_notes || []),
        ...(f.middle_notes || []),
        ...(f.base_notes || []),
        ...(f.normalized_notes || [])
      ];
      notes.forEach((n) => {
        const clean = n.trim();
        if (clean.length > 2) {
          const key = clean.toLowerCase();
          // Normalize to proper Title Case
          const label = clean.charAt(0).toUpperCase() + clean.slice(1);
          if (!counts[key]) {
            counts[key] = { label, count: 1 };
          } else {
            counts[key].count += 1;
          }
        }
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 16)
      .map((entry) => entry.label);
  }, [collectionScopedFragrances]);

  // Check if any filters are active
  const hasActiveFilters =
    selectedCollection !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedFamily !== 'all' ||
    selectedBrand !== 'all' ||
    selectedConcentration !== 'all' ||
    selectedOrigin !== 'all' ||
    selectedNote !== 'all' ||
    selectedOccasion !== 'all' ||
    selectedMood !== 'all' ||
    selectedSeason !== 'all' ||
    selectedIntensity !== 'all';

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCollection !== 'all') count++;
    if (searchQuery.trim() !== '') count++;
    if (selectedFamily !== 'all') count++;
    if (selectedBrand !== 'all') count++;
    if (selectedConcentration !== 'all') count++;
    if (selectedOrigin !== 'all') count++;
    if (selectedNote !== 'all') count++;
    if (selectedOccasion !== 'all') count++;
    if (selectedMood !== 'all') count++;
    if (selectedSeason !== 'all') count++;
    if (selectedIntensity !== 'all') count++;
    return count;
  }, [
    selectedCollection,
    searchQuery,
    selectedFamily,
    selectedBrand,
    selectedConcentration,
    selectedOrigin,
    selectedNote,
    selectedOccasion,
    selectedMood,
    selectedSeason,
    selectedIntensity
  ]);

  const handleClearAllFilters = () => {
    setSelectedCollection('all');
    onCollectionChange?.('all');
    setSearchQuery('');
    setSelectedFamily('all');
    setSelectedBrand('all');
    setSelectedConcentration('all');
    setSelectedOrigin('all');
    setSelectedNote('all');
    setSelectedOccasion('all');
    setSelectedMood('all');
    setSelectedSeason('all');
    setSelectedIntensity('all');
  };

  const handleLoosenFilters = () => {
    // Keeps search query and active collection lens, clears specific secondary filters
    setSelectedFamily('all');
    setSelectedBrand('all');
    setSelectedConcentration('all');
    setSelectedOrigin('all');
    setSelectedNote('all');
    setSelectedOccasion('all');
    setSelectedMood('all');
    setSelectedSeason('all');
    setSelectedIntensity('all');
  };

  // Filtered fragrances matching ALL composed filters
  const filteredFragrances = useMemo(() => {
    return fragrances.filter((f) => {
      // 1. Collection Filter (Catalogue Positioning)
      if (selectedCollection !== 'all') {
        const target = DISCOVERY_COLLECTIONS[selectedCollection]?.marketedTarget;
        if (getMarketedClassification(f) !== target) return false;
      }

      // 2. Comprehensive Search Query:
      // Searches fragrance name, house, note, family, heritage material, and description
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchName = f.name.toLowerCase().includes(q);
        const matchBrand = (f.brand || f.brand_name || '').toLowerCase().includes(q);
        const matchFamily = (f.fragrance_family || '').toLowerCase().includes(q);
        const matchNotes = [
          ...(f.top_notes || []),
          ...(f.middle_notes || []),
          ...(f.base_notes || []),
          ...(f.normalized_notes || [])
        ].some((n) => n.toLowerCase().includes(q));
        const matchHeritage =
          (f.heritage_materials || []).some((m) => m.toLowerCase().includes(q)) ||
          (f.origin_style || '').toLowerCase().includes(q);
        const matchDesc = (f.description || '').toLowerCase().includes(q);

        if (!matchName && !matchBrand && !matchFamily && !matchNotes && !matchHeritage && !matchDesc) {
          return false;
        }
      }

      // 3. Family Filter
      if (selectedFamily !== 'all') {
        if (!f.fragrance_family || !f.fragrance_family.toLowerCase().includes(selectedFamily.toLowerCase())) {
          return false;
        }
      }

      // 4. House / Brand Filter
      if (selectedBrand !== 'all') {
        if (f.brand !== selectedBrand) return false;
      }

      // 5. Concentration Filter
      if (selectedConcentration !== 'all') {
        const conc = (f.concentration || f.format || '').toLowerCase();
        if (!conc.includes(selectedConcentration.toLowerCase())) return false;
      }

      // 6. Note Filter
      if (selectedNote !== 'all') {
        const allNotes = [
          ...(f.top_notes || []),
          ...(f.middle_notes || []),
          ...(f.base_notes || []),
          ...(f.normalized_notes || [])
        ].map((n) => n.toLowerCase());
        if (!allNotes.some((n) => n.includes(selectedNote.toLowerCase()))) return false;
      }

      // 7. Occasion Filter (Taxonomy-Aligned Canonical Match)
      if (selectedOccasion !== 'all') {
        const occs = (f.occasion || []).map((o) => o.toLowerCase());
        const target = selectedOccasion.toLowerCase();
        const matchesOccasion = occs.some((o) => {
          if (target.includes(o) || o.includes(target)) return true;
          if (target.includes('wedding') && (o.includes('festive') || o.includes('wedding') || o.includes('puja') || o.includes('ceremonial'))) return true;
          if (target.includes('office') && (o.includes('work') || o.includes('boardroom') || o.includes('business') || o.includes('executive'))) return true;
          if (target.includes('date') && (o.includes('romantic') || o.includes('intimate') || o.includes('dates'))) return true;
          if (target.includes('meditation') && (o.includes('spiritual') || o.includes('prayer') || o.includes('prayers'))) return true;
          if (target.includes('casual') && (o.includes('brunch') || o.includes('weekend') || o.includes('daily') || o.includes('relax'))) return true;
          return false;
        });
        if (!matchesOccasion) return false;
      }

      // 8. Mood Filter (Grounded in Daily Mood Presets & note profiles)
      if (selectedMood !== 'all') {
        const preset = DAILY_MOOD_PRESETS.find((p) => p.id === selectedMood);
        if (preset) {
          const fragNotes = [
            ...(f.top_notes || []),
            ...(f.middle_notes || []),
            ...(f.base_notes || []),
            ...(f.normalized_notes || [])
          ].map((n) => n.toLowerCase());

          const matchesMoodNotes = preset.preferredNotes.some((pn) =>
            fragNotes.some((fn) => fn.includes(pn.toLowerCase()))
          );
          const matchesMoodFamily = preset.favoriteFamily.some((fam) =>
            (f.fragrance_family || '').toLowerCase().includes(fam.toLowerCase())
          );
          const matchesMoodOccasion = (f.occasion || []).some(
            (occ) => occ.toLowerCase() === preset.occasion.toLowerCase()
          );

          if (!matchesMoodNotes && !matchesMoodFamily && !matchesMoodOccasion) {
            return false;
          }
        }
      }

      // 9. Season Filter (Canonical Season Match)
      if (selectedSeason !== 'all') {
        const seasons = (f.season || []).map((s) => s.toLowerCase());
        const target = selectedSeason.toLowerCase();
        const matchesSeason =
          seasons.includes('all year') ||
          seasons.includes('all-season') ||
          seasons.some((s) => {
            if (s === target) return true;
            if (target === 'fall' && (s === 'autumn' || s.includes('fall'))) return true;
            if (s.includes(target)) return true;
            return false;
          });
        if (!matchesSeason) return false;
      }

      // 10. Intensity Filter
      if (selectedIntensity !== 'all') {
        const val = f.intensity || 6;
        if (selectedIntensity === 'subtle' && val > 6) return false;
        if (selectedIntensity === 'moderate' && (val < 7 || val > 8)) return false;
        if (selectedIntensity === 'powerful' && val < 9) return false;
      }

      // 11. Origin / Heritage Filter
      const isIndian =
        f.brand_country?.toLowerCase().includes('india') ||
        (f.origin_style || '').toLowerCase().includes('indian') ||
        (f.origin_style || '').toLowerCase().includes('kannauj') ||
        (f.origin_style || '').toLowerCase().includes('ayurvedic') ||
        [
          'SKINN by Titan',
          'Forest Essentials',
          'Bombay Perfumery',
          'Gulabsingh Johrimal',
          'Nasheman Kannauj',
          'Muzna Fragrances',
          'Kastoor',
          'Ismail Koya'
        ].includes(f.brand);

      if (selectedOrigin === 'indian' && !isIndian) return false;
      if (selectedOrigin === 'international' && isIndian) return false;
      if (
        selectedOrigin === 'traditional_kannauj' &&
        !(
          (f.origin_style || '').toLowerCase().includes('kannauj') ||
          f.brand.toLowerCase().includes('kannauj') ||
          (f.heritage_materials || []).some(
            (m) => m.toLowerCase().includes('kannauj') || m.toLowerCase().includes('mitti')
          )
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    fragrances,
    selectedCollection,
    searchQuery,
    selectedFamily,
    selectedBrand,
    selectedConcentration,
    selectedOrigin,
    selectedNote,
    selectedOccasion,
    selectedMood,
    selectedSeason,
    selectedIntensity
  ]);

  // Personalization signal resolution based strictly on existing user data & calculations
  const getPersonalizationSignal = (frag: Fragrance) => {
    // 1. Is already represented in digital cabinet
    const isOwned = ownedFragrances.some((of) => of.id === frag.id);
    if (isOwned) {
      return {
        type: 'owned' as const,
        label: 'Already represented in your Cabinet',
        icon: VaultGlyph,
        badgeClass:
          'bg-amber-500/15 border-amber-500/35 text-amber-900 dark:text-amber-300 shadow-[0_0_10px_rgba(217,119,6,0.12)]'
      };
    }

    // 2. Aligned with personal scent profile (based on real recommendations or profile preferences)
    const recMatch = recommendationScores.find((rs) => rs.fragrance_id === frag.id);
    const hasHighRecScore = recMatch && recMatch.score >= 82;
    const matchesFavFamily = userPreferences?.favorite_family?.some((fam) =>
      frag.fragrance_family?.toLowerCase().includes(fam.toLowerCase())
    );
    const matchesPrefNotes = userPreferences?.preferred_notes?.some((pn) =>
      [...(frag.top_notes || []), ...(frag.middle_notes || []), ...(frag.base_notes || [])].some((n) =>
        n.toLowerCase().includes(pn.toLowerCase())
      )
    );

    if (hasHighRecScore || (matchesFavFamily && matchesPrefNotes)) {
      return {
        type: 'aligned' as const,
        label: 'Aligned with your scent profile',
        icon: Sparkles,
        badgeClass:
          'bg-emerald-500/15 border-emerald-500/35 text-emerald-900 dark:text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.12)]'
      };
    }

    // 3. Explores an olfactory territory outside current cabinet
    if (ownedFragrances.length > 0) {
      const ownedFamilies = new Set(
        ownedFragrances.map((of) => (of.fragrance_family || '').toLowerCase().trim())
      );
      const fragFamily = (frag.fragrance_family || '').toLowerCase().trim();
      const isOutside = !Array.from(ownedFamilies).some(
        (ofam) => ofam && (fragFamily.includes(ofam) || ofam.includes(fragFamily))
      );
      if (isOutside) {
        return {
          type: 'uncharted' as const,
          label: 'Explores a territory outside your Cabinet',
          icon: Compass,
          badgeClass:
            'bg-sky-500/15 border-sky-500/35 text-sky-900 dark:text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.12)]'
        };
      }
    }

    return null;
  };

  // Map 2D coordinates for the Olfactory Galaxy
  const galaxyNodes = useMemo(() => {
    const width = 800;
    const height = 480;
    const center = { x: width / 2, y: height / 2 };

    return filteredFragrances.map((f, i) => {
      let x = center.x;
      let y = center.y;

      if (f.vector && f.vector.length >= 2) {
        x = center.x + (f.vector[0] - 0.5) * 650;
        y = center.y + (f.vector[1] - 0.5) * 380;
      } else {
        const total = filteredFragrances.length || 1;
        const angle = (i / total) * Math.PI * 2;
        const radius = 120 + ((f.id * 37) % 180);
        x = center.x + Math.cos(angle) * radius;
        y = center.y + Math.sin(angle) * radius;
      }

      x += ((f.id * 17) % 30) - 15;
      y += ((f.id * 29) % 30) - 15;

      const fam = (f.fragrance_family || '').toLowerCase();
      let color = '#F59E0B'; // amber default
      if (fam.includes('floral') || fam.includes('rose')) color = '#FB7185';
      else if (fam.includes('fresh') || fam.includes('citrus')) color = '#34D399';
      else if (fam.includes('aquatic')) color = '#38BDF8';
      else if (fam.includes('earth') || fam.includes('mitti')) color = '#EA580C';
      else if (fam.includes('wood') || fam.includes('oud')) color = '#A855F7';

      return {
        fragrance: f,
        x: Math.max(40, Math.min(width - 40, x)),
        y: Math.max(40, Math.min(height - 40, y)),
        color,
        size: Math.max(4, Math.min(10, (f.intensity || 6) * 1.1))
      };
    });
  }, [filteredFragrances]);

  const collectionButtons = [
    {
      id: 'all' as DiscoveryCollectionId,
      label: 'All Fragrances',
      glyph: AllCollectionsGlyph,
      count: collectionCounts.all
    },
    {
      id: 'for-him' as DiscoveryCollectionId,
      label: 'For Him',
      glyph: ForHimGlyph,
      count: collectionCounts['for-him']
    },
    {
      id: 'for-her' as DiscoveryCollectionId,
      label: 'For Her',
      glyph: ForHerGlyph,
      count: collectionCounts['for-her']
    },
    {
      id: 'unisex-niche' as DiscoveryCollectionId,
      label: 'Unisex & Niche',
      glyph: UnisexNicheGlyph,
      count: collectionCounts['unisex-niche']
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & View Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-white/60 dark:border-white/10 text-amber-900 dark:text-amber-300 text-xs font-mono-lab mb-2 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Fragrance Universe &bull; Master Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613] dark:text-[#F3EFEA]">
            Olfactory Galaxy &amp; Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5046] dark:text-[#A89D91] mt-1">
            Navigate {fragrances?.length || 0} verified fine fragrances mapped across multi-dimensional coordinates and discovery collections.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl liquid-glass-pill self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('galaxy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              viewMode === 'galaxy'
                ? 'bg-white/95 dark:bg-[#201A15] text-amber-950 dark:text-amber-200 font-bold border border-white dark:border-amber-500/20 shadow-2xs'
                : 'text-[#6B6056] dark:text-[#9A8D80] hover:text-[#1A1613] dark:hover:text-white'
            }`}
          >
            🌌 Olfactory Galaxy
          </button>
          <button
            type="button"
            onClick={() => setViewMode('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              viewMode === 'catalog'
                ? 'bg-white/95 dark:bg-[#201A15] text-amber-950 dark:text-amber-200 font-bold border border-white dark:border-amber-500/20 shadow-2xs'
                : 'text-[#6B6056] dark:text-[#9A8D80] hover:text-[#1A1613] dark:hover:text-white'
            }`}
          >
            📋 Master Catalog
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: CORE DISCOVERY COLLECTION SELECTOR (DISCOVERY LENSES)
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl liquid-glass space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-lab text-[10px] uppercase tracking-widest text-[#7A6F66] dark:text-[#A89D91] font-semibold">
            Discovery Collections
          </span>
          <span className="text-[11px] font-mono-lab text-[#8A7E74] dark:text-[#8E8377]">
            Documented catalogue positioning &bull; All scents open to any wearer
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {collectionButtons.map((btn) => {
            const isSelected = selectedCollection === btn.id;
            const GlyphComp = btn.glyph;

            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleSelectCollection(btn.id)}
                className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 text-left cursor-pointer flex items-center justify-between gap-3 overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-stone-900/60 border-amber-500/60 text-[#1A1613] dark:text-white shadow-[0_4px_20px_rgba(212,175,55,0.2)] ring-1 ring-amber-500/40'
                    : 'liquid-glass-pill hover:bg-white/90 dark:hover:bg-white/[0.06] border-white/40 dark:border-white/10 text-[#5A5046] dark:text-[#B8ADA2] hover:text-[#1A1613] dark:hover:text-white'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? 'bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/50'
                        : 'bg-white/60 dark:bg-white/[0.06] text-[#7A6F66] dark:text-[#9A8D80] group-hover:text-amber-800 dark:group-hover:text-amber-300'
                    }`}
                  >
                    <GlyphComp size={16} strokeWidth={1.4} />
                  </div>
                  <div className="truncate">
                    <span className="font-mono-lab text-xs uppercase tracking-wider block font-semibold truncate">
                      {btn.label}
                    </span>
                    <span className="text-[10px] font-mono-lab text-[#7A6F66] dark:text-[#8E8377] block">
                      {btn.count} flacons
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: COLLECTION EDITORIAL LANDING EXPERIENCE
          When a specific collection is selected, render its cinematic landing hero.
          When 'all' is selected, render the 3 first-class discovery entry panels.
          ========================================================================= */}
      {selectedCollection !== 'all' ? (
        <CollectionLandingHero
          collectionId={selectedCollection}
          collectionFragrances={collectionScopedFragrances}
          onSelectFamily={(fam) => setSelectedFamily(fam)}
          onSelectBrand={(b) => setSelectedBrand(b)}
          onSelectConcentration={(conc) => setSelectedConcentration(conc)}
          onSelectFragranceForChamber={onSelectFragranceForChamber}
          onSendToLab={onSendToLab}
          onViewCatalog={() => {
            setViewMode('catalog');
            const el = document.getElementById('catalogue-results-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-lab uppercase tracking-[0.2em] text-[#8A7E72] dark:text-[#A89D91] block">
                Discovery Portals
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1613] dark:text-[#F3EFEA] font-medium tracking-tight">
                Explore the Fragrance Universe
              </h2>
            </div>
            <span className="text-xs font-mono-lab text-[#8A7E74] dark:text-[#8E8377] hidden sm:inline">
              Documented classifications &bull; All scents open to any wearer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Panel 1: FOR HIM */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#1C140E]/95 via-[#15100C]/90 to-[#0F0C09]/95 border border-amber-700/35 text-stone-200 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-700/15 rounded-full blur-3xl pointer-events-none -z-10 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-amber-400">
                      <ForHimGlyph size={15} strokeWidth={1.35} />
                    </div>
                    <span className="font-mono-lab text-[10px] uppercase tracking-wider text-amber-200/80 font-semibold">
                      Collection
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-lab px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-600/30">
                    {collectionCounts['for-him']} flacons
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-100 group-hover:text-amber-200 transition">
                    FOR HIM
                  </h3>
                  <p className="text-[11px] font-mono-lab text-stone-400 tracking-wide mt-0.5">
                    Dark Walnut &bull; Amber &bull; Smoked Woods
                  </p>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  Resonant woods, smoked resins, leather accords, and architectural aromatics designed with depth and presence.
                </p>

                {(() => {
                  const specimen =
                    fragrances.find((f) => getMarketedClassification(f) === 'masculine') || fragrances[0];
                  if (!specimen) return null;
                  return (
                    <div
                      onClick={() => onSelectFragranceForChamber(specimen)}
                      className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-10 h-12 shrink-0 flex items-center justify-center">
                        <HeroFlacon fragrance={specimen} size="mini" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono-lab uppercase text-amber-400/90 block truncate">
                          Featured: {specimen.brand}
                        </span>
                        <div className="text-xs font-serif text-stone-200 truncate font-medium">
                          {specimen.name}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-4 mt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleSelectCollection('for-him')}
                  className="w-full py-2 px-3.5 rounded-xl text-xs font-mono-lab tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2 border bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border-amber-600/40 shadow-xs"
                >
                  <span>Explore For Him</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Panel 2: FOR HER */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#201417]/95 via-[#180F12]/90 to-[#100A0D]/95 border border-rose-700/35 text-stone-200 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-rose-400/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-900/15 rounded-full blur-3xl pointer-events-none -z-10 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-rose-300">
                      <ForHerGlyph size={15} strokeWidth={1.35} />
                    </div>
                    <span className="font-mono-lab text-[10px] uppercase tracking-wider text-rose-200/80 font-semibold">
                      Collection
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-lab px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-200 border border-rose-500/30">
                    {collectionCounts['for-her']} flacons
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-100 group-hover:text-rose-200 transition">
                    FOR HER
                  </h3>
                  <p className="text-[11px] font-mono-lab text-stone-400 tracking-wide mt-0.5">
                    Warm Ivory &bull; Soft Rose &bull; Botanical Petals
                  </p>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  Luminous florals, warm ivory champagne accords, golden balsams, and velvety radiant drydowns.
                </p>

                {(() => {
                  const specimen =
                    fragrances.find((f) => getMarketedClassification(f) === 'feminine') || fragrances[1] || fragrances[0];
                  if (!specimen) return null;
                  return (
                    <div
                      onClick={() => onSelectFragranceForChamber(specimen)}
                      className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-10 h-12 shrink-0 flex items-center justify-center">
                        <HeroFlacon fragrance={specimen} size="mini" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono-lab uppercase text-rose-300/90 block truncate">
                          Featured: {specimen.brand}
                        </span>
                        <div className="text-xs font-serif text-stone-200 truncate font-medium">
                          {specimen.name}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-4 mt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleSelectCollection('for-her')}
                  className="w-full py-2 px-3.5 rounded-xl text-xs font-mono-lab tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2 border bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border-rose-500/40 shadow-xs"
                >
                  <span>Explore For Her</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Panel 3: UNISEX & NICHE */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#121915]/95 via-[#0D1310]/90 to-[#080D0B]/95 border border-emerald-700/35 text-stone-200 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-emerald-500/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-700/15 rounded-full blur-3xl pointer-events-none -z-10 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-emerald-300">
                      <UnisexNicheGlyph size={15} strokeWidth={1.35} />
                    </div>
                    <span className="font-mono-lab text-[10px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                      Collection
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-lab px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 border border-emerald-500/30">
                    {collectionCounts['unisex-niche']} flacons
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-100 group-hover:text-emerald-200 transition">
                    UNISEX &amp; NICHE
                  </h3>
                  <p className="text-[11px] font-mono-lab text-stone-400 tracking-wide mt-0.5">
                    Smoked Glass &bull; Champagne &bull; Modern Niche
                  </p>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  Ancient hydrodistillates, monsoon petrichor, artisanal attars, and boundary-free modern haute perfumery.
                </p>

                {(() => {
                  const specimen =
                    fragrances.find((f) => getMarketedClassification(f) === 'unisex') ||
                    fragrances[2] ||
                    fragrances[0];
                  if (!specimen) return null;
                  return (
                    <div
                      onClick={() => onSelectFragranceForChamber(specimen)}
                      className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-10 h-12 shrink-0 flex items-center justify-center">
                        <HeroFlacon fragrance={specimen} size="mini" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono-lab uppercase text-emerald-300/90 block truncate">
                          Featured: {specimen.brand}
                        </span>
                        <div className="text-xs font-serif text-stone-200 truncate font-medium">
                          {specimen.name}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-4 mt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleSelectCollection('unisex-niche')}
                  className="w-full py-2 px-3.5 rounded-xl text-xs font-mono-lab tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2 border bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border-emerald-500/40 shadow-xs"
                >
                  <span>Explore Unisex</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: COMPOSABLE SEARCH & DISCOVERY FILTERS CONSOLE
          Grounded exclusively in real dataset fields:
          - House (brand)
          - Concentration
          - Fragrance family
          - Notes
          - Occasion
          - Mood
          - Season
          - Intensity
          - Heritage / Indian origin
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl liquid-glass space-y-4">
        {/* Top Row: Search Input + Core Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Universal Discovery Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#7A6F66] dark:text-[#A89D91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by perfume, house, note, family, heritage material (e.g. oud, mitti, sandalwood, rose)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl liquid-glass-inset text-[#1A1613] dark:text-white text-xs placeholder:text-[#8A7E74] dark:placeholder:text-[#8A7E72] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#1A1613] dark:hover:text-white p-1"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Origin / Heritage Filter */}
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none"
              aria-label="Filter by fragrance origin"
            >
              <option value="all" className="bg-[#1C1714] text-stone-200">All Origins</option>
              <option value="indian" className="bg-[#1C1714] text-stone-200">🇮🇳 Indian Heritage &amp; Niche</option>
              <option value="traditional_kannauj" className="bg-[#1C1714] text-stone-200">🏺 Kannauj Deg-Bhapka / Mitti</option>
              <option value="international" className="bg-[#1C1714] text-stone-200">🌍 International Luxury</option>
            </select>

            {/* Fragrance Family Filter */}
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none max-w-[170px] truncate"
              aria-label="Filter by fragrance family"
            >
              <option value="all" className="bg-[#1C1714] text-stone-200">All Families ({availableFamilies.length})</option>
              {availableFamilies.map((f) => (
                <option key={f} value={f} className="bg-[#1C1714] text-stone-200">{f}</option>
              ))}
            </select>

            {/* House / Maison Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none max-w-[160px] truncate"
              aria-label="Filter by brand or house"
            >
              <option value="all" className="bg-[#1C1714] text-stone-200">All Houses ({availableBrands.length})</option>
              {availableBrands.map((b) => (
                <option key={b} value={b} className="bg-[#1C1714] text-stone-200">{b}</option>
              ))}
            </select>

            {/* Concentration Filter */}
            <select
              value={selectedConcentration}
              onChange={(e) => setSelectedConcentration(e.target.value)}
              className="px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none max-w-[150px] truncate"
              aria-label="Filter by concentration"
            >
              <option value="all" className="bg-[#1C1714] text-stone-200">Formats ({availableConcentrations.length})</option>
              {availableConcentrations.map((c) => (
                <option key={c} value={c} className="bg-[#1C1714] text-stone-200">{c}</option>
              ))}
            </select>

            {/* Toggle Refined Dimensions Panel */}
            <button
              type="button"
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className={`px-3 py-2 rounded-xl liquid-glass-pill text-xs font-mono-lab flex items-center gap-1.5 transition cursor-pointer ${
                isAdvancedFiltersOpen || activeFilterCount > 0
                  ? 'border-amber-500/50 text-amber-900 dark:text-amber-300 font-semibold'
                  : 'text-[#5A5046] dark:text-[#A89D91]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Refine</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-600/30 text-amber-900 dark:text-amber-300 text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              {isAdvancedFiltersOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Refinement Panel: Occasion, Mood, Season, Intensity, Key Notes */}
        {isAdvancedFiltersOpen && (
          <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] space-y-3.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Occasion Filter */}
              <div>
                <label className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider block mb-1">
                  Occasion
                </label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none"
                  aria-label="Filter by occasion"
                >
                  <option value="all" className="bg-[#1C1714] text-stone-200">All Occasions</option>
                  {availableOccasions.map((occ) => (
                    <option key={occ} value={occ} className="bg-[#1C1714] text-stone-200">{occ}</option>
                  ))}
                </select>
              </div>

              {/* Mood Filter */}
              <div>
                <label className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider block mb-1">
                  Mood &amp; Disposition
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none"
                  aria-label="Filter by mood"
                >
                  <option value="all" className="bg-[#1C1714] text-stone-200">All Moods</option>
                  {DAILY_MOOD_PRESETS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#1C1714] text-stone-200">
                      {m.emoji} {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season Filter */}
              <div>
                <label className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider block mb-1">
                  Season &amp; Weather Band
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none"
                  aria-label="Filter by season"
                >
                  <option value="all" className="bg-[#1C1714] text-stone-200">All Seasons</option>
                  {availableSeasons.map((s) => (
                    <option key={s} value={s} className="bg-[#1C1714] text-stone-200">{s}</option>
                  ))}
                </select>
              </div>

              {/* Intensity / Sillage Filter */}
              <div>
                <label className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider block mb-1">
                  Intensity &amp; Presence
                </label>
                <select
                  value={selectedIntensity}
                  onChange={(e) => setSelectedIntensity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-pill text-[#2E2620] dark:text-[#EAE2D8] font-mono-lab focus:outline-none"
                  aria-label="Filter by intensity"
                >
                  <option value="all" className="bg-[#1C1714] text-stone-200">All Intensities (1-10)</option>
                  <option value="subtle" className="bg-[#1C1714] text-stone-200">Intimate / Subtle (5 - 6)</option>
                  <option value="moderate" className="bg-[#1C1714] text-stone-200">Pronounced / Radiant (7 - 8)</option>
                  <option value="powerful" className="bg-[#1C1714] text-stone-200">Powerful / Beastmode (9 - 10)</option>
                </select>
              </div>
            </div>

            {/* Quick Iconic Note Chords Row */}
            <div>
              <span className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider block mb-1.5">
                Key Olfactory Notes in Scope
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedNote('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono-lab transition cursor-pointer ${
                    selectedNote === 'all'
                      ? 'bg-amber-600/30 text-amber-900 dark:text-amber-200 border border-amber-500/40 font-bold'
                      : 'bg-black/[0.03] dark:bg-white/[0.04] text-[#6E6358] dark:text-[#9A8D80] hover:text-[#1A1613] dark:hover:text-white border border-transparent'
                  }`}
                >
                  All Notes
                </button>
                {keyNotesList.map((note) => {
                  const isSelected = selectedNote.toLowerCase() === note.toLowerCase();
                  return (
                    <button
                      key={note}
                      type="button"
                      onClick={() => setSelectedNote(isSelected ? 'all' : note)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono-lab transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600/30 text-amber-900 dark:text-amber-200 border border-amber-500/40 font-bold'
                          : 'bg-black/[0.03] dark:bg-white/[0.04] text-[#6E6358] dark:text-[#9A8D80] hover:text-[#1A1613] dark:hover:text-white border border-transparent'
                      }`}
                    >
                      {note}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Pill Bar & Live Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider">
              Discovered:
            </span>
            <span className="font-mono-lab text-xs font-bold text-amber-900 dark:text-amber-300">
              {filteredFragrances.length} flacons
            </span>
            <span className="text-[#8A7E74] dark:text-[#7A6F66] text-xs">
              (of {fragrances.length} in universe)
            </span>

            {/* Individual active filter chips */}
            {selectedCollection !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-mono-lab text-[11px]">
                <span>{DISCOVERY_COLLECTIONS[selectedCollection]?.label}</span>
                <button
                  type="button"
                  onClick={() => handleSelectCollection('all')}
                  className="hover:text-amber-700 dark:hover:text-white"
                  aria-label="Remove collection lens"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-black dark:hover:text-white"
                  aria-label="Clear search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFamily !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>Family: {selectedFamily}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFamily('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>House: {selectedBrand}</span>
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedConcentration !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>Format: {selectedConcentration}</span>
                <button
                  type="button"
                  onClick={() => setSelectedConcentration('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedNote !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>Note: {selectedNote}</span>
                <button
                  type="button"
                  onClick={() => setSelectedNote('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedOccasion !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>Occasion: {selectedOccasion}</span>
                <button
                  type="button"
                  onClick={() => setSelectedOccasion('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedMood !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>
                  Mood: {DAILY_MOOD_PRESETS.find((m) => m.id === selectedMood)?.title || selectedMood}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMood('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSeason !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span>Season: {selectedSeason}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSeason('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedIntensity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-200/80 dark:bg-white/[0.06] border border-stone-300 dark:border-white/10 text-[#2E2620] dark:text-[#E0D8CE] font-mono-lab text-[11px]">
                <span className="capitalize">Intensity: {selectedIntensity}</span>
                <button
                  type="button"
                  onClick={() => setSelectedIntensity('all')}
                  className="hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200 font-mono-lab flex items-center gap-1 cursor-pointer transition select-none ml-auto"
            >
              <span>Reset All ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OLFACTORY GALAXY
          ========================================================================= */}
      {viewMode === 'galaxy' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl liquid-glass flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono-lab text-[10px] text-[#7A6F66] dark:text-[#A89D91] uppercase tracking-wider">
                Spectral Coordinates:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
                <span className="text-[11px] text-[#5A5046] dark:text-[#B8ADA2]">Floral</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                <span className="text-[11px] text-[#5A5046] dark:text-[#B8ADA2]">Fresh / Citrus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span className="text-[11px] text-[#5A5046] dark:text-[#B8ADA2]">Aquatic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                <span className="text-[11px] text-[#5A5046] dark:text-[#B8ADA2]">Earthy / Mitti</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                <span className="text-[11px] text-[#5A5046] dark:text-[#B8ADA2]">Woody / Oud</span>
              </div>
            </div>

            <span className="text-[10px] font-mono-lab text-[#7A6F66] dark:text-[#8E8377]">
              Node size = Sillage &bull; Distance = Olfactory Distance
            </span>
          </div>

          {/* Interactive Celestial Canvas */}
          <div className="relative w-full h-[520px] rounded-3xl bg-[#0C0A09] border border-amber-900/30 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Celestial Background Grid & Nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.12)_0%,rgba(12,10,9,0.95)_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {filteredFragrances.length === 0 ? (
              /* Phase 12 Elegant Atelier Empty State */
              <div className="relative z-10 p-8 text-center max-w-md mx-auto space-y-4 rounded-3xl bg-[#14100D]/90 border border-amber-600/30 backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-stone-100 font-medium">
                  No Flacons in This Territory
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Your active parameters yielded no catalogue specimens in{' '}
                  <span className="text-amber-300 font-semibold">
                    {DISCOVERY_COLLECTIONS[selectedCollection]?.label}
                  </span>.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleLoosenFilters}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono-lab cursor-pointer transition"
                  >
                    Loosen Dimensions
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-stone-200 text-xs font-mono-lab cursor-pointer transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <svg viewBox="0 0 800 480" className="w-full h-full cursor-crosshair">
                <circle
                  cx="400"
                  cy="240"
                  r="120"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4,4"
                />
                <circle
                  cx="400"
                  cy="240"
                  r="220"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="6,6"
                />

                {galaxyNodes.map((node) => {
                  const isHovered = hoveredNode?.id === node.fragrance.id;
                  return (
                    <g
                      key={node.fragrance.id}
                      onClick={() => onSelectFragranceForChamber(node.fragrance)}
                      onMouseEnter={() => setHoveredNode(node.fragrance)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer transition-transform"
                    >
                      {isHovered && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size * 2.5}
                          fill={node.color}
                          opacity="0.3"
                          className="animate-ping"
                        />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill={node.color}
                        opacity={isHovered ? 1.0 : 0.85}
                        stroke="#FFFFFF"
                        strokeWidth={isHovered ? 2 : 0.5}
                      />

                      <text
                        x={node.x}
                        y={node.y + node.size + 10}
                        textAnchor="middle"
                        fill={isHovered ? '#FFFFFF' : '#D6D3D1'}
                        fontSize="9"
                        fontFamily="sans-serif"
                        className="pointer-events-none select-none"
                      >
                        {node.fragrance.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Hovered Fragrance Dossier Card */}
            {hoveredNode && (
              <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-[#161310]/95 border border-amber-500/40 text-stone-200 text-xs shadow-2xl backdrop-blur-md max-w-sm pointer-events-none animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono-lab uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                    {hoveredNode.brand}
                  </span>
                  <span className="text-[10px] text-stone-400">{hoveredNode.fragrance_family}</span>
                  <span className="text-[9px] font-mono-lab px-2 py-0.5 rounded bg-white/[0.05] text-stone-300 ml-auto">
                    {getMarketedClassificationBadge(hoveredNode).label}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-100">
                  {hoveredNode.name}
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-2 mt-1">
                  {hoveredNode.description}
                </p>
                {(() => {
                  const sig = getPersonalizationSignal(hoveredNode);
                  if (!sig) return null;
                  const Icon = sig.icon;
                  return (
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-mono-lab px-2 py-0.5 rounded-full border ${sig.badgeClass}`}
                      >
                        <Icon size={10} strokeWidth={1.4} />
                        <span>{sig.label}</span>
                      </span>
                    </div>
                  );
                })()}
                <div className="mt-2 text-[10px] text-amber-400 font-mono-lab">
                  Click star to enter Fragrance Chamber &rarr;
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: GRID MASTER CATALOG (COLLECTOR SPECIMENS)
          Vertical Specimen Hierarchy:
          Bottle
          ↓
          Fragrance name
          ↓
          House
          ↓
          Concentration
          ↓
          Marketed classification
          ↓
          Note composition
          ↓
          Personalization indicator (if applicable)
          ↓
          Inspect Chamber / Layer / Wear Today / Cabinet
          ========================================================================= */}
      {viewMode === 'catalog' && (
        <div id="catalogue-results-grid" className="space-y-6">
          {filteredFragrances.length === 0 ? (
            /* Phase 12 Elegant Atelier Empty State for Catalog */
            <div className="p-10 sm:p-14 text-center rounded-3xl liquid-glass space-y-4 max-w-lg mx-auto border border-amber-600/30">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#1A1613] dark:text-[#F3EFEA] font-medium">
                No Flacons Discovered in This Territory
              </h3>
              <p className="text-xs text-[#5A5046] dark:text-[#B8ADA2] leading-relaxed">
                No verified records match your active criteria for{' '}
                <span className="font-semibold text-amber-900 dark:text-amber-300">
                  {DISCOVERY_COLLECTIONS[selectedCollection]?.label}
                </span>.
              </p>
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[11px] font-mono-lab text-[#7A6F66] dark:text-[#8E8377] space-y-1">
                <div>Active Lens: {DISCOVERY_COLLECTIONS[selectedCollection]?.label}</div>
                {searchQuery && <div>Query: &ldquo;{searchQuery}&rdquo;</div>}
                {selectedFamily !== 'all' && <div>Family: {selectedFamily}</div>}
                {selectedBrand !== 'all' && <div>House: {selectedBrand}</div>}
                {selectedOccasion !== 'all' && <div>Occasion: {selectedOccasion}</div>}
                {selectedSeason !== 'all' && <div>Season: {selectedSeason}</div>}
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleLoosenFilters}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-mono-lab cursor-pointer transition"
                >
                  Loosen Filters (Keep Search &amp; Lens)
                </button>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-mono-lab cursor-pointer transition"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFragrances.map((frag) => {
                const badge = getMarketedClassificationBadge(frag);
                const BadgeGlyph = COLLECTION_GLYPH_MAP[badge.collectionId] || AllCollectionsGlyph;

                // Derive key chords for clean unboxed metadata
                const topNotesStr = (frag.top_notes || []).slice(0, 2).join(', ');
                const baseNotesStr = (frag.base_notes || []).slice(0, 2).join(', ');

                // Personalization Signal (Cabinet, Scent Profile, Uncharted)
                const personalization = getPersonalizationSignal(frag);
                const isOwned = ownedFragrances.some((of) => of.id === frag.id);

                // Heritage detection
                const hasHeritageMaterial =
                  (frag.heritage_materials && frag.heritage_materials.length > 0) ||
                  (frag.origin_style || '').toLowerCase().includes('indian') ||
                  (frag.origin_style || '').toLowerCase().includes('kannauj') ||
                  frag.brand_country?.toLowerCase().includes('india');

                return (
                  <div
                    key={frag.id}
                    className="relative rounded-3xl bg-white/90 dark:bg-[#14100D]/90 border border-[#E8DFD3] dark:border-white/10 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:border-amber-500/40 overflow-hidden"
                  >
                    <div>
                      {/* 1. Bottle: Centered Specimen Flacon Pedestal */}
                      <div
                        onClick={() => onSelectFragranceForChamber(frag)}
                        className="py-4 my-2 flex items-center justify-center relative cursor-pointer group/flacon"
                        title={`Inspect ${frag.name} in Fragrance Chamber`}
                      >
                        {/* Soft Ambient Reflected Light Halo */}
                        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-24 rounded-full bg-amber-500/10 dark:bg-amber-400/5 blur-2xl pointer-events-none group-hover/flacon:scale-110 transition-transform duration-500" />
                        <div className="w-16 h-20 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover/flacon:-translate-y-1">
                          <HeroFlacon fragrance={frag} size="mini" />
                        </div>
                      </div>

                      {/* 2. Fragrance Name */}
                      <h3
                        onClick={() => onSelectFragranceForChamber(frag)}
                        className="font-serif text-2xl font-medium text-[#1A1613] dark:text-[#F8F5EE] group-hover:text-amber-900 dark:group-hover:text-amber-300 transition cursor-pointer"
                      >
                        {frag.name}
                      </h3>

                      {/* 3. House & 4. Concentration */}
                      <div className="flex items-center justify-between gap-2 mt-1 mb-2">
                        <span className="text-[10px] font-mono-lab uppercase tracking-[0.2em] text-[#8A7E72] dark:text-[#A89D91]">
                          Maison {frag.brand}
                        </span>

                        <span className="text-[10px] font-mono-lab text-amber-800 dark:text-amber-400 font-semibold">
                          {frag.concentration || frag.format || 'Fine Parfum'}
                        </span>
                      </div>

                      {/* 5. Marketed Classification Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[9.5px] font-mono-lab px-2 py-0.5 rounded-full border ${badge.bgClass} ${badge.borderClass} ${badge.colorClass}`}
                          title={`Catalogue positioning: ${badge.editorialTag}`}
                        >
                          <BadgeGlyph size={11} strokeWidth={1.4} />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[10px] font-mono-lab text-[#8A7E72] dark:text-[#A89D91]">
                          &bull; {frag.fragrance_family}
                        </span>
                      </div>

                      {/* 6. Note Composition (Clean Unboxed Zero-Pill Chords) */}
                      {(topNotesStr || baseNotesStr) && (
                        <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] text-[11px] font-sans text-[#7A6F66] dark:text-[#9E9387]">
                          <span className="font-mono-lab text-[9.5px] uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-0.5">
                            Note Composition
                          </span>
                          <span className="leading-snug">
                            {topNotesStr}
                            {topNotesStr && baseNotesStr ? ' · ' : ''}
                            {baseNotesStr}
                          </span>
                        </div>
                      )}

                      {/* 7. Personalization Signal Badge (if applicable) */}
                      {personalization && (
                        <div className="mt-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[9.5px] font-mono-lab px-2 py-0.5 rounded-full border ${personalization.badgeClass}`}
                          >
                            <personalization.icon size={11} strokeWidth={1.35} />
                            <span>{personalization.label}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar (Cross-Page Flows): Inspect Chamber, Layer, Wear Today, Cabinet, Heritage */}
                    <div className="mt-5 pt-3.5 border-t border-black/[0.04] dark:border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectFragranceForChamber(frag)}
                          className="text-xs font-semibold text-[#5A5046] dark:text-[#D1C7BB] hover:text-[#1A1613] dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition select-none"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                          <span>Inspect Chamber</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSendToLab(frag)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-mono-lab transition cursor-pointer flex items-center gap-1.5 select-none"
                        >
                          <FlaskConical className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                          <span>Layer</span>
                        </button>
                      </div>

                      {/* Secondary Cross-Page Actions: Wear Today, Cabinet Shelf, Heritage Link */}
                      <div className="flex items-center justify-between gap-2 pt-1.5 text-[10.5px] font-mono-lab border-t border-black/[0.03] dark:border-white/[0.04]">
                        {/* Wear Today Flow */}
                        {onWearToday && (
                          <button
                            type="button"
                            onClick={() => onWearToday(frag)}
                            className="text-[#6B6056] dark:text-[#9A8D80] hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
                            title="Log as Scent of the Day"
                          >
                            <WearGlyph size={12} strokeWidth={1.3} />
                            <span>Wear Today</span>
                          </button>
                        )}

                        {/* Cabinet Wardrobe Flow */}
                        {onAddToCabinet && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!isOwned) {
                                onAddToCabinet(frag.id);
                              } else {
                                onNavigate?.('wardrobe');
                              }
                            }}
                            className={`flex items-center gap-1 transition cursor-pointer ${
                              isOwned
                                ? 'text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200'
                                : 'text-[#6B6056] dark:text-[#9A8D80] hover:text-amber-800 dark:hover:text-amber-300'
                            }`}
                            title={isOwned ? 'View in Cabinet' : 'Add to Cabinet'}
                          >
                            <VaultGlyph size={12} strokeWidth={1.3} />
                            <span>{isOwned ? 'In Cabinet' : '+ Cabinet'}</span>
                          </button>
                        )}

                        {/* Heritage Atlas Link */}
                        {hasHeritageMaterial && onNavigateToHeritage && (
                          <button
                            type="button"
                            onClick={() => onNavigateToHeritage(frag.name)}
                            className="text-[#7A6F66] dark:text-[#A89D91] hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
                            title="Explore Heritage & Botanical Distillates in Atlas"
                          >
                            <HeritageGlyph size={12} strokeWidth={1.3} />
                            <span>Heritage</span>
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
      )}
    </div>
  );
};
