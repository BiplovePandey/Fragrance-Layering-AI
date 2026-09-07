import React, { useEffect, useState } from 'react';
import { Sparkles, Check, Droplets } from 'lucide-react';

interface RecommendationLoadingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

const STEPS = [
  'Analyzing your olfactory vibe & affinities...',
  'Extracting complementary chord matrices...',
  'Exploring Indian attars & global luxury notes...',
  'Testing chemistry, sillage & vapor pressures...',
  '✨ Composing your signature layering ritual!'
];

export const RecommendationLoadingModal: React.FC<RecommendationLoadingModalProps> = ({
  isOpen,
  onFinish
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 450);
          return prev;
        }
      });
    }, 420);

    return () => clearInterval(interval);
  }, [isOpen, onFinish]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#F0E6DD] p-8 max-w-sm w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Animated Mist Blend Background */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#E86A92]/20 blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#F2A65A]/20 blur-2xl animate-pulse pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Center Orb */}
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7B3F98] via-[#E86A92] to-[#F2A65A] animate-spin opacity-80 blur-xs" style={{ animationDuration: '3s' }} />
            <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner text-2xl">
              <Droplets className="w-7 h-7 text-[#7B3F98] animate-bounce-short" />
            </div>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#7B3F98] px-2.5 py-0.5 rounded-full bg-[#F9F3FC] border border-[#E9D9F3] mb-2">
            Harmonic Engine Active
          </span>

          <h3 className="font-serif text-2xl font-semibold text-[#292323]">
            Curating Your Chords
          </h3>

          <p className="text-xs text-[#786F6A] mt-1 h-8 flex items-center justify-center font-medium">
            {STEPS[currentStepIndex]}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-5">
            <div
              className="h-full bg-gradient-to-r from-[#7B3F98] via-[#E86A92] to-[#F2A65A] transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
