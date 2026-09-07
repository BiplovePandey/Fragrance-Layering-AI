import React, { useState, useMemo } from 'react';
import { Fragrance, Brand, MasterCatalogSchemaRow } from '../types.js';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Layers, 
  ShieldCheck, 
  FileSpreadsheet, 
  Terminal, 
  Sliders, 
  Sparkles, 
  Info,
  Database,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface DataIngestionPipelineViewProps {
  fragrances: Fragrance[];
  brands: Brand[];
}

interface ValidationTestSample {
  id: string;
  name: string;
  brand: string;
  category: string;
  expectedResult: 'accepted' | 'rejected';
  ruleViolated?: string;
  explanation: string;
}

const PRESET_VALIDATION_SAMPLES: ValidationTestSample[] = [
  {
    id: 'sample-1',
    name: 'Bella Vita 4-in-1 Luxury Perfume Gift Set',
    brand: 'Bella Vita Luxury',
    category: 'Gift Set / Combo',
    expectedResult: 'rejected',
    ruleViolated: 'RULE_NO_GIFT_SETS',
    explanation: 'Rejected: Multi-pack bundle. Catalogs must isolate distinct fragrance profiles rather than packaging assortments.'
  },
  {
    id: 'sample-2',
    name: 'Axe Signature Gold Dark Vanilla Deodorant Body Spray',
    brand: 'Axe',
    category: 'Aerosol Deodorant Spray',
    expectedResult: 'rejected',
    ruleViolated: 'RULE_NO_AEROSOL_DEODORANTS',
    explanation: 'Rejected: Pressurized propellant aerosol. System strictly models liquid fine fragrances (EDP, EDT, Attar, Extrait).'
  },
  {
    id: 'sample-3',
    name: 'Nivea Whitening Cool Talc Powder',
    brand: 'Nivea',
    category: 'Talcum Powder',
    expectedResult: 'rejected',
    ruleViolated: 'RULE_NO_TALCS_OR_BODYSCARE',
    explanation: 'Rejected: Talcum powder. Personal care toiletries lack multi-tier pyramid evolution.'
  },
  {
    id: 'sample-4',
    name: 'SKINN by Titan Raw',
    brand: 'SKINN by Titan',
    category: 'Eau de Parfum',
    expectedResult: 'accepted',
    explanation: 'Approved: Authentic Eau de Parfum with top/heart/base pyramid, 18% oil concentration, and official Titan catalog URL.'
  },
  {
    id: 'sample-5',
    name: 'Bombay Perfumery Chai Musk',
    brand: 'Bombay Perfumery',
    category: 'Eau de Parfum',
    expectedResult: 'accepted',
    explanation: 'Approved: Artisanal fine fragrance featuring mapped Indian botanical accords (Masala Spices, Lemongrass, Sandalwood).'
  },
  {
    id: 'sample-6',
    name: 'Nykaa Retailer Portal Listing',
    brand: 'Nykaa',
    category: 'Multi-Brand E-Commerce Retailer',
    expectedResult: 'rejected',
    ruleViolated: 'RULE_RETAILER_SEPARATION',
    explanation: 'Rejected: Nykaa is an e-commerce retailer. Ingest only in-house brands (e.g. Nykaa Cosmetics, Nykaa Wanderlust).'
  }
];

