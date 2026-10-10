import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'Olfactory AI - Project Presentation';
  pres.author = 'Olfactory AI Team';
  pres.company = 'Olfactory AI Atelier';

  // Palette constants
  const BG_DARK = '14100D';
  const BG_CARD = '221B16';
  const TEXT_LIGHT = 'F7F4EF';
  const TEXT_MUTED = 'B8AA9C';
  const GOLD = 'D4AF37';
  const AMBER = 'D97706';
  const ACCENT_ORANGE = 'EA580C';
  const BORDER_COLOR = '3D3228';

  // Helper for slide header
  function addHeader(slide, title, category) {
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.5,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 3
    });

    slide.addText(title, {
      x: 0.8,
      y: 0.8,
      w: 11.5,
      h: 0.7,
      fontSize: 26,
      fontFace: 'Georgia',
      color: TEXT_LIGHT,
      bold: true
    });

    // Subtle divider line
    slide.addShape(pres.ShapeType.line, {
      x: 0.8,
      y: 1.55,
      w: 11.7,
      h: 0,
      line: { color: BORDER_COLOR, width: 1 }
    });
  }

  // ==================== SLIDE 1: COVER SLIDE ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };

    // Decorative outer frame
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5,
      y: 0.5,
      w: 12.33,
      h: 6.5,
      fill: { color: BG_DARK },
      line: { color: BORDER_COLOR, width: 1 }
    });

    // Inner subtle gold border
    slide.addShape(pres.ShapeType.rect, {
      x: 0.7,
      y: 0.7,
      w: 11.93,
      h: 6.1,
      fill: { color: '1A1410' },
      line: { color: GOLD, width: 0.75 }
    });

    // Badge
    slide.addText('ALCHEMICAL INTELLIGENCE • MOLECULAR ARTISTRY', {
      x: 1.5,
      y: 1.8,
      w: 10.33,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      align: 'center',
      charSpacing: 4
    });

    // Title
    slide.addText('OLFACTORY AI', {
      x: 1.5,
      y: 2.3,
      w: 10.33,
      h: 1.2,
      fontSize: 48,
      fontFace: 'Georgia',
      color: TEXT_LIGHT,
      bold: true,
      align: 'center'
    });

    // Subtitle
    slide.addText('The Living Digital Fragrance Atelier\nMachine Learning, 8D Vector Olfaction & Multisensory Luxury', {
      x: 2.0,
      y: 3.5,
      w: 9.33,
      h: 0.9,
      fontSize: 16,
      fontFace: 'Helvetica Neue',
      color: TEXT_MUTED,
      align: 'center',
      lineSpacing: 24
    });

    // Feature highlights pills
    const pillars = ['8D Vector Space', 'Algorithmic Layering', 'Weather Adaptation', 'Kannauj Heritage'];
    pillars.forEach((pill, idx) => {
      const px = 2.4 + idx * 2.2;
      slide.addShape(pres.ShapeType.roundRect, {
        x: px,
        y: 4.8,
        w: 2.0,
        h: 0.45,
        rectRadius: 0.1,
        fill: { color: '261E18' },
        line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(pill, {
        x: px,
        y: 4.85,
        w: 2.0,
        h: 0.35,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        color: GOLD,
        bold: true,
        align: 'center'
      });
    });

    slide.addText('PROJECT PRESENTATION & PRODUCT SHOWCASE', {
      x: 1.5,
      y: 5.7,
      w: 10.33,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Helvetica Neue',
      color: '7D7062',
      align: 'center',
      charSpacing: 2
    });
  }

  // ==================== SLIDE 2: THE PROBLEM ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'The Dilemma in Modern Perfumery', 'Industry Context');

    const cards = [
      {
        title: 'High Risk Blind Buying',
        desc: 'Fragrances are inherently invisible online. Consumers waste hundreds of dollars purchasing expensive bottles based on marketing descriptions that rarely match real skin chemistry.',
        stat: '74%',
        statLabel: 'of perfume buyers regret blind purchases'
      },
      {
        title: 'The "Layering" Mystery',
        desc: 'Combining fragrances (fragrance layering) is the ultimate haute-perfumerie trend, but consumers fear creating clashing, nauseating chemical combinations with zero guidance.',
        stat: '89%',
        statLabel: 'want to layer scents but lack confidence'
      },
      {
        title: 'Ignoring Environmental Context',
        desc: 'Perfume evaporates dramatically differently in hot humidity vs dry cold. Traditional retail treats fragrances as static liquids rather than living chemical reactions.',
        stat: '3.5x',
        statLabel: 'evaporation rate difference in varying weather'
      }
    ];

    cards.forEach((c, idx) => {
      const cx = 0.8 + idx * 3.95;
      // Card box
      slide.addShape(pres.ShapeType.rect, {
        x: cx,
        y: 1.9,
        w: 3.75,
        h: 4.8,
        fill: { color: BG_CARD },
        line: { color: BORDER_COLOR, width: 1 }
      });

      // Top accent bar
      slide.addShape(pres.ShapeType.rect, {
        x: cx,
        y: 1.9,
        w: 3.75,
        h: 0.08,
        fill: { color: idx === 1 ? GOLD : AMBER }
      });

      // Stat
      slide.addText(c.stat, {
        x: cx + 0.3,
        y: 2.2,
        w: 3.15,
        h: 0.8,
        fontSize: 38,
        fontFace: 'Georgia',
        color: GOLD,
        bold: true
      });

      slide.addText(c.statLabel.toUpperCase(), {
        x: cx + 0.3,
        y: 3.0,
        w: 3.15,
        h: 0.4,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        bold: true
      });

      slide.addText(c.title, {
        x: cx + 0.3,
        y: 3.6,
        w: 3.15,
        h: 0.6,
        fontSize: 16,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });

      slide.addText(c.desc, {
        x: cx + 0.3,
        y: 4.3,
        w: 3.15,
        h: 2.1,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 18
      });
    });
  }

  // ==================== SLIDE 3: THE SOLUTION ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'What is Olfactory AI?', 'The Breakthrough Platform');

    // Left narrative box
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.9,
      w: 5.6,
      h: 4.8,
      fill: { color: BG_CARD },
      line: { color: BORDER_COLOR, width: 1 }
    });

    slide.addText('The Living Digital Fragrance Atelier', {
      x: 1.1,
      y: 2.2,
      w: 5.0,
      h: 0.5,
      fontSize: 20,
      fontFace: 'Georgia',
      color: GOLD,
      bold: true
    });

    slide.addText(
      'Olfactory AI transforms fragrance from a guesswork retail product into an interactive, mathematically modeled sensory science.\n\nBy marrying machine learning, chemistry-based volatility curves, and sensory aesthetics, it allows users to formulate, explore, and predict scents with precision.',
      {
        x: 1.1,
        y: 2.8,
        w: 5.0,
        h: 2.2,
        fontSize: 13,
        fontFace: 'Helvetica Neue',
        color: TEXT_LIGHT,
        lineSpacing: 20
      }
    );

    slide.addShape(pres.ShapeType.rect, {
      x: 1.1,
      y: 5.2,
      w: 5.0,
      h: 1.1,
      fill: { color: '181310' },
      line: { color: GOLD, width: 0.5 }
    });

    slide.addText('KEY VALUE PROPOSITION', {
      x: 1.3,
      y: 5.3,
      w: 4.6,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true
    });

    slide.addText('Predict harmony, master bespoke layering, and match fragrances to live weather and mood—instantly.', {
      x: 1.3,
      y: 5.6,
      w: 4.6,
      h: 0.6,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      color: TEXT_MUTED
    });

    // Right side 3 pillars
    const pillars = [
      {
        title: '8-Dimensional Molecular Mapping',
        desc: 'Every fragrance is vectorized across 8 chemical sensory vectors to calculate exact chord overlap and contrast.'
      },
      {
        title: 'Algorithmic Harmony Index',
        desc: 'Calculates 0-100% compatibility scores, identifying bridge notes, tension chords, and volatility stabilization.'
      },
      {
        title: 'Contextual Headspace Engine',
        desc: 'Dynamically predicts the 12-hour drydown curve based on real-time ambient heat, humidity, and time of day.'
      }
    ];

    pillars.forEach((p, idx) => {
      const py = 1.9 + idx * 1.65;
      slide.addShape(pres.ShapeType.rect, {
        x: 6.7,
        y: py,
        w: 5.8,
        h: 1.45,
        fill: { color: BG_CARD },
        line: { color: BORDER_COLOR, width: 1 }
      });

      slide.addText(`0${idx + 1}`, {
        x: 7.0,
        y: py + 0.15,
        w: 0.8,
        h: 0.4,
        fontSize: 18,
        fontFace: 'Georgia',
        color: GOLD,
        bold: true
      });

      slide.addText(p.title, {
        x: 7.8,
        y: py + 0.15,
        w: 4.5,
        h: 0.4,
        fontSize: 14,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });

      slide.addText(p.desc, {
        x: 7.8,
        y: py + 0.55,
        w: 4.4,
        h: 0.75,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 15
      });
    });
  }

  // ==================== SLIDE 4: 8D OLFACTORY VECTOR MATRIX ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'The 8-Dimensional Olfactory Vector Matrix', 'Mathematical Scent Modeling');

    const dims = [
      { name: 'Citrus & Fresh', color: 'F59E0B', note: 'Bergamot, Neroli, Yuzu, Mandarin' },
      { name: 'Floral Bloom', color: 'FB7185', note: 'Damask Rose, Jasmine Sambac, Iris' },
      { name: 'Woody & Resinous', color: 'B45309', note: 'Oud, Mysore Sandalwood, Cedar' },
      { name: 'Amber & Oriental', color: 'D97706', note: 'Benzoin, Labdanum, Vanilla' },
      { name: 'Spicy & Warm', color: 'EA580C', note: 'Saffron, Cardamom, Black Pepper' },
      { name: 'Gourmand Sweet', color: 'D4AF37', note: 'Tonka Bean, Cocoa, Roasted Coffee' },
      { name: 'Aquatic & Ozonic', color: '38BDF8', note: 'Sea Salt, Marine Breeze, Calone' },
      { name: 'Earthy & Green', color: '10B981', note: 'Ruh Khus (Vetiver), Oakmoss, Petrichor' }
    ];

    dims.forEach((d, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const x = 0.8 + col * 2.95;
      const y = 1.9 + row * 2.45;

      slide.addShape(pres.ShapeType.rect, {
        x,
        y,
        w: 2.8,
        h: 2.25,
        fill: { color: BG_CARD },
        line: { color: BORDER_COLOR, width: 1 }
      });

      // Accent color pill
      slide.addShape(pres.ShapeType.ellipse, {
        x: x + 0.25,
        y: y + 0.25,
        w: 0.2,
        h: 0.2,
        fill: { color: d.color }
      });

      slide.addText(d.name, {
        x: x + 0.55,
        y: y + 0.2,
        w: 2.0,
        h: 0.35,
        fontSize: 12,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });

      slide.addText('CANONICAL NOTES', {
        x: x + 0.25,
        y: y + 0.7,
        w: 2.3,
        h: 0.2,
        fontSize: 8,
        fontFace: 'Helvetica Neue',
        color: GOLD,
        bold: true,
        charSpacing: 1
      });

      slide.addText(d.note, {
        x: x + 0.25,
        y: y + 0.95,
        w: 2.3,
        h: 0.6,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED
      });

      slide.addText('VECTOR RANGE: 0.0 - 1.0', {
        x: x + 0.25,
        y: y + 1.75,
        w: 2.3,
        h: 0.25,
        fontSize: 8,
        fontFace: 'Courier New',
        color: '7A6E61'
      });
    });
  }

  // ==================== SLIDE 5: THE LAYERING ENGINE ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'Algorithmic Harmony & Layering Engine', 'Alchemical Chemistry');

    // Left diagram box
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.9,
      w: 6.0,
      h: 4.8,
      fill: { color: BG_CARD },
      line: { color: BORDER_COLOR, width: 1 }
    });

    slide.addText('HOW THE ALGORITHM CALCULATES HARMONY', {
      x: 1.1,
      y: 2.2,
      w: 5.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 2
    });

    const steps = [
      { step: '1. Cosine Distance & Chord Tension', detail: 'Analyzes the angular distance between 8D vectors. High overlap creates a mono-chord; balanced contrast creates rich olfactory depth.' },
      { step: '2. Volatility Rate Matching', detail: 'Checks that light volatile molecules (top citrus) have an anchor fixative (amber/oud) to prevent uneven evaporation.' },
      { step: '3. Olfactory Clashing Prevention', detail: 'Flags high-friction combinations (e.g. intense aquatic marine + dense smoky animalic leather).' },
      { step: '4. Bridge Note Recommendation', detail: 'Identifies bridging notes (like Saffron or Iris) to fuse disparate fragrances seamlessly.' }
    ];

    steps.forEach((s, idx) => {
      const sy = 2.65 + idx * 0.95;
      slide.addText(s.step, {
        x: 1.1,
        y: sy,
        w: 5.4,
        h: 0.3,
        fontSize: 12,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });
      slide.addText(s.detail, {
        x: 1.1,
        y: sy + 0.3,
        w: 5.4,
        h: 0.55,
        fontSize: 10.5,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 14
      });
    });

    // Right box: Real-world Layering Example
    slide.addShape(pres.ShapeType.rect, {
      x: 7.1,
      y: 1.9,
      w: 5.4,
      h: 4.8,
      fill: { color: '1C1612' },
      line: { color: GOLD, width: 0.75 }
    });

    slide.addText('CASE STUDY: THE ROYAL ACCORD', {
      x: 7.4,
      y: 2.2,
      w: 4.8,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText('Kannauj Royal Oud + Damask Rose', {
      x: 7.4,
      y: 2.5,
      w: 4.8,
      h: 0.45,
      fontSize: 17,
      fontFace: 'Georgia',
      color: TEXT_LIGHT,
      bold: true
    });

    // Score badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.4,
      y: 3.1,
      w: 4.8,
      h: 0.8,
      rectRadius: 0.1,
      fill: { color: '2A1E14' },
      line: { color: AMBER, width: 1 }
    });

    slide.addText('HARMONY SCORE: 94% • HARMONIC CHORD', {
      x: 7.4,
      y: 3.35,
      w: 4.8,
      h: 0.3,
      fontSize: 12,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      align: 'center'
    });

    slide.addText(
      'Why it works:\n• Base Fixation: Deep smoked agarwood anchors delicate rose petals.\n• Volatility Envelope: Rose blooms at T+15m; Oud develops fully at T+2h.\n• Application Method: 2 sprays Oud on chest, 1 mist Rose on collarbones.\n• Result: Timeless imperial sillage with 10+ hours longevity.',
      {
        x: 7.4,
        y: 4.1,
        w: 4.8,
        h: 2.3,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 18
      }
    );
  }

  // ==================== SLIDE 6: CONTEXTUAL INTELLIGENCE ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'Real-Time Climate & Evaporation Dynamics', 'Contextual Intelligence');

    // Weather impact cards
    const weatherCards = [
      {
        condition: 'High Heat (32°C+)',
        effect: 'Rapid Evaporation',
        desc: 'Top notes flash off in minutes. Heavy gourmands can become suffocating. Algorithm boosts crisp Vetiver & citrus recommendations.',
        badge: 'Summer / Tropics'
      },
      {
        condition: 'High Humidity (70%+)',
        effect: 'Amplified Projection',
        desc: 'Moisture in air traps aroma chemicals, creating huge sillage. Algorithm advises reducing spray count by 40%.',
        badge: 'Monsoon / Coastal'
      },
      {
        condition: 'Crisp Cold (<15°C)',
        effect: 'Suppressed Volatility',
        desc: 'Molecules struggle to evaporate. Deep ambers, spices, and resinous woods shine, creating a warm, comforting bubble.',
        badge: 'Autumn / Winter'
      }
    ];

    weatherCards.forEach((w, idx) => {
      const cx = 0.8 + idx * 3.95;
      slide.addShape(pres.ShapeType.rect, {
        x: cx,
        y: 1.9,
        w: 3.75,
        h: 2.6,
        fill: { color: BG_CARD },
        line: { color: BORDER_COLOR, width: 1 }
      });

      slide.addText(w.badge.toUpperCase(), {
        x: cx + 0.25,
        y: 2.1,
        w: 3.25,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        color: GOLD,
        bold: true
      });

      slide.addText(w.condition, {
        x: cx + 0.25,
        y: 2.35,
        w: 3.25,
        h: 0.4,
        fontSize: 16,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });

      slide.addText(w.effect, {
        x: cx + 0.25,
        y: 2.75,
        w: 3.25,
        h: 0.3,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: AMBER,
        bold: true
      });

      slide.addText(w.desc, {
        x: cx + 0.25,
        y: 3.1,
        w: 3.25,
        h: 1.25,
        fontSize: 10.5,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 15
      });
    });

    // Timeline banner at bottom
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 4.7,
      w: 11.65,
      h: 2.0,
      fill: { color: '1A1410' },
      line: { color: GOLD, width: 0.75 }
    });

    slide.addText('PERFUMER\'S EVAPORATION TIMELINE (HEADSPACE DYNAMICS)', {
      x: 1.1,
      y: 4.85,
      w: 11.0,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 2
    });

    const timelineStages = [
      { time: 'T + 0m (Flash)', notes: 'Volatile Top Notes', desc: 'Citrus, aldehyde, green burst' },
      { time: 'T + 15m (Bloom)', notes: 'Heart Accord Arises', desc: 'Jasmine, Damask rose, spices' },
      { time: 'T + 2h (Full Chord)', notes: 'True Body Emerges', desc: 'Full harmony of layer synergy' },
      { time: 'T + 6h (Fixation)', notes: 'Base Resonance', desc: 'Sandalwood, amber, oud core' },
      { time: 'T + 12h+ (Drydown)', notes: 'Skin Shadow', desc: 'Subtle musks and resin trace' }
    ];

    timelineStages.forEach((ts, idx) => {
      const tx = 1.1 + idx * 2.25;
      slide.addText(ts.time, {
        x: tx,
        y: 5.25,
        w: 2.1,
        h: 0.3,
        fontSize: 11,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });
      slide.addText(ts.notes, {
        x: tx,
        y: 5.55,
        w: 2.1,
        h: 0.25,
        fontSize: 9.5,
        fontFace: 'Helvetica Neue',
        color: GOLD,
        bold: true
      });
      slide.addText(ts.desc, {
        x: tx,
        y: 5.8,
        w: 2.1,
        h: 0.7,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED
      });
    });
  }

  // ==================== SLIDE 7: HERITAGE & MODERN TECH ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'Where Heritage Perfumery Meets Artificial Intelligence', 'Cultural Depth');

    // Left card: Kannauj Heritage
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.9,
      w: 5.6,
      h: 4.8,
      fill: { color: BG_CARD },
      line: { color: BORDER_COLOR, width: 1 }
    });

    slide.addText('ANCIENT KANNAUJ & HYDRO-DISTILLATION', {
      x: 1.1,
      y: 2.2,
      w: 5.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText('The Perfume Capital of India', {
      x: 1.1,
      y: 2.5,
      w: 5.0,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Georgia',
      color: TEXT_LIGHT,
      bold: true
    });

    slide.addText(
      'For over 1,000 years, master distillers in Kannauj have practiced Deg-Bhapka—distilling fresh blossoms and riverbed clay in copper cauldrons over wood fires into pure sandalwood oil receivers.\n\nOlfactory AI encodes these ancient formulas into its vector database, preserving rare botanical traditions that synthetic Western commercial perfumery has forgotten.',
      {
        x: 1.1,
        y: 3.1,
        w: 5.0,
        h: 2.2,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 18
      }
    );

    // Sacred notes tags
    const tags = ['Deg-Bhapka', 'Mitti Attar (Baked Earth)', 'Ruh Khus (Wild Vetiver)', 'Shamamatul Amber'];
    tags.forEach((t, i) => {
      const tx = 1.1 + (i % 2) * 2.5;
      const ty = 5.4 + Math.floor(i / 2) * 0.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: tx,
        y: ty,
        w: 2.3,
        h: 0.4,
        rectRadius: 0.08,
        fill: { color: '2A1E14' },
        line: { color: GOLD, width: 0.5 }
      });
      slide.addText(t, {
        x: tx,
        y: ty + 0.08,
        w: 2.3,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        color: GOLD,
        bold: true,
        align: 'center'
      });
    });

    // Right card: Contemporary AI Platform
    slide.addShape(pres.ShapeType.rect, {
      x: 6.8,
      y: 1.9,
      w: 5.65,
      h: 4.8,
      fill: { color: BG_CARD },
      line: { color: BORDER_COLOR, width: 1 }
    });

    slide.addText('MODERN AI-POWERED DISCOVERY', {
      x: 7.1,
      y: 2.2,
      w: 5.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText('Smart Digital Atelier Capabilities', {
      x: 7.1,
      y: 2.5,
      w: 5.0,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Georgia',
      color: TEXT_LIGHT,
      bold: true
    });

    const aiFeatures = [
      { title: 'Personal Vault & Wardrobe', desc: 'Catalog owned perfumes and track usage telemetry.' },
      { title: 'AI Perfume Scanner', desc: 'Scan perfume bottles to extract note pyramids and compatibility in real time.' },
      { title: 'Olfactory DNA Portrait', desc: 'Generates personal sensory fingerprint and tailored archetypes.' },
      { title: 'Multisensory Atmosphere', desc: 'Bespoke ambient acoustics and soundscapes engineered for each scent family.' }
    ];

    aiFeatures.forEach((f, idx) => {
      const fy = 3.1 + idx * 0.85;
      slide.addText(f.title, {
        x: 7.1,
        y: fy,
        w: 5.0,
        h: 0.3,
        fontSize: 13,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });
      slide.addText(f.desc, {
        x: 7.1,
        y: fy + 0.28,
        w: 5.0,
        h: 0.45,
        fontSize: 10.5,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED
      });
    });
  }

  // ==================== SLIDE 8: SYSTEM ARCHITECTURE ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'System Architecture & Technical Stack', 'Engineering');

    const stackTiers = [
      {
        tier: 'PRESENTATION LAYER',
        tech: 'React 19 + TypeScript + Vite',
        details: [
          'High-precision UI with Tailwind CSS v4',
          'Smooth kinetic interactions powered by Motion',
          'Responsive physical brass instruments & dials',
          'Bespoke Lucide-based botanical glyph design system'
        ]
      },
      {
        tier: 'INTELLIGENCE & AUDIO ENGINE',
        tech: '8D Vector Engine + Web Audio API',
        details: [
          'Cosine similarity vector calculation algorithms',
          'Context engine normalizing weather, season & mood',
          'Synthesized procedural ambient soundscapes',
          'Volatility envelope prediction engine'
        ]
      },
      {
        tier: 'DATA & APPLICATION BACKEND',
        tech: 'Express.js + SQLite / sql.js',
        details: [
          'Fast in-memory SQL database with pre-clustered centroids',
          'RESTful endpoints for fragrances, layering & telemetry',
          'User behavioral telemetry & gamification tracking',
          'Zero-latency sub-millisecond chord scoring'
        ]
      }
    ];

    stackTiers.forEach((st, idx) => {
      const sx = 0.8 + idx * 3.95;
      slide.addShape(pres.ShapeType.rect, {
        x: sx,
        y: 1.9,
        w: 3.75,
        h: 4.8,
        fill: { color: BG_CARD },
        line: { color: BORDER_COLOR, width: 1 }
      });

      slide.addText(st.tier, {
        x: sx + 0.25,
        y: 2.1,
        w: 3.25,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        color: GOLD,
        bold: true,
        charSpacing: 2
      });

      slide.addText(st.tech, {
        x: sx + 0.25,
        y: 2.4,
        w: 3.25,
        h: 0.5,
        fontSize: 15,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });

      slide.addShape(pres.ShapeType.line, {
        x: sx + 0.25,
        y: 3.0,
        w: 3.25,
        h: 0,
        line: { color: BORDER_COLOR, width: 1 }
      });

      st.details.forEach((item, i) => {
        const iy = 3.2 + i * 0.85;
        slide.addShape(pres.ShapeType.ellipse, {
          x: sx + 0.25,
          y: iy + 0.05,
          w: 0.1,
          h: 0.1,
          fill: { color: GOLD }
        });
        slide.addText(item, {
          x: sx + 0.45,
          y: iy,
          w: 3.0,
          h: 0.7,
          fontSize: 11,
          fontFace: 'Helvetica Neue',
          color: TEXT_MUTED,
          lineSpacing: 16
        });
      });
    });
  }

  // ==================== SLIDE 9: KEY USER JOURNEY ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'The Interactive Atelier Experience', 'User Journey');

    const steps = [
      {
        num: '01',
        title: 'Enter The Atelier',
        desc: 'Choose an environment: The Atelier (Ivory), The Archive (Parchment), or The Chamber (Obsidian). Experience family-specific acoustic audio.'
      },
      {
        num: '02',
        title: 'Check the Climate',
        desc: 'App reads live local weather (temp, humidity, time) to calibrate projection and evaporation expectations.'
      },
      {
        num: '03',
        title: 'Explore & Layer',
        desc: 'Select 2 fragrances in the Laboratory. Watch the 8D Chord Instrument calculate the Harmony Index in real-time.'
      },
      {
        num: '04',
        title: 'Evaporation Simulation',
        desc: 'Scrub through the 12-hour timeline to see when Top notes flash, Heart florals bloom, and Base fixatives anchor.'
      },
      {
        num: '05',
        title: 'Save to Vault & Grow DNA',
        desc: 'Bookmark beloved layering accords to the personal Vault and earn rank XP from Novice to Master Perfumer.'
      }
    ];

    steps.forEach((s, idx) => {
      const sy = 1.9 + idx * 0.95;
      slide.addShape(pres.ShapeType.rect, {
        x: 0.8,
        y: sy,
        w: 11.65,
        h: 0.82,
        fill: { color: BG_CARD },
        line: { color: BORDER_COLOR, width: 1 }
      });

      slide.addText(s.num, {
        x: 1.1,
        y: sy + 0.15,
        w: 0.8,
        h: 0.5,
        fontSize: 22,
        fontFace: 'Georgia',
        color: GOLD,
        bold: true
      });

      slide.addText(s.title, {
        x: 2.1,
        y: sy + 0.22,
        w: 2.8,
        h: 0.4,
        fontSize: 13.5,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });

      slide.addText(s.desc, {
        x: 5.0,
        y: sy + 0.18,
        w: 7.2,
        h: 0.5,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 15
      });
    });
  }

  // ==================== SLIDE 10: CONCLUSION & IMPACT ====================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_DARK };
    addHeader(slide, 'Project Impact & The Future of Olfaction', 'Summary & Vision');

    // Left takeaways box
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.9,
      w: 6.8,
      h: 4.8,
      fill: { color: BG_CARD },
      line: { color: BORDER_COLOR, width: 1 }
    });

    slide.addText('CORE PROJECT TAKEAWAYS', {
      x: 1.1,
      y: 2.2,
      w: 6.2,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: GOLD,
      bold: true,
      charSpacing: 2
    });

    const takeaways = [
      { title: 'Demystifying Fragrance', desc: 'Transforms perfume exploration from subjective marketing jargon into accessible, visual, science-backed exploration.' },
      { title: 'Pioneering Alchemical Machine Learning', desc: 'Shows how vector distance models and chemical volatility can enrich high-luxury lifestyle apps.' },
      { title: 'Cultural Preservation', desc: 'Bridges centuries-old Indian artisanal perfumery (Kannauj Deg-Bhapka) with contemporary modern software.' },
      { title: 'Complete Multisensory Design', desc: 'Integrates adaptive acoustic soundscapes, tactile physical instruments, and fluid visual art direction.' }
    ];

    takeaways.forEach((t, i) => {
      const ty = 2.65 + i * 0.98;
      slide.addText(`•  ${t.title}`, {
        x: 1.1,
        y: ty,
        w: 6.2,
        h: 0.3,
        fontSize: 13,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true
      });
      slide.addText(t.desc, {
        x: 1.35,
        y: ty + 0.3,
        w: 6.0,
        h: 0.55,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: TEXT_MUTED,
        lineSpacing: 15
      });
    });

    // Right CTA / Q&A Box
    slide.addShape(pres.ShapeType.rect, {
      x: 7.9,
      y: 1.9,
      w: 4.55,
      h: 4.8,
      fill: { color: '1A1410' },
      line: { color: GOLD, width: 1 }
    });

    slide.addText('THANK YOU', {
      x: 8.2,
      y: 2.6,
      w: 3.95,
      h: 0.5,
      fontSize: 26,
      fontFace: 'Georgia',
      color: GOLD,
      bold: true,
      align: 'center'
    });

    slide.addText('Olfactory AI is ready for live demonstration.', {
      x: 8.2,
      y: 3.2,
      w: 3.95,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      color: TEXT_LIGHT,
      align: 'center'
    });

    slide.addText('Questions & Discussion\n\nExperience the live digital atelier:\n• Live 8D Vector Visualizer\n• Interactive Evaporation Timeline\n• Harmonic Chord Laboratory', {
      x: 8.2,
      y: 3.9,
      w: 3.95,
      h: 1.8,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      color: TEXT_MUTED,
      align: 'center',
      lineSpacing: 18
    });

    slide.addText('OLFACTORY AI • 2026', {
      x: 8.2,
      y: 6.1,
      w: 3.95,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Courier New',
      color: '7A6E61',
      align: 'center'
    });
  }

  // Ensure public folder exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'Olfactory_AI_Presentation.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation generated successfully at ${outputPath}`);
}

buildPresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
