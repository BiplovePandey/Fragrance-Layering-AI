import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Wind,
  Flame,
  X,
  Radio,
  Sliders,
  Play,
  Pause,
  Check,
  Music,
  Compass
} from 'lucide-react';
import {
  ScentFamilyAtmosphere,
  ATMOSPHERE_PROFILES,
  AtmosphereMeta
} from './AtmosphericFragranceCanvas.js';
import {
  ambientAudioEngine,
  SoundscapeType,
  SOUNDSCAPE_PRESETS
} from '../services/ambientAudioEngine.js';
import { Fragrance } from '../types.js';

interface AmbientAtmosphereControlProps {
  currentAtmosphere: ScentFamilyAtmosphere;
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  activeFragrance?: Fragrance | null;
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function getAtmosphereFromFragrance(frag?: Fragrance | null): ScentFamilyAtmosphere {
  if (!frag) return 'default';
  const allNotes = [
    ...(frag.top_notes || []),
    ...(frag.middle_notes || []),
    ...(frag.base_notes || []),
    frag.fragrance_family || '',
    frag.name || '',
    frag.description || ''
  ].join(' ').toLowerCase();

  if (allNotes.includes('mitti') || allNotes.includes('petrichor') || allNotes.includes('clay') || allNotes.includes('earth') || allNotes.includes('geosmin')) {
    return 'earthy';
  }
  if (allNotes.includes('khus') || allNotes.includes('vetiver') || allNotes.includes('vetivert')) {
    return 'khus';
  }
  if (allNotes.includes('oud') || allNotes.includes('agarwood') || allNotes.includes('amber') || allNotes.includes('incense') || allNotes.includes('smoky') || allNotes.includes('leather')) {
    return 'oud';
  }
  if (allNotes.includes('cedar') || allNotes.includes('pine') || allNotes.includes('juniper') || allNotes.includes('alpine')) {
    return 'alpine';
  }
  if (allNotes.includes('rose') || allNotes.includes('gulab') || allNotes.includes('floral') || allNotes.includes('jasmine') || allNotes.includes('tuberose')) {
    return 'rose';
  }
  if (allNotes.includes('citrus') || allNotes.includes('bergamot') || allNotes.includes('neroli') || allNotes.includes('lemon') || allNotes.includes('mandarin') || allNotes.includes('orange')) {
    return 'citrus';
  }
  if (allNotes.includes('marine') || allNotes.includes('aquatic') || allNotes.includes('sea') || allNotes.includes('salt') || allNotes.includes('ocean')) {
    return 'aquatic';
  }
  if (allNotes.includes('sandalwood') || allNotes.includes('santal') || allNotes.includes('woody') || allNotes.includes('spicy')) {
    return 'woody';
  }
  return 'default';
}

export const AmbientAtmosphereControl: React.FC<AmbientAtmosphereControlProps> = ({
  currentAtmosphere,
  onSetAtmosphere,
  activeFragrance,
  autoSyncEnabled = true,
  onToggleAutoSync,
  isOpen: controlledIsOpen,
  onOpenChange
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    onOpenChange?.(val);
  };
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>(ambientAudioEngine.getActiveSoundscape());
  const [isPlaying, setIsPlaying] = useState<boolean>(ambientAudioEngine.isPlaying());
  const [volume, setVolumeState] = useState<number>(ambientAudioEngine.getVolume());
  const [localAutoSync, setLocalAutoSync] = useState(autoSyncEnabled);

  // Sync state with ambient audio engine
  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setActiveSoundscape(ambientAudioEngine.getActiveSoundscape());
      setIsPlaying(ambientAudioEngine.isPlaying());
      setVolumeState(ambientAudioEngine.getVolume());
    });
    return unsub;
  }, []);

  // Auto-sync atmosphere when active fragrance changes
  useEffect(() => {
    if (localAutoSync && activeFragrance) {
      const targetAtm = getAtmosphereFromFragrance(activeFragrance);
      if (targetAtm !== currentAtmosphere) {
        onSetAtmosphere(targetAtm);
      }
    }
  }, [activeFragrance, localAutoSync, currentAtmosphere, onSetAtmosphere]);

  const activeProfile: AtmosphereMeta = ATMOSPHERE_PROFILES[currentAtmosphere] || ATMOSPHERE_PROFILES.default;

  const handleSelectAtmosphere = (id: ScentFamilyAtmosphere) => {
    onSetAtmosphere(id);
    const profile = ATMOSPHERE_PROFILES[id];
    // If soundscape is not playing and user selected an atmosphere with suggested sound, offer smooth transition
    if (profile?.ambientSoundSuggested && activeSoundscape === 'none') {
      // Keep silent unless user clicked play
    }
  };

  const handleTogglePlay = (soundId?: SoundscapeType) => {
    if (soundId) {
      if (activeSoundscape === soundId && isPlaying) {
        ambientAudioEngine.stopSoundscape();
      } else {
        ambientAudioEngine.startSoundscape(soundId);
      }
    } else {
      if (isPlaying) {
        ambientAudioEngine.stopSoundscape();
      } else {
        // Start currently selected or suggested
        const toPlay = activeSoundscape !== 'none' ? activeSoundscape : (activeProfile.ambientSoundSuggested || 'monsoon_deg');
        ambientAudioEngine.startSoundscape(toPlay);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    ambientAudioEngine.setVolume(val);
  };

  return (
    <>
      {/* Floating Tactical Ambient Trigger (Discreet luxury button in bottom-left corner) */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          id="ambient-atmosphere-trigger-btn"
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#14110E]/90 hover:bg-[#1A1613] border border-white/[0.12] hover:border-amber-500/40 shadow-2xl backdrop-blur-xl transition-all cursor-pointer select-none"
        >
          {/* Luminous Pulsing Glow Bead */}
          <span className="relative flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ backgroundColor: activeProfile.accentColor }}
            />
            <span
              className="relative inline-flex rounded-full h-3 w-3 shadow-sm"
              style={{ backgroundColor: activeProfile.accentColor }}
            />
          </span>

          <div className="flex flex-col text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-stone-200 group-hover:text-amber-300 transition-colors truncate max-w-[130px] sm:max-w-[170px]">
                {activeProfile.name}
              </span>
            </div>
            <span className="text-[9px] font-mono text-stone-400 flex items-center gap-1">
              {isPlaying ? (
                <>
                  <span className="flex items-end gap-0.5 h-2.5 mr-0.5">
                    <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse rounded-full" />
                    <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse delay-75 rounded-full" />
                    <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
                  </span>
                  <span className="text-amber-300">
                    {SOUNDSCAPE_PRESETS.find(s => s.id === activeSoundscape)?.title || 'Audio Active'}
                  </span>
                </>
              ) : (
                <span>Ambiance &bull; Silent</span>
              )}
            </span>
          </div>

          {/* Quick Play/Pause Mini Toggle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            title={isPlaying ? 'Pause Soundscape' : 'Play Heritage Soundscape'}
            className="ml-1 p-1 rounded-lg bg-white/[0.05] hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 transition cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 ml-0.5" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Atmospheric Sanctuary Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#14110E] border border-white/[0.12] shadow-2xl p-6 sm:p-8 space-y-6 text-stone-200 z-10"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Atmospheric Shifting &amp; Olfactory Sanctuary</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-medium tracking-tight">
                    Olfactory Ambiance &amp; Soundscape
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    Calibrate your physical space with accord-reactive lighting and procedural heritage audio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-400 hover:text-stone-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section 1: Accord-Reactive Glow & Atmospheric Profiles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                    1. Accord-Reactive Visual Glow ({Object.keys(ATMOSPHERE_PROFILES).length} Profiles)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !localAutoSync;
                      setLocalAutoSync(nextVal);
                      onToggleAutoSync?.(nextVal);
                      if (nextVal && activeFragrance) {
                        onSetAtmosphere(getAtmosphereFromFragrance(activeFragrance));
                      }
                    }}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                      localAutoSync
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Radio className="w-3 h-3" />
                    <span>Auto-Sync Fragrance: {localAutoSync ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(ATMOSPHERE_PROFILES) as ScentFamilyAtmosphere[]).map((key) => {
                    const profile = ATMOSPHERE_PROFILES[key];
                    const isSelected = currentAtmosphere === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectAtmosphere(key)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative group ${
                          isSelected
                            ? 'bg-white/[0.08] border-amber-500/60 shadow-lg'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.15]'
                        }`}
                      >
                        {/* Glow indicator orb */}
                        <div
                          className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                          style={{
                            backgroundColor: profile.glowColor1.replace('0.16', '0.45').replace('0.20', '0.50'),
                            border: `1px solid ${profile.accentColor}`
                          }}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: profile.accentColor }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-100 truncate">
                              {profile.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5">
                            {profile.subhead}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Procedural Kannauj & Heritage Soundscapes */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block">
                      2. Monsoon &amp; Heritage Soundscape Generator
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Synthesized natively in browser memory via Web Audio API &bull; Zero latency
                    </span>
                  </div>

                  {/* Master Play / Pause */}
                  <button
                    type="button"
                    onClick={() => handleTogglePlay()}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                      isPlaying
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 hover:bg-amber-500/30'
                        : 'bg-white/[0.06] border-white/[0.12] text-stone-200 hover:bg-white/[0.1]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-stone-300" />
                        <span>Start Sound</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sound Presets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SOUNDSCAPE_PRESETS.map((preset) => {
                    const isCurrent = activeSoundscape === preset.id && isPlaying;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleTogglePlay(preset.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isCurrent
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-100 shadow-md'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.15] text-stone-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{preset.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-100">
                              {preset.title}
                            </span>
                            {isCurrent && (
                              <span className="flex items-end gap-0.5 h-3">
                                <span className="w-0.5 h-2 bg-amber-400 animate-pulse rounded-full" />
                                <span className="w-0.5 h-3 bg-amber-400 animate-pulse delay-75 rounded-full" />
                                <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse delay-150 rounded-full" />
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-400 leading-relaxed mt-1">
                            {preset.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sound Volume Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => ambientAudioEngine.toggleMute()}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 cursor-pointer transition shrink-0"
                    title="Toggle Mute"
                  >
                    {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span>Soundscape Volume</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 text-center text-[11px] font-mono text-stone-400">
                Atmosphere &bull; Canvas Reactive Backlight &bull; Alluvial Kannauj Audio Synthesis
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