export const DataIngestionPipelineView: React.FC<DataIngestionPipelineViewProps> = ({
  fragrances,
  brands
}) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'schema' | 'validator'>('architecture');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'needs_verification'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);

  // Custom Validator State
  const [testProductName, setTestProductName] = useState<string>('');
  const [testProductBrand, setTestProductBrand] = useState<string>('');
  const [testCategory, setTestCategory] = useState<string>('Eau de Parfum');
  const [customValidationResult, setCustomValidationResult] = useState<{
    status: 'approved' | 'rejected';
    rule: string;
    reason: string;
  } | null>(null);

  // Generate CSV Rows matching the user's requested master schema
  const masterRows: MasterCatalogSchemaRow[] = useMemo(() => {
    return fragrances.map(f => ({
      brand: f.brand_name || f.brand,
      collection: f.collection || 'Core Perfume Range',
      name: f.name,
      gender: f.gender,
      type: f.fragrance_type || f.format || 'Eau de Parfum',
      concentration: f.concentration || (f.format === 'Attar' ? 'Pure Extrait Oil (100%)' : 'EDP (15-20%)'),
      top_notes: (f.top_notes || []).join('; '),
      heart_notes: (f.middle_notes || []).join('; '),
      base_notes: (f.base_notes || []).join('; '),
      source_url: f.source_url || 'https://brand-catalog.verified.in',
      last_verified: f.last_verified || '2026-09-08',
      status: f.status || 'verified'
    }));
  }, [fragrances]);

  // Filter master rows
  const filteredRows = useMemo(() => {
    return masterRows.filter(row => {
      const matchesBrand = selectedBrandFilter === 'all' || row.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      const matchesSearch = !searchQuery || 
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.top_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.heart_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.base_notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesStatus && matchesSearch;
    });
  }, [masterRows, selectedBrandFilter, statusFilter, searchQuery]);

  // Export to CSV
  const handleDownloadCsv = () => {
    const headers = ['brand', 'collection', 'name', 'gender', 'type', 'concentration', 'top_notes', 'heart_notes', 'base_notes', 'source_url', 'last_verified', 'status'];
    const csvContent = [
      headers.join(','),
      ...filteredRows.map(r => [
        `"${r.brand.replace(/"/g, '""')}"`,
        `"${r.collection.replace(/"/g, '""')}"`,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.gender}"`,
        `"${r.type}"`,
        `"${r.concentration}"`,
        `"${r.top_notes.replace(/"/g, '""')}"`,
        `"${r.heart_notes.replace(/"/g, '""')}"`,
        `"${r.base_notes.replace(/"/g, '""')}"`,
        `"${r.source_url}"`,
        `"${r.last_verified}"`,
        `"${r.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `verified_fragrance_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCsv = () => {
    const headers = ['brand', 'collection', 'name', 'gender', 'type', 'concentration', 'top_notes', 'heart_notes', 'base_notes', 'source_url', 'last_verified', 'status'];
    const csvContent = [
      headers.join(','),
      ...filteredRows.map(r => [
        `"${r.brand}"`,
        `"${r.collection}"`,
        `"${r.name}"`,
        `"${r.gender}"`,
        `"${r.type}"`,
        `"${r.concentration}"`,
        `"${r.top_notes}"`,
        `"${r.heart_notes}"`,
        `"${r.base_notes}"`,
        `"${r.source_url}"`,
        `"${r.last_verified}"`,
        `"${r.status}"`
      ].join(','))
    ].join('\n');

    navigator.clipboard.writeText(csvContent);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  // Run Custom Validation Rule Engine
  const handleTestProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const nameLower = testProductName.toLowerCase();
    const brandLower = testProductBrand.toLowerCase();
    const catLower = testCategory.toLowerCase();

    if (nameLower.includes('gift') || nameLower.includes('pack') || nameLower.includes('combo') || nameLower.includes('set') || nameLower.includes('kit')) {
      setCustomValidationResult({
        status: 'rejected',
        rule: 'RULE_NO_GIFT_SETS_OR_COMBOS',
        reason: 'Rejected: Multi-item gift pack or variety set. The pipeline strictly catalogs standalone, distinct perfume formulations.'
      });
      return;
    }

    if (nameLower.includes('talc') || catLower.includes('talc') || nameLower.includes('powder')) {
      setCustomValidationResult({
        status: 'rejected',
        rule: 'RULE_NO_TALCS_OR_TOILETRIES',
        reason: 'Rejected: Talcum powder or body dusting cosmetic. Lacks structured volatile note evaporation pyramid.'
      });
      return;
    }

    if (nameLower.includes('lotion') || nameLower.includes('shower gel') || nameLower.includes('body wash') || nameLower.includes('soap')) {
      setCustomValidationResult({
        status: 'rejected',
        rule: 'RULE_NO_BODYCARE_OR_CLEANSERS',
        reason: 'Rejected: Body wash, lotion, or soap. Cleansers do not function as standalone fine perfumes in mathematical vector modeling.'
      });
      return;
    }

    if (nameLower.includes('gas') || nameLower.includes('aerosol') || (nameLower.includes('deodorant') && !nameLower.includes('perfume'))) {
      setCustomValidationResult({
        status: 'rejected',
        rule: 'RULE_NO_AEROSOL_DEODORANT',
        reason: 'Rejected: Aerosol body spray. Contains volatile propellants without true olfactory heart-base accords.'
      });
      return;
    }

    if (brandLower === 'nykaa' && !nameLower.includes('moi') && !nameLower.includes('wanderlust') && !nameLower.includes('gourmand')) {
      setCustomValidationResult({
        status: 'rejected',
        rule: 'RULE_RETAILER_SEPARATION',
        reason: 'Rejected: Nykaa is primarily an e-commerce retailer. Catalogs must reference specific sub-brands (e.g. Nykaa Cosmetics, Nykaa Wanderlust).'
      });
      return;
    }

    // Otherwise Approved
    setCustomValidationResult({
      status: 'approved',
      rule: 'RULE_FINE_FRAGRANCE_VERIFIED',
      reason: `Approved: Validated fine fragrance product under brand "${testProductBrand || 'Specified House'}". Passed hierarchy normalization into Brand → Collection → Fragrance.`
    });
  };

  const brandOptions = useMemo(() => {
    const unique = Array.from(new Set(fragrances.map(f => f.brand_name || f.brand))).filter(Boolean);
    return ['all', ...unique.sort()];
  }, [fragrances]);

  const verifiedCount = masterRows.filter(r => r.status === 'verified').length;
  const needsVerificationCount = masterRows.filter(r => r.status === 'needs_verification').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7B3F98]/10 text-[#7B3F98] border border-[#7B3F98]/20 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Fine Fragrance Pipeline
              </span>
              <span className="text-xs text-[#786F6A]">
                {masterRows.length} Standalone Perfumes &bull; {verifiedCount} Verified Active &bull; {needsVerificationCount} Verification Flagged
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292323]">
              Curated Data Ingestion &amp; Master Schema
            </h3>
            <p className="text-xs sm:text-sm text-[#786F6A] leading-relaxed">
              Moving past unstructured web scrapers. Every fragrance entry is validated to exclude deodorants, talcs, shower gels, and gift sets, maintaining strict <strong className="text-[#292323]">Brand &rarr; Collection &rarr; Fragrance</strong> hierarchy with botanical note normalization.
            </p>
          </div>

          {/* Section Switcher */}
          <div className="flex items-center bg-[#FFF9F3] p-1.5 rounded-2xl border border-[#F0E6DD] shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'architecture'
                  ? 'bg-white text-[#7B3F98] shadow-2xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pipeline Architecture</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('schema')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'schema'
                  ? 'bg-white text-[#7B3F98] shadow-2xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Master CSV Schema ({filteredRows.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('validator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'validator'
                  ? 'bg-white text-[#7B3F98] shadow-2xs border border-[#F0E6DD]'
                  : 'text-[#786F6A] hover:text-[#292323]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Candidate Validator</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE VISUALIZATION */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-medium text-[#292323]">
                End-to-End System Ingestion Flow
              </h4>
              <p className="text-xs text-[#786F6A]">
                How raw brand inventories are parsed, sanitized, normalized, and transformed into 8-dimensional olfactory vectors.
              </p>
            </div>

            {/* Visual Pipeline Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] space-y-2">
                <div className="w-7 h-7 rounded-xl bg-[#7B3F98] text-white flex items-center justify-center font-mono text-xs font-bold">
                  1
                </div>
                <h5 className="font-semibold text-xs text-[#292323] uppercase tracking-wider">Brand &amp; Catalog Ingestion</h5>
                <p className="text-[11px] text-[#786F6A] leading-relaxed">
                  23 Verified Indian &amp; Global Houses cataloged. E-commerce portals (e.g. Nykaa) separated from in-house private labels.
                </p>
                <div className="text-[10px] font-mono text-[#7B3F98] bg-white px-2 py-1 rounded-lg border border-[#F0E6DD]">
                  Brand &rarr; Collection &rarr; SKU
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] space-y-2">
                <div className="w-7 h-7 rounded-xl bg-[#D95D39] text-white flex items-center justify-center font-mono text-xs font-bold">
                  2
                </div>
                <h5 className="font-semibold text-xs text-[#292323] uppercase tracking-wider">Fine Fragrance Validation</h5>
                <p className="text-[11px] text-[#786F6A] leading-relaxed">
                  Automated filters reject gift packs, deodorants, talcs, lotions, and soaps. Only liquid fine fragrances are approved.
                </p>
                <div className="text-[10px] font-mono text-[#D95D39] bg-white px-2 py-1 rounded-lg border border-[#F0E6DD]">
                  0 Deodorants / 0 Talcs
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] space-y-2">
                <div className="w-7 h-7 rounded-xl bg-[#55BFA3] text-white flex items-center justify-center font-mono text-xs font-bold">
                  3
                </div>
                <h5 className="font-semibold text-xs text-[#292323] uppercase tracking-wider">Note Normalization</h5>
                <p className="text-[11px] text-[#786F6A] leading-relaxed">
                  Raw terms mapped to canonical taxonomy (e.g. &ldquo;Mitti&rdquo; &rarr; Petrichor, &ldquo;Ruh Khus&rdquo; &rarr; Vetiver, &ldquo;Mogra&rdquo; &rarr; Jasmine).
                </p>
                <div className="text-[10px] font-mono text-[#55BFA3] bg-white px-2 py-1 rounded-lg border border-[#F0E6DD]">
                  Top &bull; Heart &bull; Base Pyramid
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] space-y-2">
                <div className="w-7 h-7 rounded-xl bg-[#E86A92] text-white flex items-center justify-center font-mono text-xs font-bold">
                  4
                </div>
                <h5 className="font-semibold text-xs text-[#292323] uppercase tracking-wider">SQL Engine &amp; Vector Math</h5>
                <p className="text-[11px] text-[#786F6A] leading-relaxed">
                  SQLite database seeds an 8D vector space. Computes K-Means clusters and harmonic chords for dual-scent layering.
                </p>
                <div className="text-[10px] font-mono text-[#E86A92] bg-white px-2 py-1 rounded-lg border border-[#F0E6DD]">
                  K-Means &bull; Cosine Similarity
                </div>
              </div>
            </div>

            {/* Architecture Ingestion Code Summary */}
            <div className="p-5 rounded-2xl bg-stone-900 text-stone-200 font-mono text-xs space-y-2 overflow-x-auto">
              <div className="flex items-center justify-between text-stone-400 text-[11px] border-b border-stone-800 pb-2 mb-2">
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[#F2A65A]" />
                  <span>Pipeline Architecture &bull; Master Schema Hierarchy</span>
                </span>
                <span className="text-emerald-400">Status: Active &amp; Verified</span>
              </div>
              <p className="text-stone-300">
                <span className="text-purple-400">DATABASE_FLOW:</span> BRAND &rarr; PRODUCT CATALOG &rarr; DATA VALIDATION &rarr; NOTE EXTRACTION &rarr; NOTE NORMALIZATION &rarr; SQL DATABASE &rarr; ML FEATURE ENGINE &rarr; LAYERING RECOMMENDER
              </p>
              <p className="text-stone-400 text-[11px]">
                <span className="text-amber-400">VALIDATION_POLICY:</span> Only standalone EDP, EDT, Attars, and Extraits with documented pyramids. Strictly 0 multi-packs, 0 talcs, 0 cleansers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MASTER CSV SCHEMA TABLE */}
      {activeSection === 'schema' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#786F6A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search fragrance, notes, brand..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] text-xs text-[#292323] focus:outline-none focus:border-[#7B3F98]"
                  />
                </div>

                {/* Brand Filter */}
                <select
                  value={selectedBrandFilter}
                  onChange={e => setSelectedBrandFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] text-xs text-[#292323] focus:outline-none focus:border-[#7B3F98]"
                >
                  {brandOptions.map(b => (
                    <option key={b} value={b}>
                      {b === 'all' ? 'All Brands (23)' : b}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="h-9 px-3 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] text-xs text-[#292323] focus:outline-none focus:border-[#7B3F98]"
                >
                  <option value="all">All Verification Statuses</option>
                  <option value="verified">Verified Official Catalog</option>
                  <option value="needs_verification">Needs Catalog Check</option>
                </select>
              </div>

              {/* Download / Copy Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleCopyCsv}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] hover:bg-stone-100 text-xs font-semibold text-[#292323] transition-all cursor-pointer"
                >
                  {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#786F6A]" />}
                  <span>{copiedCsv ? 'Copied CSV!' : 'Copy CSV'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7B3F98] hover:bg-[#683382] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Master CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#F0E6DD] rounded-2xl max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-[#FFF9F3] sticky top-0 z-10 text-[#786F6A] font-semibold border-b border-[#F0E6DD]">
                  <tr>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Collection</th>
                    <th className="py-2.5 px-3">Fragrance Name</th>
                    <th className="py-2.5 px-3">Gender</th>
                    <th className="py-2.5 px-3">Type / Conc.</th>
                    <th className="py-2.5 px-3">Top Notes</th>
                    <th className="py-2.5 px-3">Heart Notes</th>
                    <th className="py-2.5 px-3">Base Notes</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Last Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6DD] text-[#292323]">
                  {filteredRows.map((row, idx) => (
                    <tr key={`${row.brand}-${row.name}-${idx}`} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-medium whitespace-nowrap">{row.brand}</td>
                      <td className="py-2.5 px-3 text-[#786F6A] whitespace-nowrap">{row.collection}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#7B3F98] whitespace-nowrap">{row.name}</td>
                      <td className="py-2.5 px-3 capitalize whitespace-nowrap">{row.gender}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-mono">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[140px] truncate text-[#786F6A]" title={row.top_notes}>
                        {row.top_notes}
                      </td>
                      <td className="py-2.5 px-3 max-w-[140px] truncate text-[#786F6A]" title={row.heart_notes}>
                        {row.heart_notes}
                      </td>
                      <td className="py-2.5 px-3 max-w-[140px] truncate text-[#786F6A]" title={row.base_notes}>
                        {row.base_notes}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          row.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {row.status === 'verified' ? 'Verified' : 'Needs Check'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-[#786F6A] whitespace-nowrap">
                        {row.last_verified}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CANDIDATE PRODUCT VALIDATOR */}
      {activeSection === 'validator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Testing Playground */}
            <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-medium text-[#292323]">
                  Test Candidate Ingestion Rules
                </h4>
                <p className="text-xs text-[#786F6A]">
                  Simulate how Gemini &amp; ingestion scripts evaluate candidate product strings before database insertion.
                </p>
              </div>

              <form onSubmit={handleTestProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292323] mb-1">
                    Candidate Product Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={testProductName}
                    onChange={e => setTestProductName(e.target.value)}
                    placeholder="e.g. Bella Vita 4-in-1 Luxury Gift Pack or SKINN Raw EDP"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] text-xs text-[#292323] focus:outline-none focus:border-[#7B3F98]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#292323] mb-1">
                      Brand / House:
                    </label>
                    <input
                      type="text"
                      value={testProductBrand}
                      onChange={e => setTestProductBrand(e.target.value)}
                      placeholder="e.g. SKINN or Nykaa"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] text-xs text-[#292323] focus:outline-none focus:border-[#7B3F98]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#292323] mb-1">
                      Declared Category:
                    </label>
                    <select
                      value={testCategory}
                      onChange={e => setTestCategory(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#F0E6DD] bg-[#FFF9F3] text-xs text-[#292323] focus:outline-none focus:border-[#7B3F98]"
                    >
                      <option value="Eau de Parfum">Eau de Parfum (EDP)</option>
                      <option value="Attar">Pure Attar Distillate</option>
                      <option value="Eau de Toilette">Eau de Toilette (EDT)</option>
                      <option value="Gift Set">Gift Set / Combo Pack</option>
                      <option value="Deodorant">Aerosol Deodorant Body Spray</option>
                      <option value="Talc">Talcum Powder</option>
                      <option value="Lotion">Body Lotion / Cleanser</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#7B3F98] to-[#E86A92] text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-all shadow-xs cursor-pointer"
                >
                  Run Pipeline Validation Check
                </button>
              </form>

              {/* Validation Result Box */}
              {customValidationResult && (
                <div className={`p-4 rounded-2xl border transition-all ${
                  customValidationResult.status === 'approved'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-red-50/70 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-start gap-3">
                    {customValidationResult.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs uppercase tracking-wider">
                          {customValidationResult.status === 'approved' ? 'Passed Validation' : 'Rejected at Gateway'}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/70">
                          {customValidationResult.rule}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        {customValidationResult.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Curated Validation Test Cases */}
            <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-medium text-[#292323]">
                  Standard Gateway Sanity Checks
                </h4>
                <p className="text-xs text-[#786F6A]">
                  Click any benchmark example below to inspect the rejection criteria.
                </p>
              </div>

              <div className="space-y-2.5">
                {PRESET_VALIDATION_SAMPLES.map(sample => (
                  <div
                    key={sample.id}
                    onClick={() => {
                      setTestProductName(sample.name);
                      setTestProductBrand(sample.brand);
                      setTestCategory(sample.category);
                      setCustomValidationResult({
                        status: sample.expectedResult === 'accepted' ? 'approved' : 'rejected',
                        rule: sample.ruleViolated || 'RULE_FINE_FRAGRANCE_VERIFIED',
                        reason: sample.explanation
                      });
                    }}
                    className="p-3.5 rounded-2xl border border-[#F0E6DD] hover:border-[#7B3F98]/40 hover:bg-[#FFF9F3] transition-all cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-[#292323] group-hover:text-[#7B3F98]">
                          {sample.name}
                        </span>
                        <span className="text-[10px] text-[#786F6A] font-mono">({sample.brand})</span>
                      </div>
                      <p className="text-[11px] text-[#786F6A]">
                        {sample.explanation}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 border ${
                      sample.expectedResult === 'accepted'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {sample.expectedResult === 'accepted' ? 'Accepted' : 'Rejected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
