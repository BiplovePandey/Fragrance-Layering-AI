import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  FlaskConical,
  Eye,
  SlidersHorizontal,
  Layers,
  MapPin
} from 'lucide-react';
import { Fragrance, Brand, ClusterInfo, WeatherCondition } from '../../types.js';

interface FragranceUniverseViewProps {
  fragrances: Fragrance[];
  brands: Brand[];
  clusters: ClusterInfo[];
  weather: WeatherCondition;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
}

export const FragranceUniverseView: React.FC<FragranceUniverseViewProps> = ({
  fragrances,
  brands,
  clusters,
  weather,
  onSelectFragranceForChamber,
  onSendToLab
}) => {
  const [viewMode, setViewMode] = useState<'galaxy' | 'catalog'>('galaxy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<Fragrance | null>(null);

  // Available families
  const families = useMemo(() => {
    const set = new Set<string>();
    fragrances.forEach(f => {
      if (f.fragrance_family) set.add(f.fragrance_family);
    });
    return Array.from(set);
  }, [fragrances]);

  // Filtered fragrances
  const filteredFragrances = useMemo(() => {
    return fragrances.filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.brand.toLowerCase().includes(q) ||
        (f.top_notes || []).some(n => n.toLowerCase().includes(q)) ||
        (f.middle_notes || []).some(n => n.toLowerCase().includes(q)) ||
        (f.base_notes || []).some(n => n.toLowerCase().includes(q));

      const matchFamily =
        selectedFamily === 'all' ||
        (f.fragrance_family && f.fragrance_family.toLowerCase().includes(selectedFamily.toLowerCase()));

      const isIndian =
        f.brand_country?.toLowerCase().includes('india') ||
        ['SKINN by Titan', 'Forest Essentials', 'Bombay Perfumery', 'Gulabsingh Johrimal', 'Nasheman Kannauj', 'Muzna Fragrances', 'Kastoor', 'Ismail Koya'].includes(f.brand);

      const matchOrigin =
        selectedOrigin === 'all' ||
        (selectedOrigin === 'indian' && isIndian) ||
        (selectedOrigin === 'international' && !isIndian);

      return matchSearch && matchFamily && matchOrigin;
    });
  }, [fragrances, searchQuery, selectedFamily, selectedOrigin]);

  // Map 2D coordinates for the Olfactory Galaxy
  const galaxyNodes = useMemo(() => {
    const width = 800;
    const height = 480;
    const center = { x: width / 2, y: height / 2 };

    return filteredFragrances.map((f, i) => {
      // Use vector coordinates if present, or deterministic trigonometric projection based on family & id
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

      // Add gentle jitter based on id to prevent complete overlap
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

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white text-amber-900 text-xs font-mono-lab mb-2 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Fragrance Universe &bull; Master Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
            Olfactory Galaxy &amp; Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1">
            Navigate {fragrances?.length || 0} verified fine fragrances mapped across multi-dimensional olfactory coordinates.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl liquid-glass-pill self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('galaxy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              viewMode === 'galaxy'
                ? 'bg-white/95 text-amber-950 font-bold border border-white shadow-2xs'
                : 'text-[#6B6056] hover:text-[#1A1613]'
            }`}
          >
            🌌 Olfactory Galaxy
          </button>
          <button
            type="button"
            onClick={() => setViewMode('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              viewMode === 'catalog'
                ? 'bg-white/95 text-amber-950 font-bold border border-white shadow-2xs'
                : 'text-[#6B6056] hover:text-[#1A1613]'
            }`}
          >
            📋 Master Catalog
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl liquid-glass flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by perfume, house, bergamot, sandalwood, mitti..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl liquid-glass-inset text-[#1A1613] text-xs placeholder:text-[#8A7E74] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Origin Filter */}
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="px-3.5 py-2 rounded-xl liquid-glass-pill text-[#2E2620] font-mono-lab focus:outline-none"
          >
            <option value="all" className="bg-white text-[#1A1613]">All Origins</option>
            <option value="indian" className="bg-white text-[#1A1613]">🇮🇳 Indian Heritage &amp; Niche</option>
            <option value="international" className="bg-white text-[#1A1613]">🌍 International Luxury</option>
          </select>

          {/* Family Filter */}
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="px-3.5 py-2 rounded-xl liquid-glass-pill text-[#2E2620] font-mono-lab focus:outline-none max-w-[180px] truncate"
          >
            <option value="all" className="bg-white text-[#1A1613]">All Fragrance Families</option>
            {families.slice(0, 8).map(f => (
              <option key={f} value={f} className="bg-white text-[#1A1613]">{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: Olfactory Galaxy (Interactive Celestial Map) */}
      {viewMode === 'galaxy' && (
        <div className="relative rounded-3xl bg-[#120F0D]/90 border border-white/20 p-4 sm:p-6 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl liquid-specular-rim">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="text-xs font-mono-lab text-stone-300">
              Showing {galaxyNodes?.length || 0} nodes &bull; Click any star to enter its Fragrance Chamber
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono-lab text-stone-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Floral</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Fresh</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Woody / Oud</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Earthy</span>
            </div>
          </div>

          {/* SVG Interactive Canvas */}
          <div className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-black/40 border border-white/10">
            <svg viewBox="0 0 800 480" className="w-full h-full cursor-crosshair">
              {/* Center Orbit rings */}
              <circle cx="400" cy="240" r="120" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />
              <circle cx="400" cy="240" r="220" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="6,6" />

              {/* Nodes */}
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
                    {/* Glowing Aura ring on hover */}
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

                    {/* Main Star Node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size}
                      fill={node.color}
                      opacity={isHovered ? 1.0 : 0.85}
                      stroke="#FFFFFF"
                      strokeWidth={isHovered ? 2 : 0.5}
                    />

                    {/* Node Label */}
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

            {/* Hovered Fragrance Floating Card Preview */}
            {hoveredNode && (
              <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-[#161310]/95 border border-amber-500/40 text-stone-200 text-xs shadow-2xl backdrop-blur-md max-w-sm pointer-events-none animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono-lab uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                    {hoveredNode.brand}
                  </span>
                  <span className="text-[10px] text-stone-400">{hoveredNode.fragrance_family}</span>
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-100">
                  {hoveredNode.name}
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-2 mt-1">
                  {hoveredNode.description}
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-mono-lab">
                  Click to enter Fragrance Chamber &rarr;
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Grid Master Catalog */}
      {viewMode === 'catalog' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFragrances.map((frag) => (
            <div
              key={frag.id}
              className="rounded-3xl liquid-glass p-5 sm:p-6 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono-lab uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-white/80 text-[#5A5046] border border-white shadow-2xs">
                    {frag.brand}
                  </span>
                  <span className="text-[10px] font-mono-lab text-amber-800 font-bold">
                    {frag.concentration || 'Fine Parfum'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#1A1613] group-hover:text-amber-900 transition">
                  {frag.name}
                </h3>
                <p className="text-xs text-amber-800 font-sans mt-0.5 font-semibold">
                  {frag.fragrance_family}
                </p>

                <p className="text-xs text-[#5A5046] line-clamp-3 mt-3 leading-relaxed">
                  {frag.description}
                </p>

                {/* Notes Pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(frag.top_notes || []).slice(0, 2).map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-lg bg-white/70 border border-white text-[10px] text-[#3D352E]">
                      🌿 {n}
                    </span>
                  ))}
                  {(frag.base_notes || []).slice(0, 1).map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-lg bg-amber-100/70 border border-amber-200 text-[10px] text-amber-900 font-medium">
                      🪵 {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-white/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectFragranceForChamber(frag)}
                  className="text-xs font-semibold text-[#5A5046] hover:text-[#1A1613] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Inspect</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSendToLab(frag)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <FlaskConical className="w-3 h-3 text-amber-800" />
                  <span>Layer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
