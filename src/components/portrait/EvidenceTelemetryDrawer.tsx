import React, { useState, useEffect } from 'react';
import {
  Brain,
  Trash2,
  Check,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Lock
} from 'lucide-react';
import { OlfactoryMemorySnapshot } from '../../types.js';
import { api } from '../../services/api.js';

interface EvidenceTelemetryDrawerProps {
  onRecalibrateDNA?: () => void;
}

export const EvidenceTelemetryDrawer: React.FC<EvidenceTelemetryDrawerProps> = ({
  onRecalibrateDNA
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [memorySnapshot, setMemorySnapshot] = useState<OlfactoryMemorySnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.getOlfactoryMemory(1)
      .then(snap => {
        if (isMounted) setMemorySnapshot(snap);
      })
      .catch(err => {
        console.warn('Failed to load olfactory memory:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleClear = async () => {
    if (!window.confirm('Clear all recorded olfactory behavioral telemetry? Your explicit preferences and wardrobe will remain intact.')) {
      return;
    }
    setIsClearing(true);
    try {
      const res = await api.clearBehaviorHistory(1);
      const freshSnap = await api.getOlfactoryMemory(1);
      setMemorySnapshot(freshSnap);
      setClearMessage(`Cleared ${res.deletedCount} telemetry event(s).`);
      setTimeout(() => setClearMessage(null), 4000);
    } catch (err) {
      console.error('Failed to clear behavior history:', err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-8 shadow-xl text-[#FAF5F0] space-y-6">
      {/* Drawer Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#241B15] border border-[#3E3228] text-[#D97706]">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-lab uppercase text-[#D97706] tracking-wider">
                Level 5 • Scientific Transparency
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#241B16] text-[#34D399] text-[10px] font-mono-lab">
                Pure Observation Mode
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAF5F0] font-medium mt-0.5">
              Behavioral Memory &amp; Evidence Telemetry
            </h3>
          </div>
        </div>

        <button className="p-2 rounded-xl bg-[#1F1813] border border-[#3E3228] text-[#A8988B] hover:text-[#FAF5F0] transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className="space-y-6 pt-4 border-t border-[#3E3228] animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#A8988B] max-w-xl">
              Transparent telemetry tracking actual wear sessions, saves, and opens.
              Explicit preferences and implicit observations are strictly segregated.
            </p>

            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing || !memorySnapshot || memorySnapshot.totalEvents === 0}
              className="px-3.5 py-2 rounded-xl border border-[#4A2626] bg-[#2A1616] hover:bg-[#3D1E1E] text-[#FCA5A5] text-xs font-mono-lab transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed self-start sm:self-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Clearing...' : 'Clear Telemetry'}</span>
            </button>
          </div>

          {clearMessage && (
            <div className="p-3 rounded-xl bg-[#172B1E] border border-[#235235] text-[#86EFAC] text-xs font-mono-lab flex items-center gap-2">
              <Check className="w-4 h-4 text-[#34D399]" />
              <span>{clearMessage}</span>
            </div>
          )}

          {/* Metric Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                Total Telemetry Events
              </div>
              <div className="font-serif text-2xl text-[#FAF5F0] font-semibold mt-1">
                {memorySnapshot ? memorySnapshot.totalEvents : 0}
              </div>
              <div className="text-[10px] text-[#A8988B] mt-0.5">
                Wears, opens, saves &amp; chamber visits
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                Memory Confidence
              </div>
              <div className="font-serif text-2xl text-[#FAF5F0] font-semibold mt-1">
                {memorySnapshot ? `${Math.round(memorySnapshot.confidence * 100)}%` : '0%'}
              </div>
              <div className="w-full bg-[#241B16] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#34D399] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((memorySnapshot?.confidence || 0) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                Evidence Segregation
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34D399] mt-2">
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Strictly Separated</span>
              </div>
              <div className="text-[10px] text-[#A8988B] mt-0.5">
                Behavioral signals never overwrite DNA
              </div>
            </div>
          </div>

          {/* Signals Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Explicit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-lab uppercase text-[#FEF3C7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Explicit Inputs ({memorySnapshot?.explicitSignals.length || 0})
                </span>
                <span className="text-[10px] font-mono-lab text-[#8C7D70]">User Ratings</span>
              </div>

              <div className="space-y-2">
                {(!memorySnapshot || memorySnapshot.explicitSignals.length === 0) ? (
                  <div className="p-3 rounded-xl bg-[#17120E] border border-[#3E3228] text-xs text-[#8C7D70] text-center">
                    No explicit fragrance ratings or preference inputs yet.
                  </div>
                ) : (
                  memorySnapshot.explicitSignals.slice(0, 4).map((sig, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#17120E] border border-[#3E3228] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#FAF5F0]">{sig.dimension}</span>
                        <div className="text-[10px] text-[#8C7D70]">{sig.source}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#241B16] text-[#F59E0B] text-[10px] font-mono-lab">
                        {(sig.evidenceStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Implicit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-lab uppercase text-[#FEF3C7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  Implicit Observed ({memorySnapshot?.implicitSignals.length || 0})
                </span>
                <span className="text-[10px] font-mono-lab text-[#8C7D70]">Natural Usage</span>
              </div>

              <div className="space-y-2">
                {(!memorySnapshot || memorySnapshot.implicitSignals.length === 0) ? (
                  <div className="p-3 rounded-xl bg-[#17120E] border border-[#3E3228] text-xs text-[#8C7D70] text-center">
                    No wear rituals or saves recorded yet. Wear a fragrance today to begin observation.
                  </div>
                ) : (
                  memorySnapshot.implicitSignals.slice(0, 4).map((sig, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#17120E] border border-[#3E3228] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#FAF5F0]">{sig.dimension}</span>
                        <div className="text-[10px] text-[#8C7D70]">{sig.source}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#13222B] text-[#38BDF8] text-[10px] font-mono-lab">
                        {(sig.evidenceStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Guarantee Pill */}
          <div className="p-3.5 rounded-xl bg-[#1F1711] border border-[#443122] flex items-start gap-2.5 text-xs text-[#D97706] leading-relaxed">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#F59E0B]" />
            <div>
              <span className="font-semibold text-[#FEF3C7]">Strict Non-Interference Guarantee: </span>
              All telemetry is immutable and observational. Cosine calculations and algorithmic recommendations are mathematically deterministic and never modified silently.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
