import React from 'react';
import { motion } from 'motion/react';

interface ChapterDividerProps {
  chapter: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const ChapterDivider: React.FC<ChapterDividerProps> = ({
  chapter,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`my-12 sm:my-16 flex flex-col items-center text-center select-none ${className}`}
    >
      {/* Decorative Hairline Rule with Amber Center Glyph */}
      <div className="w-full max-w-xl flex items-center gap-4 mb-3">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E3DACB] to-[#D5C7B3]" />
        <div className="flex items-center gap-1.5 px-2 text-[#B45309]">
          <span className="w-1.5 h-1.5 rotate-45 border border-amber-600/60 bg-amber-100/80" />
          <span className="w-1 h-1 rounded-full bg-amber-700/60" />
          <span className="w-1.5 h-1.5 rotate-45 border border-amber-600/60 bg-amber-100/80" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E3DACB] to-[#D5C7B3]" />
      </div>

      {/* Chapter Marker */}
      <span className="font-mono text-[10px] tracking-[0.25em] text-[#8A7E74] uppercase font-semibold">
        {chapter}
      </span>

      {/* Chapter Title in Cinzel / Serif */}
      <h3 className="font-brand text-sm sm:text-base tracking-[0.2em] text-[#1A1613] uppercase font-medium mt-1">
        {title}
      </h3>

      {/* Poetic Subtitle */}
      {subtitle && (
        <p className="font-serif italic text-xs sm:text-sm text-[#7A6F66] mt-0.5 max-w-md">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
