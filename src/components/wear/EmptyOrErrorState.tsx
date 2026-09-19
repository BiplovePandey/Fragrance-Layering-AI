import React from 'react';
import { Layers, AlertCircle, RefreshCw, Compass, Edit3 } from 'lucide-react';

interface EmptyOrErrorStateProps {
  type: 'empty_wardrobe' | 'error' | 'no_results';
  errorMessage?: string;
  onRetry?: () => void;
  onSwitchToCatalog?: () => void;
  onEditContext?: () => void;
}

export const EmptyOrErrorState: React.FC<EmptyOrErrorStateProps> = ({
  type,
  errorMessage,
  onRetry,
  onSwitchToCatalog,
  onEditContext
}) => {
  if (type === 'empty_wardrobe') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl liquid-glass border border-white/80 text-center max-w-xl mx-auto space-y-4 shadow-[0_8px_32px_rgba(95,70,40,0.05)]">
        <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1613]">
            No Wardrobe Match Found
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-2 leading-relaxed">
            None of the fragrances currently in your personal wardrobe harmonize with today's specific weather, occasion, or notes filters.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onSwitchToCatalog && (
            <button
              type="button"
              onClick={onSwitchToCatalog}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 border border-amber-500/50 shadow-xs transition cursor-pointer"
            >
              Search Full Fragrance Catalog
            </button>
          )}
          {onEditContext && (
            <button
              type="button"
              onClick={onEditContext}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A5046] hover:text-[#1A1613] bg-white/80 border border-[#E3DACB] transition cursor-pointer"
            >
              Adjust Context Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl liquid-glass border border-rose-200/80 text-center max-w-xl mx-auto space-y-4 shadow-[0_8px_32px_rgba(95,70,40,0.05)]">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-800 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1613]">
            Olfactory Calculation Error
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-2 leading-relaxed">
            {errorMessage || 'Unable to connect with the wear recommendation engine. Please verify connectivity.'}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 transition cursor-pointer flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Calculation</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl liquid-glass border border-white/80 text-center max-w-xl mx-auto space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto">
        <Compass className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1613]">
          No Fragrance Profiles Found
        </h3>
        <p className="text-xs sm:text-sm text-[#5A5046] mt-2 leading-relaxed">
          No catalog fragrances aligned with the provided constraints. Try broadening your occasion or temperature settings.
        </p>
      </div>
      {onEditContext && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onEditContext}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 transition cursor-pointer flex items-center gap-2 mx-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Context</span>
          </button>
        </div>
      )}
    </div>
  );
};
