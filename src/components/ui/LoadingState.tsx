import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export type LoadingPhrase =
  | 'reading_atmosphere'
  | 'tracing_accord'
  | 'calculating_harmony'
  | 'following_drydown'
  | 'composing_chord'
  | 'custom';

export interface LoadingStateProps {
  phrase?: LoadingPhrase;
  customMessage?: string;
  subtext?: string;
  className?: string;
}

const PHRASE_MAP: Record<LoadingPhrase, string> = {
  reading_atmosphere: 'Reading the atmosphere…',
  tracing_accord: 'Tracing the accord…',
  calculating_harmony: 'Calculating harmony…',
  following_drydown: 'Following the drydown…',
  composing_chord: 'Composing your chord…',
  custom: 'Calibrating the atelier…',
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  phrase = 'reading_atmosphere',
  customMessage,
  subtext,
  className = '',
}) => {
  const message = customMessage || PHRASE_MAP[phrase];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-center select-none ${className}`}
    >
      <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
        {/* Soft breathing halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-500/15 filter blur-md"
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Rotating ring */}
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
        <Sparkles className="w-5 h-5 text-amber-600 absolute" />
      </div>

      <h3 className="font-display text-xl sm:text-2xl text-[#1A1613] font-medium tracking-tight">
        {message}
      </h3>

      {subtext && (
        <p className="text-xs sm:text-sm text-[#7A6F66] mt-1.5 max-w-sm leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
