import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Check } from 'lucide-react';
import { ScentFamilyAtmosphere } from '../AtmosphericFragranceCanvas.js';

interface AtmosphereSelectorProps {
  currentAtmosphere: ScentFamilyAtmosphere;
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  className?: string;
}

interface AtmosphereItem {
  id: ScentFamilyAtmosphere;
  label: string;
  subhead: string;
  dotColor: string;
  ambientHalo: string;
}

const ATELIER_ATMOSPHERES: AtmosphereItem[] = [
  {
    id: 'rose',
    label: 'Damask Rose',
    subhead: 'Kannauj Petals',
    dotColor: '#FB7185',
    ambientHalo: 'rgba(251, 113, 133, 0.28)'
  },
  {
    id: 'oud',
    label: 'Assam Oud',
    subhead: 'Smoked Resin',
    dotColor: '#D97706',
    ambientHalo: 'rgba(217, 119, 6, 0.28)'
  },
  {
    id: 'citrus',
    label: 'Bergamot',
    subhead: 'Solar Zest',
    dotColor: '#F59E0B',
    ambientHalo: 'rgba(245, 158, 11, 0.28)'
  },
  {
    id: 'earthy',
    label: 'Mitti Earth',
    subhead: 'Monsoon Clay',
    dotColor: '#EA580C',
    ambientHalo: 'rgba(234, 88, 12, 0.28)'
  },
  {
    id: 'aquatic',
    label: 'Marine Mist',
    subhead: 'Oceanic Ozone',
    dotColor: '#0284C7',
    ambientHalo: 'rgba(2, 132, 199, 0.28)'
  },
  {
    id: 'woody',
    label: 'Mysore Sandal',
    subhead: 'Lactonic Santal',
    dotColor: '#CA8A04',
    ambientHalo: 'rgba(202, 138, 4, 0.28)'
  }
];

export const AtmosphereSelector: React.FC<AtmosphereSelectorProps> = ({
  currentAtmosphere,
  onSetAtmosphere,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
      {/* Label */}
      <div className="flex items-center gap-2">
        <Droplets className="w-3.5 h-3.5 text-amber-700" />
        <span className="font-brand text-[11px] uppercase tracking-[0.18em] text-[#7A6F66] font-medium">
          Atelier Atmosphere
        </span>
      </div>

      {/* Tactile Pills */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {ATELIER_ATMOSPHERES.map((atm) => {
          const isActive = currentAtmosphere === atm.id;
          return (
            <button
              key={atm.id}
              type="button"
              onClick={() => onSetAtmosphere(atm.id)}
              className={`group relative px-3 py-1.5 rounded-full text-xs transition-all duration-500 cursor-pointer flex items-center gap-2 select-none border ${
                isActive
                  ? 'bg-white text-[#1A1613] font-semibold border-amber-400 shadow-[0_4px_16px_rgba(217,119,6,0.18),_inset_0_1px_1px_rgba(255,255,255,1)]'
                  : 'bg-white/50 hover:bg-white/80 text-[#5A5046] hover:text-[#1A1613] border-[#E8DFD3]/80 hover:border-amber-300 backdrop-blur-sm shadow-2xs'
              }`}
            >
              {/* Glowing Inner Illumination when Active */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-full opacity-35 blur-xs pointer-events-none transition-opacity duration-700"
                  style={{ backgroundColor: atm.ambientHalo }}
                />
              )}

              {/* Tiny Accord Dot with Radial Glow */}
              <span
                className="relative z-10 w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                style={{
                  backgroundColor: atm.dotColor,
                  boxShadow: isActive ? `0 0 8px ${atm.dotColor}` : undefined
                }}
              />

              <span className="relative z-10 tracking-tight text-[11px]">
                {atm.label}
              </span>

              {isActive && (
                <Check className="relative z-10 w-3 h-3 text-amber-700 ml-0.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
