import React, { useState } from 'react';
import { POPULAR_NOTE_BUBBLES, InteractiveNoteInfo } from '../theme.js';
import { Sparkles, X, Heart, Compass, ArrowRight } from 'lucide-react';

interface FloatingNoteBubblesProps {
  onSelectNoteToFilter?: (noteName: string) => void;
  onAddNoteToPreferences?: (noteName: string) => void;
}

export const FloatingNoteBubbles: React.FC<FloatingNoteBubblesProps> = ({
  onSelectNoteToFilter,
  onAddNoteToPreferences
}) => {
  const [selectedNote, setSelectedNote] = useState<InteractiveNoteInfo | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4EE] text-[#991B4C] text-[11px] font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E86A92]" />
            <span>Interactive Olfactory Bubbles</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292323]">
            Explore Floating Notes
          </h3>
          <p className="text-xs text-[#786F6A]">
            Tap any note bubble to unlock its heritage story, cultural origin, and ideal layering companions.
          </p>
        </div>
      </div>

      {/* Floating Bubbles Canvas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-[#FFF3EB] to-[#FCEEE6] border border-[#F0E6DD] p-6 sm:p-8 shadow-xs">
        {/* Ambient subtle glow backdrops */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#E86A92]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#F2A65A]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-[#55BFA3]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
          {POPULAR_NOTE_BUBBLES.map((note, index) => {
            const isFloatingUp = index % 2 === 0;
            return (
              <button
                key={note.id}
                id={`bubble-note-${note.id}`}
                type="button"
                onClick={() => setSelectedNote(note)}
                className={`group relative px-4 py-2.5 rounded-full bg-gradient-to-r ${note.gradient} border shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2.5 ${
                  isFloatingUp ? 'animate-float-slow' : 'animate-float-reverse'
                }`}
                style={{
                  borderColor: note.borderColor,
                  animationDelay: `${index * 0.4}s`
                }}
              >
                <span className="text-xl sm:text-2xl group-hover:scale-125 transition-transform duration-200">
                  {note.emoji}
                </span>
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#292323] leading-tight">
                    {note.name}
                  </div>
                  <div className="text-[10px] text-[#786F6A] font-mono">
                    {note.hindiName || note.family}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note Detail Modal / Popover */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedNote.gradient} border flex items-center justify-center text-3xl shadow-sm shrink-0`}
                style={{ borderColor: selectedNote.borderColor }}
              >
                {selectedNote.emoji}
              </div>
              <div className="pr-6">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {selectedNote.family} Family
                </span>
                <h4 className="font-serif text-2xl font-semibold text-[#292323] mt-1 leading-tight">
                  {selectedNote.name}
                </h4>
                {selectedNote.hindiName && (
                  <p className="text-xs text-[#D95D39] font-medium mt-0.5">
                    Traditional: {selectedNote.hindiName}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] space-y-1.5">
              <div className="text-[11px] font-semibold text-[#7B3F98] uppercase tracking-wider">
                Vibe &amp; Sillage
              </div>
              <p className="text-xs text-[#292323] font-medium leading-snug">
                {selectedNote.vibe}
              </p>
            </div>

            <p className="text-xs text-[#786F6A] leading-relaxed">
              {selectedNote.description}
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                Cultural Heritage
              </div>
              <div className="flex items-center gap-1.5 text-[#292323] font-medium">
                <Compass className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>{selectedNote.culturalOrigin}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                Pairs Magically With
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNote.pairsBestWith.map(pair => (
                  <span
                    key={pair}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF6F0] text-[#634226] border border-[#EDE0CE]"
                  >
                    + {pair}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              {onAddNoteToPreferences && (
                <button
                  type="button"
                  onClick={() => {
                    onAddNoteToPreferences(selectedNote.name);
                    setSelectedNote(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#7B3F98] hover:bg-[#683382] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-[#E86A92]" />
                  <span>Add to My Notes</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
