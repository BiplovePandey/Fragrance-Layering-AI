import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FlaskConical,
  Flame,
  Award,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MotionModal, MotionButton } from '../motion/index.js';
import { awardXP } from '../services/gamificationEngine.js';

interface ScentAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
  scientificPrinciple: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const ScentAcademyModal: React.FC<ScentAcademyModalProps> = ({ isOpen, onClose }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>('evaporation_kinetics');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const lessons: Lesson[] = [
    {
      id: 'evaporation_kinetics',
      title: 'Evaporation Kinetics & Molecular Weight',
      category: 'Perfumery Physics',
      summary: 'Why top notes disappear while fixative base notes endure for 12+ hours.',
      content: [
        'Perfume development is governed by Raoult’s law and molecular vapor pressure. Light molecules like Limonene (citrus) and Linalool (bergamot/lavender) have molecular weights below 150 g/mol and evaporate rapidly within 15–30 minutes.',
        'Heart notes (e.g. Geraniol, Damascenone in roses) possess moderate volatility and diffuse steadily across 1 to 4 hours.',
        'Base fixatives like Santalol (sandalwood), Geosmin (mitti), and Ambroxan have high molecular weights (>220 g/mol) with low vapor pressures, anchoring the scent to dermal sebum for up to 14 hours.'
      ],
      scientificPrinciple: 'Vapor Pressure Gradient: P_i = x_i * P_i^* (Lower vapor pressure = higher cutaneous longevity).',
      quizQuestion: {
        question: 'Which molecular characteristic allows Sandalwood and Assam Oud to act as fixatives?',
        options: [
          'High vapor pressure with low boiling points',
          'High molecular weight with low volatility and affinity for skin lipids',
          'Fast evaporation rate under humid conditions',
          'Synthetic alcohol carrier amplification'
        ],
        correctIndex: 1,
        explanation: 'Fixative molecules have high molecular weights and low volatility, binding to skin sebum and retarding the evaporation rate of lighter companion notes.'
      }
    },
    {
      id: 'deg_bhapka_attar',
      title: 'Kannauj Deg-Bhapka Hydro-distillation',
      category: 'Indian Olfactory Heritage',
      summary: 'The 400-year-old hydro-distillation method capturing petrichor and flowers.',
      content: [
        'Originating in Kannauj, Uttar Pradesh—the perfume capital of India—Deg-Bhapka uses large copper cauldrons (Degs) sealed with clay (sanjha) over wood or coal fires.',
        'Vapors travel through a bent bamboo pipe (Chonga) into a submerged copper receiver (Bhapka) resting in a cold water tank.',
        'The Bhapka contains pure sandalwood oil or liquid paraffin as the receiving base, which absorbs the volatile aroma molecules drop by drop over 15 to 20 days of repeated distillation.'
      ],
      scientificPrinciple: 'Atmospheric Hydro-Distillation: Water vapor lowers the boiling point of delicate botanical volatile oils below their decomposition temperature.',
      quizQuestion: {
        question: 'What is the function of pure Sandalwood oil inside the receiver (Bhapka)?',
        options: [
          'To increase the water temperature',
          'To act as a lipophilic solvent that absorbs and binds volatile floral/clay vapors',
          'To artificially bleach the color of the attar',
          'To prevent bacteria in the bamboo pipe'
        ],
        correctIndex: 1,
        explanation: 'Sandalwood oil serves as the natural fixative host matrix, capturing fragile aroma molecules from baked clay or rose petals without chemical synthetics.'
      }
    },
    {
      id: 'layering_principles',
      title: 'The Thermodynamics of Scent Layering',
      category: 'Chamber Chemistry',
      summary: 'How to structure dual and triple scent layers without creating olfactory crowding.',
      content: [
        'Layering is not merely blending two perfumes; it is creating an asymmetrical dual-phase accord.',
        'The Base Anchor rule: Always apply the heavier, resinous, or oil-based perfume first directly onto warm pulse points to establish the molecular foundation.',
        'The Radiance Shield: Spray the lighter, volatile fresh or citrus fragrance second—or on fabric fibers—allowing top notes to project without suffocating under heavy ambers.'
      ],
      scientificPrinciple: 'Phase Separation & Diffusion: Layering creates a sequential release curve rather than a chaotic chemical clash.',
      quizQuestion: {
        question: 'When combining a heavy Assam Oud with a fresh Bergamot Cologne, what is the correct application sequence?',
        options: [
          'Apply Bergamot first on skin, then spray Oud over it',
          'Apply the heavy Oud base first on skin, then layer Bergamot lightly on upper chest or collar',
          'Rub both together vigorously on wrists immediately',
          'Mix both into a single spray bottle with hot water'
        ],
        correctIndex: 1,
        explanation: 'The heavy fixative base must anchor first on warm skin, allowing the volatile citrus companion to sparkle on top without being swallowed.'
      }
    }
  ];

  const currentLesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];

  const handleSelectAnswer = (index: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(index);
  };

  const handleSubmitQuiz = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
    if (quizAnswer === currentLesson.quizQuestion.correctIndex) {
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
        awardXP(50, 'scent_academy_lesson');
      }
    }
  };

  const handleNextLesson = () => {
    const nextIdx = (lessons.findIndex(l => l.id === selectedLessonId) + 1) % lessons.length;
    setSelectedLessonId(lessons[nextIdx].id);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="relative w-full rounded-3xl bg-[#14110E] border border-amber-600/30 text-stone-200 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-[#181411] to-blue-950/30 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                Olfactory Science &amp; Indian Perfumery Curriculum
              </div>
              <h3 className="font-serif text-2xl font-medium text-stone-100">
                Scent Academy
              </h3>
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

        {/* Lesson Selector Bar */}
        <div className="px-6 py-3 border-b border-white/[0.06] bg-black/20 flex gap-2 overflow-x-auto no-scrollbar">
          {lessons.map(l => {
            const isDone = completedLessons.includes(l.id);
            const isSelected = l.id === selectedLessonId;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setSelectedLessonId(l.id);
                  setQuizAnswer(null);
                  setQuizSubmitted(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-stone-300 border border-white/[0.06]'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{l.title}</span>
              </button>
            );
          })}
        </div>

        {/* Lesson Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              {currentLesson.category}
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              {currentLesson.title}
            </h4>
            <p className="text-xs sm:text-sm text-stone-400">
              {currentLesson.summary}
            </p>
          </div>

          {/* Scientific Principle Callout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono">
            <strong>Scientific Axiom:</strong> {currentLesson.scientificPrinciple}
          </div>

          {/* Content paragraphs */}
          <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {currentLesson.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Interactive Quiz Section */}
          <div className="p-6 rounded-3xl bg-black/40 border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Atelier Comprehension Check &bull; +50 XP
              </span>
            </div>

            <h5 className="font-serif text-lg font-medium text-stone-100">
              {currentLesson.quizQuestion.question}
            </h5>

            <div className="space-y-2">
              {currentLesson.quizQuestion.options.map((opt, i) => {
                const isSelected = quizAnswer === i;
                const isCorrect = i === currentLesson.quizQuestion.correctIndex;
                let btnStyle = 'border-white/[0.08] bg-white/[0.02] text-stone-300 hover:bg-white/[0.05]';

                if (quizSubmitted) {
                  if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                  else if (isSelected) btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                } else if (isSelected) {
                  btnStyle = 'border-amber-500 bg-amber-500/20 text-amber-200';
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectAnswer(i)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs cursor-pointer transition ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                quizAnswer === currentLesson.quizQuestion.correctIndex
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {quizAnswer === currentLesson.quizQuestion.correctIndex ? '✓ Correct! +50 XP awarded.' : '✗ Incorrect.'}
                </div>
                <p className="text-stone-300">{currentLesson.quizQuestion.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              {!quizSubmitted ? (
                <MotionButton
                  variant="primary"
                  onClick={handleSubmitQuiz}
                  disabled={quizAnswer === null}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Verify Answer
                </MotionButton>
              ) : (
                <MotionButton
                  variant="tactile"
                  onClick={handleNextLesson}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-stone-200 text-xs font-semibold cursor-pointer flex items-center gap-2"
                >
                  <span>Next Lesson &rarr;</span>
                </MotionButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </MotionModal>
  );
};
