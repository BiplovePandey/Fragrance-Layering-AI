export interface PresentationSlide {
  id: number;
  slideNumber: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  keyPoints: {
    title: string;
    description: string;
    badge?: string;
    highlight?: string;
  }[];
  metricsOrHighlights?: {
    value: string;
    label: string;
  }[];
  speakerNotes: string;
  visualTheme?: 'gold' | 'amber' | 'emerald' | 'rose' | 'sky';
}

export const PRESENTATION_METADATA = {
  title: 'OLFACTORY AI',
  subtitle: 'The Intelligent Fragrance Atelier & Layering Intelligence Platform',
  tagline: 'Bridging Computational Olfaction, Environmental Kinetics, and Ancient Artisanal Heritage',
  author: 'Olfactory AI Engineering Team',
  organization: 'Google AI Studio Innovation Project',
  version: '2026 Edition',
  totalSlides: 13,
  themeColors: {
    backgroundDark: '#120F0D',
    cardBackground: '#1C1713',
    cardBorder: '#382E25',
    accentGold: '#C59A3F',
    accentAmber: '#D97706',
    textLight: '#F7F4EF',
    textMuted: '#A69B8F',
    emerald: '#34D399',
    sky: '#38BDF8',
    rose: '#FB7185'
  }
};

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    id: 1,
    slideNumber: '01 / 13',
    category: 'PROJECT OVERVIEW',
    title: 'OLFACTORY AI',
    subtitle: 'The Intelligent Fragrance Atelier & Olfactory Intelligence Platform',
    summary: 'A luxury, full-stack application that transforms fragrance discovery from static marketing into a scientific, climate-adaptive, and culturally grounded art form.',
    keyPoints: [
      {
        title: '8-Dimensional Chord Vector Matrix',
        description: 'Mathematical representation of complex scent molecules across 8 olfactory dimensions with real-time harmonic compatibility calculation.',
        badge: 'AI Core'
      },
      {
        title: 'Climate-Adaptive Wear Engine',
        description: 'Dynamic environmental calculations adjusting projection, spray dosage, and sillage based on live temperature, humidity, and UV index.',
        badge: 'Kinetics'
      },
      {
        title: 'Ancient Indian Attar Archive',
        description: 'Preserving 400+ years of Deg & Bhapka copper alembic steam hydro-distillation from Kannauj, India.',
        badge: 'Heritage'
      },
      {
        title: 'Atmospheric Art Direction & Audio',
        description: 'Three adaptive visual worlds (Atelier, Archive, Chamber) paired with procedural ambient acoustic soundscapes.',
        badge: 'Design'
      }
    ],
    metricsOrHighlights: [
      { value: '8D', label: 'Vector Matrix' },
      { value: '100%', label: 'Mathematical Chords' },
      { value: '400+', label: 'Years of Kannauj Heritage' },
      { value: '3', label: 'Adaptive Visual Worlds' }
    ],
    speakerNotes: 'Welcome everyone. Olfactory AI is an intelligent fragrance atelier that unites computational chemistry, weather-aware wear kinetics, and historical Indian perfumery into a cohesive, quiet-luxury digital experience. Today I will walk you through the core problem, our multi-dimensional architecture, key features, and future vision.',
    visualTheme: 'gold'
  },
  {
    id: 2,
    slideNumber: '02 / 13',
    category: 'MARKET FRICTION',
    title: 'The Olfactory Dilemma',
    subtitle: 'Why Traditional Perfume Discovery & Layering Is Broken',
    summary: 'Fragrance is deeply chemical and intensely personal, yet the $60B perfume industry relies on opaque marketing and static advice that leads to high consumer frustration.',
    keyPoints: [
      {
        title: 'Blind-Buy Disappointment',
        description: 'Over 40% of prestige perfume purchases result in buyer regret because descriptions rely on romantic ad copy rather than objective olfactory profiles.',
        highlight: '40%+ Regret Rate'
      },
      {
        title: 'Climate Ignorance',
        description: 'Fragrance kinetics vary drastically by climate. Heavy resins choke in tropical humidity, while delicate citrus notes vanish in dry winter cold.',
        highlight: 'Static Advice'
      },
      {
        title: 'Trial-and-Error Layering',
        description: '78% of fragrance enthusiasts attempt perfume layering, but lacking molecular chord chemistry, they often produce muddy or clashing scent profiles.',
        highlight: 'Sensory Friction'
      },
      {
        title: 'Disappearing Artisanal Heritage',
        description: 'Ancient natural distillation arts—such as Kannauj steam hydro-distillation into pure sandalwood oil—are fading against synthetic mass-market chemicals.',
        highlight: 'Lost Traditions'
      }
    ],
    metricsOrHighlights: [
      { value: '$60B', label: 'Global Market' },
      { value: '42%', label: 'Blind-Buy Regret' },
      { value: '78%', label: 'Enthusiasts Layer' },
      { value: '0', label: 'Climate Context in Stores' }
    ],
    speakerNotes: 'Let us examine the problem. When you buy perfume today, you are given romantic marketing words like "mysterious" or "enchanting". But perfume is chemistry. If you wear a heavy tobacco oud in 35-degree tropical humidity, you will suffocate everyone around you. Furthermore, when enthusiasts attempt to layer perfumes, they have zero tools to predict whether the notes will harmonize or fight each other.',
    visualTheme: 'amber'
  },
  {
    id: 3,
    slideNumber: '03 / 13',
    category: 'VALUE PROPOSITION',
    title: 'The Olfactory AI Solution',
    subtitle: 'A Four-Pillar Operating System for Fragrance Science',
    summary: 'Olfactory AI turns subjective scent discovery into an exact, sensory, and culturally respectful operating system.',
    keyPoints: [
      {
        title: 'Pillar 1: Mathematical Olfactive Profiling',
        description: 'Quantifies any perfume into an 8D vector of Woody, Citrus, Floral, Oriental, Spicy, Fresh, Aquatic, and Gourmand intensities.',
        badge: '01 Analysis'
      },
      {
        title: 'Pillar 2: Real-Time Environmental Engine',
        description: 'Integrates temperature, humidity, and barometric pressure to compute vaporization speed, sillage radius, and optimal spray count.',
        badge: '02 Kinetics'
      },
      {
        title: 'Pillar 3: Harmonic Layering Laboratory',
        description: 'Calculates an Algorithmic Harmony Index (0-100) using vector distance and accord resonance to simulate dual-fragrance chords.',
        badge: '03 Chemistry'
      },
      {
        title: 'Pillar 4: Historical Heritage Archive',
        description: 'Celebrates sacred Indian Deg & Bhapka alembic steam distillation, from Mitti Attar (petrichor) to Shamama and Ruh Gulab.',
        badge: '04 Culture'
      }
    ],
    metricsOrHighlights: [
      { value: '4', label: 'Core Pillars' },
      { value: '0-100', label: 'Harmony Score' },
      { value: '12h+', label: 'Evaporation Simulation' },
      { value: '100%', label: 'Real-Time Physics' }
    ],
    speakerNotes: 'Here is our four-pillar solution. First, we represent scent as an 8-dimensional vector. Second, we factor in environmental thermodynamics. Third, we compute harmonic compatibility before you spray. Fourth, we honor timeless historical perfumery traditions like Indian Mitti Attar and Shamama.',
    visualTheme: 'gold'
  },
  {
    id: 4,
    slideNumber: '04 / 13',
    category: 'TECHNICAL ARCHITECTURE',
    title: 'System Architecture & Tech Stack',
    subtitle: 'Full-Stack Performance, Precision Instruments & Real-Time Physics',
    summary: 'Designed from the ground up for zero-latency interactivity, tactile visual feedback, and reliable cross-platform execution.',
    keyPoints: [
      {
        title: 'Client Tier: React 19 & Fluid Motion',
        description: 'Built with React 19, TypeScript, Tailwind CSS, Motion physics springs, and custom hand-crafted SVG instrument gauges.',
        badge: 'Frontend'
      },
      {
        title: 'Server Tier: Express & Vector ML Engine',
        description: 'Containerized Node.js service running on Port 3000 with in-memory SQLite vector stores, K-Means clustering, and cosine similarity.',
        badge: 'Backend'
      },
      {
        title: 'Olfactory Intelligence Layer',
        description: 'Headspace volatility decay curves, Clausius-Clapeyron vapor pressure math, and environmental climate normalization.',
        badge: 'Domain ML'
      },
      {
        title: 'Synthesized Acoustic Soundscape',
        description: 'Web Audio API ambient sound generator syncing procedural rain, temple bells, and crackling embers with active scent notes.',
        badge: 'Audio Engine'
      }
    ],
    metricsOrHighlights: [
      { value: 'React 19', label: 'Modern UI' },
      { value: '<50ms', label: 'Vector Computation' },
      { value: 'Port 3000', label: 'Cloud Run Ingress' },
      { value: '100%', label: 'TypeScript Strict' }
    ],
    speakerNotes: 'On this slide, we examine the technical architecture. We run a clean full-stack TypeScript environment. The client tier utilizes React 19 and Motion physics for fluid micro-interactions. The server tier processes high-speed vector calculations in sub-50 milliseconds, while our Web Audio engine synthesizes synesthetic soundscapes.',
    visualTheme: 'sky'
  },
  {
    id: 5,
    slideNumber: '05 / 13',
    category: 'MATHEMATICAL MODEL',
    title: 'The 8D Olfactory Vector Matrix',
    subtitle: 'Representing Scent as a Multi-Dimensional Mathematical Coordinate',
    summary: 'Every perfume in the database is modeled as a normalized 8-dimensional vector spanning the fundamental families of perfumery.',
    keyPoints: [
      {
        title: '8 Canonical Dimensions',
        description: 'Woody, Citrus, Floral, Oriental, Spicy, Fresh, Aquatic, and Gourmand. Normalized so the sum of components equals 1.0.',
        badge: 'Vectors'
      },
      {
        title: 'Euclidean & Cosine Geometry',
        description: 'Vector distance determines family proximity, while dot-product cosine similarity identifies complementary contrast points.',
        badge: 'Calculus'
      },
      {
        title: 'Precision Brass Radar Gauge',
        description: 'Hand-crafted SVG instrument with 24-tick graduation, champagne radial rays, and botanical glyphs representing each dimension.',
        badge: 'Visualization'
      },
      {
        title: 'Interactive Chord Overlay',
        description: 'Simultaneously overlays Fragrance A and Fragrance B to reveal overlapping synergy zones and unrepresented voids.',
        badge: 'Layering'
      }
    ],
    metricsOrHighlights: [
      { value: '8 Axes', label: 'Olfactory Space' },
      { value: 'Cos(θ)', label: 'Similarity Metric' },
      { value: '24', label: 'Graduation Ticks' },
      { value: 'Dual', label: 'Overlay Polygons' }
    ],
    speakerNotes: 'Perfume notes are often subjective, but by mapping them to an 8-dimensional vector, we can treat them with geometric rigor. In this vector space, woody and gourmand notes live in one sector, while aquatic and citrus occupy the opposite hemisphere. Our radar visualizer renders this geometry with physical brass dial aesthetics.',
    visualTheme: 'gold'
  },
  {
    id: 6,
    slideNumber: '06 / 13',
    category: 'ENVIRONMENTAL INTELLIGENCE',
    title: 'Climate-Adaptive Wear Engine',
    subtitle: 'Thermodynamics of Skin Scent & Evaporation Kinetics',
    summary: 'Calculates how ambient environmental variables dictate fragrance projection, evaporation rates, and skin longevity.',
    keyPoints: [
      {
        title: 'Temperature Vaporization Dynamics',
        description: 'High heat exponentially accelerates the release of volatile top notes while expanding sillage projection radius.',
        badge: 'Temperature'
      },
      {
        title: 'Relative Humidity Dampening',
        description: 'High humidity traps heavier scent molecules near the skin, increasing risk of cloying heaviness for amber/vanilla accords.',
        badge: 'Humidity'
      },
      {
        title: 'Calibrated Spray & Zone Dosage',
        description: 'Recommends precise application counts (e.g. 2 sprays on collarbone in 32°C vs. 5 sprays on pulse points in 14°C).',
        badge: 'Dosage Guide'
      },
      {
        title: 'Live Weather Integration',
        description: 'Dynamically fetches current location climate or allows manual simulation across tropical, desert, temperate, and sub-zero climates.',
        badge: 'Simulation'
      }
    ],
    metricsOrHighlights: [
      { value: '°C / °F', label: 'Live Temperature' },
      { value: '% RH', label: 'Relative Humidity' },
      { value: '2-6', label: 'Smart Spray Dosage' },
      { value: '4', label: 'Climate Profiles' }
    ],
    speakerNotes: 'Slide 6 shows our Climate-Adaptive Wear Engine. A fragrance does not exist in a vacuum—it interacts with the thermodynamics of the ambient atmosphere. Our engine evaluates the temperature and relative humidity to give real-time dosage advice, preventing over-spraying in summer and scent disappearance in winter.',
    visualTheme: 'emerald'
  },
  {
    id: 7,
    slideNumber: '07 / 13',
    category: 'ALCHEMICAL SCIENCE',
    title: 'Harmonic Layering Laboratory',
    subtitle: 'Algorithmic Chord Scoring & Scent Chemistry Simulation',
    summary: 'Allows fragrance lovers to virtually mix two fragrances, scoring their chemical synergy and identifying potential friction points.',
    keyPoints: [
      {
        title: 'Algorithmic Harmony Index (0-100)',
        description: 'Evaluates molecular weight balance, accord resonance, and fixative compatibility to output a single definitive harmony score.',
        badge: 'Synergy Score'
      },
      {
        title: 'Three Dynamic Compatibility Zones',
        description: 'Harmonic Chord (80-100, seamless blend), Interesting Tension (60-79, artistic contrast), or Olfactory Friction (<60, discordant clash).',
        badge: 'Zoning'
      },
      {
        title: 'Physical Engraved Brass Dial',
        description: 'Inspired by antique alchemical balances, featuring fine degree ticks, a graduated gold arc, and central percentage readout.',
        badge: 'Instrument'
      },
      {
        title: 'Curated Pairing Recommendations',
        description: 'Provides actionable tips on which fragrance to spray first (heavier base anchor) and which to mist on top (lighter volatile bloom).',
        badge: 'Application'
      }
    ],
    metricsOrHighlights: [
      { value: '0-100', label: 'Harmony Score' },
      { value: '3', label: 'Harmonic States' },
      { value: 'Base First', label: 'Sequencing Rule' },
      { value: 'Real-time', label: 'Instant Feedback' }
    ],
    speakerNotes: 'In the Layering Laboratory, users can pick any two fragrances from their vault and virtually test them together. Our algorithm checks whether the base notes of Fragrance A can properly anchor the heart notes of Fragrance B, outputting a clear compatibility index on our brass dial.',
    visualTheme: 'gold'
  },
  {
    id: 8,
    slideNumber: '08 / 13',
    category: 'HEADSPACE DYNAMICS',
    title: 'Evaporation & Volatility Timeline',
    subtitle: 'Visualizing the Three Acts of Perfume Evolution Over 12+ Hours',
    summary: 'Perfume is a time-release art form. The timeline models molecular evaporation curves from the opening flash to the final fixative drydown.',
    keyPoints: [
      {
        title: 'Top Notes: 0m to 30m (Opening Flash)',
        description: 'Light monoterpenes (citrus, bergamot, aldehydic sparkle) that flash off the skin rapidly to create the opening impression.',
        badge: '0m Flash'
      },
      {
        title: 'Heart Accords: 30m to 4h (The Core Bloom)',
        description: 'Floral ketones and aromatic spices (rose, jasmine, saffron, cardamom) that define the signature character of the fragrance.',
        badge: '2h Bloom'
      },
      {
        title: 'Base Fixatives: 4h to 12h+ (Drydown Shadow)',
        description: 'Heavy sesquiterpenes, resins, and ambers (oud, sandalwood, vanilla, ambergris) that chemically bond to skin proteins.',
        badge: '12h Fixation'
      },
      {
        title: 'Interactive Headspace Volatility Envelope',
        description: 'An SVG area graph displaying the three decaying curves with scrubbed point illumination across 0m, 15m, 2h, 6h, and 12h+.',
        badge: 'Visual Curve'
      }
    ],
    metricsOrHighlights: [
      { value: '0m-30m', label: 'Top Volatility' },
      { value: '2h-4h', label: 'Heart Peak' },
      { value: '12h+', label: 'Base Longevity' },
      { value: '5', label: 'Scrubbed Stages' }
    ],
    speakerNotes: 'Slide 8 reveals the perfume volatility curve. A fragrance changes completely over time. Our evaporation graph displays the three curves: top citrus flashing off early, heart floral peaking around hour two, and base fixatives lingering for twelve hours or more. Users can scrub through time to preview their scent evolution.',
    visualTheme: 'amber'
  },
  {
    id: 9,
    slideNumber: '09 / 13',
    category: 'CULTURAL PRESERVATION',
    title: 'Indian Heritage & The Attar Archive',
    subtitle: 'Documenting 400+ Years of Kannauj Deg-Bhapka Hydro-Distillation',
    summary: 'A dedicated sanctuary honoring sacred, ancient Indian natural perfumery and traditional copper alembic hydro-distillation.',
    keyPoints: [
      {
        title: 'The Deg & Bhapka Alembic Process',
        description: 'Pure copper stills (Degs) connected by bent bamboo pipes (Chonga) into submerged receiver vessels (Bhapka) cooled in running water.',
        badge: 'Alembic'
      },
      {
        title: 'Pure Sandalwood Fixative Substrate',
        description: 'Unlike commercial alcohol-based perfumes, authentic Indian attars are hydro-distilled directly into pure sandalwood oil over weeks.',
        badge: 'Sandalwood Base'
      },
      {
        title: 'Mitti Attar (Scent of the First Rain)',
        description: 'Distillation of baked baked clay shards into sandalwood, capturing the authentic petrichor fragrance of summer monsoon earth.',
        badge: 'Petrichor'
      },
      {
        title: 'Shamama & Sacred Blends',
        description: 'An alchemical recipe of over 40 Himalayan roots, herbs, and spices distilled over copper wood fires for over a month.',
        badge: 'Sacred Blend'
      }
    ],
    metricsOrHighlights: [
      { value: '400+', label: 'Years of Tradition' },
      { value: 'Kannauj', label: 'Perfume Capital' },
      { value: '100%', label: 'Natural Hydro-Distillate' },
      { value: '0%', label: 'Synthetic Alcohol' }
    ],
    speakerNotes: 'Slide 9 highlights one of our most distinctive innovations: The Indian Heritage Attar Archive. Long before modern synthetic perfume laboratories existed, master distillers in Kannauj were distilling clay, rose petals, and wild vetiver roots into pure sandalwood oil using bamboo and copper stills. We have documented these sacred processes in the app.',
    visualTheme: 'gold'
  },
  {
    id: 10,
    slideNumber: '10 / 13',
    category: 'INTELLIGENCE & COMMUNITY',
    title: 'Scanner, Society & Academy',
    subtitle: 'Deconstructing Bottles, Fostering Community, and Gamifying Learning',
    summary: 'Empowering users through automated note scanning, peer fragrance discussions, and master perfumer rank progression.',
    keyPoints: [
      {
        title: 'Fragrance Scanner & Accord Deconstructor',
        description: 'Instant analysis of commercial fragrance bottles: breakdown of top, heart, and base notes, projection radius, and allergen transparency.',
        badge: 'Scanner'
      },
      {
        title: 'Community Fragrance Society',
        description: 'Scent of the Day (SOTD) check-ins, community layering recipes, peer reviews, and interactive fragrance discussions.',
        badge: 'Society'
      },
      {
        title: 'The Olfactory Academy & Quizzes',
        description: 'Educational modules and sensory quizzes testing knowledge of molecular families, volatility curves, and perfumery history.',
        badge: 'Academy'
      },
      {
        title: 'Master Perfumer Guild Progression',
        description: 'Gamified XP and ranks: progressing from Apprentice Smeller to Nose in Training to Grand Master Perfumer.',
        badge: 'Guild Ranks'
      }
    ],
    metricsOrHighlights: [
      { value: 'Instant', label: 'Bottle Analysis' },
      { value: 'SOTD', label: 'Daily Social Check-in' },
      { value: '5 Ranks', label: 'Academy Guild' },
      { value: '100%', label: 'Interactive Learning' }
    ],
    speakerNotes: 'Beyond individual discovery, Olfactory AI fosters education and community. The Fragrance Scanner deconstructs commercial perfumes into clear molecular layers. The Community Society enables enthusiasts to share daily wears, while the Olfactory Academy rewards curiosity with perfumer guild ranks and badges.',
    visualTheme: 'rose'
  },
  {
    id: 11,
    slideNumber: '11 / 13',
    category: 'ART DIRECTION & SENSORY DESIGN',
    title: 'Visual Worlds & Acoustic Soundscapes',
    subtitle: 'Synesthetic Design: Bridging Sight, Sound, and Scent',
    summary: 'Because scent is invisible, Olfactory AI employs intentional art direction and procedural audio to evoke fragrance moods.',
    keyPoints: [
      {
        title: 'The Atelier World',
        description: 'Warm ivory, soft alabaster, and champagne reflections—designed for calm creation, exploration, and daily scent selection.',
        badge: 'Ivory World'
      },
      {
        title: 'The Archive World',
        description: 'Aged parchment, terracotta, oxidized copper, and burnished leather—dedicated to historical attar distillation and heritage.',
        badge: 'Terracotta World'
      },
      {
        title: 'The Chamber World',
        description: 'Smoked obsidian, espresso, and burnished gold—framing mathematical vector chords and deep alchemical layering.',
        badge: 'Obsidian World'
      },
      {
        title: 'Procedural Web Audio Engine',
        description: 'Generates real-time ambient soundscapes (rain on leaves, temple bells, crackling embers) synchronized to the active scent family.',
        badge: 'Soundscapes'
      }
    ],
    metricsOrHighlights: [
      { value: '3', label: 'Visual Environments' },
      { value: '0-Slop', label: 'Bespoke UI Design' },
      { value: 'Web Audio', label: 'Synthesized Ambiance' },
      { value: 'Dynamic', label: 'Atmosphere Lighting' }
    ],
    speakerNotes: 'On Slide 11, we explore our synesthetic design philosophy. Scent is an invisible medium, so we crafted three distinct visual environments: The Atelier for exploration, The Archive for historical attars, and The Chamber for vector calculations. We also built an in-browser audio engine generating rain, bells, and embers matching the scent.',
    visualTheme: 'gold'
  },
  {
    id: 12,
    slideNumber: '12 / 13',
    category: 'IMPACT & FUTURE ROADMAP',
    title: 'Impact, Value & Future Roadmap',
    subtitle: 'Transforming Consumer Confidence and Commercial Perfumery',
    summary: 'A proven paradigm shift for fragrance consumers, niche retailers, and artisanal heritage preservation.',
    keyPoints: [
      {
        title: 'Consumer Economics: $300+ Annual Savings',
        description: 'Eliminates blind-buy regrets and unlocks existing collections by demonstrating how 5 bottles can yield 20+ bespoke layering chords.',
        highlight: 'High ROI'
      },
      {
        title: 'Retail & Brand Transformation',
        description: 'Enables luxury fragrance brands to deploy interactive digital consultations that recommend fragrances based on local real-time weather.',
        highlight: 'Omnichannel'
      },
      {
        title: 'Phase 2: Computer Vision Bottle Scanning',
        description: 'Direct smartphone camera scanning of physical perfume bottles to instantly load accords and recommend layering pairs.',
        highlight: 'Q3 2026'
      },
      {
        title: 'Phase 3: Smart Diffuser IoT Integration',
        description: 'Direct API synchronization with smart ultrasonic home diffusers to blend room scents in harmony with current outdoor humidity.',
        highlight: 'Q4 2026'
      }
    ],
    metricsOrHighlights: [
      { value: '$300+', label: 'Avg User Savings' },
      { value: '4x', label: 'Wardrobe Combinations' },
      { value: 'IoT', label: 'Diffuser Ready' },
      { value: 'Global', label: 'Heritage Reach' }
    ],
    speakerNotes: 'Slide 12 reviews the impact and roadmap. For consumers, Olfactory AI eliminates blind-buy waste and multiplies their existing collection. For luxury retailers, it introduces real-time climate recommendations. Our future roadmap includes mobile camera bottle scanning and IoT smart home diffuser integration.',
    visualTheme: 'emerald'
  },
  {
    id: 13,
    slideNumber: '13 / 13',
    category: 'CONCLUSION & DEMO',
    title: 'Experience Olfactory AI',
    subtitle: 'Where Artificial Intelligence Meets the Ancient Art of the Nose',
    summary: 'Olfactory AI brings mathematical clarity to scent discovery, elevating perfumery into a truly personal, climate-aware journey.',
    keyPoints: [
      {
        title: 'Interactive Live Application',
        description: 'Explore The Atelier, customize weather sliders, test layering compatibility in The Chamber, and listen to the ambient soundscapes.',
        badge: 'Live App'
      },
      {
        title: 'Full Presentation Export',
        description: 'Download the complete 16:9 PowerPoint (.pptx) file directly with custom layouts, speaker notes, and color themes.',
        badge: 'Download PPT'
      },
      {
        title: 'Open Architecture',
        description: 'Built with modern full-stack standards: React 19, TypeScript, Express, SQLite vectors, and strict accessibility.',
        badge: 'Production Ready'
      },
      {
        title: 'Questions & Discussion',
        description: 'Thank you for your time. We invite you to explore the live digital fragrance atelier and share your thoughts.',
        badge: 'Q & A'
      }
    ],
    metricsOrHighlights: [
      { value: '100%', label: 'Functional' },
      { value: '16:9', label: 'Widescreen PPT' },
      { value: 'Live', label: 'Interactive Demo' },
      { value: 'Thank You', label: 'Q&A' }
    ],
    speakerNotes: 'Thank you all. Olfactory AI demonstrates how modern technology can elevate an ancient art form without losing its soul. You can now download this presentation as a polished PowerPoint file or explore the live interactive application. I am happy to take any questions.',
    visualTheme: 'gold'
  }
];
