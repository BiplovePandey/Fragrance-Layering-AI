import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  FlaskConical,
  Compass,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Thermometer,
  Layers,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import {
  Fragrance,
  WeatherCondition,
  LivingOlfactoryDNA,
  PersonalScentMemory
} from '../types.js';
import { olfactoryIntelligence } from '../services/olfactoryIntelligence.js';
import { MotionModal, MotionButton } from '../motion/index.js';
import { awardXP } from '../services/gamificationEngine.js';

interface AiPerfumerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allFragrances: Fragrance[];
  ownedFragrances: Fragrance[];
  weather: WeatherCondition;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedFragranceIds?: number[];
  timestamp: string;
}

export const AiPerfumerDrawer: React.FC<AiPerfumerDrawerProps> = ({
  isOpen,
  onClose,
  allFragrances,
  ownedFragrances,
  weather,
  onSendToLab,
  onSelectFragranceForChamber
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: `Salutations. I am your Olfactory Intelligence Atelier Assistant. I am grounded in your Living Olfactory DNA (${olfactoryIntelligence.getLivingDNA().personalityTitle}), your personal scent memory, current atmosphere (${weather.temperature_c}°C, ${weather.season}), and your wardrobe of ${ownedFragrances.length} flacons. How may I guide your senses today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const quickPrompts = [
    'What should I wear tonight?',
    'Fix my layer: it is too sweet',
    'Which Indian heritage attar should I explore?',
    'What should I buy next?',
    'Find a fragrance twin for my DNA',
    'Curate a 4-day warm weather travel capsule'
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      let reply = '';
      let recommendedIds: number[] = [];
      const lower = text.toLowerCase();
      const dna = olfactoryIntelligence.getLivingDNA();

      if (lower.includes('what should i wear') || lower.includes('wear tonight') || lower.includes('wear today')) {
        const rec = olfactoryIntelligence.recommendWhatShouldIWear(
          allFragrances,
          ownedFragrances,
          weather,
          'Elevated & Magnetic',
          lower.includes('tonight') ? 'Evening Dinner & Date' : 'Signature'
        );
        reply = `Based on your living DNA profile (${dna.personalityTitle}) and current ${weather.temperature_c}°C atmosphere, I recommend **${rec.fragrance.name}** by ${rec.fragrance.brand_name || rec.fragrance.brand}.\n\n*Why this works:* ${rec.reasoning.weatherReasoning}\n\n*Layering option:* Pairing it with ${rec.layerPartner?.name || 'a woody anchor'} elevates sillage balance to ${rec.compatibilityScore}%.`;
        recommendedIds = [rec.fragrance.id, ...(rec.layerPartner ? [rec.layerPartner.id] : [])];
      } else if (lower.includes('too sweet') || lower.includes('fix my layer')) {
        const fragA = ownedFragrances[0] || allFragrances[0];
        const fragB = ownedFragrances[1] || allFragrances[1];
        const diag = olfactoryIntelligence.diagnoseAndFixLayer(fragA, fragB, undefined, 'too_sweet');
        reply = `**Layer Diagnosis: Sweetness Saturation**\n\n${diag.identifiedCauses[0]?.accordOrNote || 'High vanilla/amber concentration'}.\n\n**Action:** ${diag.recommendedOrder}\n**Ratio:** Apply 1 spray of ${fragA.name} to 3 sprays of ${fragB.name}.\n\n*Pro Tip:* ${diag.suggestedWardrobeAdditions?.[0]?.explanation || 'Introduce a dry earthy vetiver to absorb ethyl maltol molecules.'}`;
        recommendedIds = [fragA.id, fragB.id];
      } else if (lower.includes('indian') || lower.includes('heritage') || lower.includes('attar')) {
        const attar = allFragrances.find(f => f.is_indian_house && (f.description?.includes('mitti') || f.format === 'Attar')) || allFragrances[6];
        reply = `For your ${dna.personalityTitle} sensibilities, explore **${attar.name}** by ${attar.brand_name || attar.brand}.\n\nTraditional hydro-distillation in copper degs captures sacred geosmin and baked earth molecules without chemical adulterants. It grounds modern woody aromatics with unmatched soul.`;
        recommendedIds = [attar.id];
      } else if (lower.includes('buy') || lower.includes('next')) {
        const candidates = allFragrances.filter(f => !ownedFragrances.some(o => o.id === f.id));
        const candidate = candidates[0] || allFragrances[0];
        const advice = olfactoryIntelligence.evaluatePurchaseAdvice(candidate, ownedFragrances);
        reply = `**Purchase Recommendation:**\nI evaluated **${candidate.name}** against your collection.\n\n- Purchase Score: ${advice.score}/100\n- Wardrobe Overlap: ${advice.wardrobeOverlapPct}%\n- Gap Contribution: ${advice.gapContribution}\n\n**Verdict:** ${advice.verdict}`;
        recommendedIds = [candidate.id];
      } else if (lower.includes('twin')) {
        const twin = olfactoryIntelligence.findFragranceTwin(allFragrances);
        reply = `Your mathematical Fragrance Twin is **${twin.fragrance.name}** by ${twin.fragrance.brand_name || twin.fragrance.brand} (${twin.dnaCompatibilityScore}% match).\n\n${twin.narrative}`;
        recommendedIds = [twin.fragrance.id];
      } else if (lower.includes('travel') || lower.includes('capsule')) {
        const capsule = olfactoryIntelligence.buildTravelCapsule('Coastal Destination', 4, 'Warm coastal humidity', 'Smart Casual', ownedFragrances.length >= 3 ? ownedFragrances : allFragrances);
        reply = `**Curated 4-Day Scent Capsule:**\nCoverage: ${capsule.coverageScorePct}%\n\n1. **Day / Heat:** ${capsule.fragrances[0].fragrance.name} — ${capsule.fragrances[0].why}\n2. **Evening / Dinner:** ${capsule.fragrances[1].fragrance.name} — ${capsule.fragrances[1].why}\n3. **Flexible Signature:** ${capsule.fragrances[2].fragrance.name}\n\n*Layer Technique:* ${capsule.suggestedLayerChord?.technique}`;
        recommendedIds = capsule.fragrances.map(f => f.fragrance.id);
      } else {
        // Natural search / conversational inquiry
        const search = olfactoryIntelligence.interpretNaturalLanguageSearch(text, allFragrances);
        reply = `I analyzed your query: "${text}".\n\nInterpreted Olfactory Coordinates: ${search.interpretedMood}.\nTop matching recommendation: **${search.matches[0]?.fragrance.name}** (${search.matches[0]?.matchPercentage}% accord convergence).`;
        recommendedIds = search.matches.slice(0, 2).map(m => m.fragrance.id);
      }

      const assistantMsg: Message = {
        id: `assist_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        recommendedFragranceIds: recommendedIds,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
      awardXP(15, 'ai_perfumer_chat');
    }, 600);
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="relative w-full rounded-3xl bg-[#14110E] border border-amber-600/30 text-stone-200 shadow-2xl overflow-hidden h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-[#181411] to-purple-950/30 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium text-stone-100">
                  AI Atelier Perfumer
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                  Context Aware
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Tuned to your {olfactoryIntelligence.getLivingDNA().personalityTitle} DNA &bull; {weather.temperature_c}°C {weather.season}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            const matchedFrags = (msg.recommendedFragranceIds || [])
              .map(id => allFragrances.find(f => f.id === id))
              .filter(Boolean) as Fragrance[];

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl ${
                    isUser
                      ? 'bg-amber-500/20 border border-amber-500/40 text-stone-100 rounded-tr-sm'
                      : 'bg-white/[0.03] border border-white/[0.08] text-stone-300 rounded-tl-sm'
                  } space-y-2`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-mono text-stone-500 block text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Fragrance Cards attached to message */}
                {matchedFrags.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-[85%] sm:max-w-[75%]">
                    {matchedFrags.map(f => (
                      <div
                        key={f.id}
                        className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <h5 className="font-serif text-sm font-medium text-stone-200 truncate">
                            {f.name}
                          </h5>
                          <span className="text-[10px] text-stone-400 block truncate">
                            {f.brand_name || f.brand} &bull; {f.fragrance_family}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectFragranceForChamber(f);
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 text-[10px] cursor-pointer"
                            title="Inspect in Chamber"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSendToLab(f);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] cursor-pointer"
                            title="Send to Lab"
                          >
                            Lab
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 text-stone-400 text-xs italic font-mono p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Simulating olfactory chords &amp; synthesizing advice...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-6 py-2 border-t border-white/[0.06] bg-black/20 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map(qp => (
            <button
              key={qp}
              type="button"
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-stone-300 whitespace-nowrap cursor-pointer transition"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-[#181411] border-t border-white/[0.08] flex items-center gap-3 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask your AI perfumer (e.g. 'What should I wear tonight?', 'Fix my layer')..."
            className="flex-1 bg-black/40 border border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-stone-200 outline-none focus:border-amber-500/60 transition"
          />

          <MotionButton
            variant="primary"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isProcessing}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 text-stone-100 disabled:opacity-40 cursor-pointer shadow-lg"
          >
            <Send className="w-4 h-4" />
          </MotionButton>
        </div>
      </div>
    </MotionModal>
  );
};
