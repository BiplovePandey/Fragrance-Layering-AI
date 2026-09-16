import { UserGamification } from '../types.js';

const STORAGE_KEY = 'scently_user_gamification';

const DEFAULT_GAMIFICATION: UserGamification = {
  xp: 380,
  level: 2,
  title: 'Note Hunter',
  nextLevelXp: 500,
  badges: ['first_chord', 'heritage_voyager', 'weather_attuned'],
  achievements: [
    {
      id: 'first_chord',
      title: 'First Alchemical Chord',
      desc: 'Formulate a custom fragrance layering pairing in the AI Laboratory',
      icon: '✨',
      unlocked: true,
      progress: 1,
      max: 1
    },
    {
      id: 'heritage_voyager',
      title: 'Heritage Scent Voyager',
      desc: 'Explore authentic Indian distillations (Mitti, Khus, Gulab, Chandan)',
      icon: '🏺',
      unlocked: true,
      progress: 4,
      max: 4
    },
    {
      id: 'curators_vault',
      title: 'Curator’s Vault',
      desc: 'Organize at least 5 fragrances in your digital wardrobe',
      icon: '🗄️',
      unlocked: false,
      progress: 3,
      max: 5
    },
    {
      id: 'time_traveler',
      title: 'Temporal Olfaction',
      desc: 'Test 0m to 8h+ evaporation evolution in the Scent Simulator',
      icon: '⏳',
      unlocked: true,
      progress: 1,
      max: 1
    },
    {
      id: 'social_alchemist',
      title: 'Community Remix Master',
      desc: 'Remix a community layering recipe with the AI modifier engine',
      icon: '🧪',
      unlocked: false,
      progress: 0,
      max: 1
    },
    {
      id: 'gatekeeper',
      title: 'Fine Fragrance Evaluator',
      desc: 'Analyze and test candidate perfumes in the ingestion validator',
      icon: '⚖️',
      unlocked: false,
      progress: 0,
      max: 1
    }
  ]
};

export function getGamificationState(): UserGamification {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GAMIFICATION;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_GAMIFICATION,
      ...parsed,
      badges: Array.isArray(parsed?.badges) ? parsed.badges : ['first_chord', 'heritage_voyager', 'weather_attuned'],
      achievements: Array.isArray(parsed?.achievements) ? parsed.achievements : DEFAULT_GAMIFICATION.achievements
    };
  } catch {
    return DEFAULT_GAMIFICATION;
  }
}

export function awardXP(points: number, achievementId?: string): { state: UserGamification; leveledUp: boolean; titleChanged: boolean } {
  const current = getGamificationState();
  const prevLevel = current.level;
  const prevTitle = current.title;

  current.xp += points;

  // Level thresholds
  if (current.xp >= 3500) {
    current.level = 6;
    current.title = 'Olfactory Master';
    current.nextLevelXp = 5000;
  } else if (current.xp >= 2000) {
    current.level = 5;
    current.title = 'Olfactory Expert';
    current.nextLevelXp = 3500;
  } else if (current.xp >= 1000) {
    current.level = 4;
    current.title = 'Fragrance Alchemist';
    current.nextLevelXp = 2000;
  } else if (current.xp >= 500) {
    current.level = 3;
    current.title = 'Layering Apprentice';
    current.nextLevelXp = 1000;
  } else if (current.xp >= 200) {
    current.level = 2;
    current.title = 'Note Hunter';
    current.nextLevelXp = 500;
  } else {
    current.level = 1;
    current.title = 'Scent Explorer';
    current.nextLevelXp = 200;
  }

  if (achievementId) {
    const ach = current.achievements.find(a => a.id === achievementId);
    if (ach && !ach.unlocked) {
      ach.progress = Math.min(ach.max, ach.progress + 1);
      if (ach.progress >= ach.max) {
        ach.unlocked = true;
      }
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    // Storage quota or iframe sandbox
  }

  return {
    state: current,
    leveledUp: current.level > prevLevel,
    titleChanged: current.title !== prevTitle
  };
}
