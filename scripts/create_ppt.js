import pptxgen from "pptxgenjs";
import path from "path";
import fs from "fs";

async function generateDeck() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Olfactory AI";
  pptx.company = "Olfactory AI Atelier";
  pptx.subject = "Olfactory AI - The Intelligent Digital Fragrance Atelier";
  pptx.title = "Olfactory AI Presentation";

  // Color Palette
  const C_DARK_BG = "0E0C0A";
  const C_CARD_BG = "191410";
  const C_LIGHT_CARD = "FDFBF7";
  const C_LIGHT_BG = "FAF7F2";
  const C_GOLD = "D4AF37";
  const C_AMBER = "D97706";
  const C_LIGHT_TEXT = "F3EFEA";
  const C_MUTED_TEXT = "A3998E";
  const C_DARK_TEXT = "1C1713";
  const C_DARK_MUTED = "7A6F66";
  const C_BORDER_GOLD = "C59A3F";

  // Helper for footer on every content slide
  function addSlideFooter(slide, currentNum, totalNum) {
    slide.addText("OLFACTORY AI  |  The Intelligent Fragrance Atelier", {
      x: 0.8,
      y: 7.1,
      w: 8.0,
      h: 0.3,
      fontSize: 9,
      fontFace: "Georgia",
      color: "7A6F66",
      letterSpacing: 2
    });
    slide.addText(`${currentNum} / ${totalNum}`, {
      x: 11.5,
      y: 7.1,
      w: 1.0,
      h: 0.3,
      fontSize: 9,
      fontFace: "Arial",
      color: "7A6F66",
      align: "right"
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (Cover)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_BG };

    // Decorative Gold Accent Line
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.0,
      y: 1.8,
      w: 1.5,
      h: 0.04,
      fill: { color: C_GOLD },
      line: { color: C_GOLD }
    });

    slide.addText("HAUTE PARFUMERIE & MACHINE INTELLIGENCE", {
      x: 1.0,
      y: 2.0,
      w: 10.0,
      h: 0.4,
      fontSize: 11,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 4
    });

    slide.addText("OLFACTORY AI", {
      x: 1.0,
      y: 2.5,
      w: 11.0,
      h: 1.2,
      fontSize: 48,
      fontFace: "Georgia",
      color: C_LIGHT_TEXT,
      bold: true,
      letterSpacing: 6
    });

    slide.addText("The Intelligent Digital Fragrance Atelier & Alchemical Vector Platform", {
      x: 1.0,
      y: 3.8,
      w: 11.0,
      h: 0.6,
      fontSize: 20,
      fontFace: "Georgia",
      color: "E2D8CC",
      italic: true
    });

    slide.addText(
      "Bridging centuries of Kannauj botanical hydro-distillation with 8-dimensional olfactory coordinate spaces and real-time climate evaporation physics.",
      {
        x: 1.0,
        y: 4.6,
        w: 9.5,
        h: 0.8,
        fontSize: 14,
        fontFace: "Arial",
        color: C_MUTED_TEXT,
        lineSpacing: 22
      }
    );

    // Bottom Metadata Card
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.0,
      y: 5.8,
      w: 11.33,
      h: 0.8,
      fill: { color: C_CARD_BG },
      line: { color: "33281E", width: 1 }
    });

    slide.addText("PRESENTATION DECK  •  VERSION 2.4  •  CONFIDENTIAL & PROPRIETARY", {
      x: 1.3,
      y: 6.05,
      w: 10.7,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_GOLD,
      letterSpacing: 2
    });
  }

  // ==========================================
  // SLIDE 2: Executive Summary & The Problem Space
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_LIGHT_BG };

    slide.addText("EXECUTIVE SUMMARY", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_AMBER,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("Solving the Invisibility & Blindness of Fragrance Online", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_DARK_TEXT,
      bold: true
    });

    // 2 Column Comparison: The Problem vs The Olfactory AI Solution
    // Box 1: The Status Quo Problem
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: 1.9,
      w: 5.6,
      h: 4.8,
      fill: { color: "F3ECE1" },
      line: { color: "DDD1C0", width: 1 }
    });

    slide.addText("THE STATUS QUO PROBLEM", {
      x: 1.1,
      y: 2.2,
      w: 5.0,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      color: "A04020",
      bold: true,
      letterSpacing: 2
    });

    slide.addText("Sensory Disconnect in Digital Retail", {
      x: 1.1,
      y: 2.5,
      w: 5.0,
      h: 0.4,
      fontSize: 18,
      fontFace: "Georgia",
      color: C_DARK_TEXT,
      bold: true
    });

    const problemPoints = [
      { text: "• Subjective Marketing Hype: Consumers purchase based on romanticized adjectives rather than chemical reality.", options: { breakLine: true } },
      { text: "• High E-commerce Blind Returns: Fragrance has one of the highest online return and dissatisfaction rates.", options: { breakLine: true } },
      { text: "• Unpredictable Layering: Users experiment blindly, creating discordant or clashing olfactory accords.", options: { breakLine: true } },
      { text: "• Climate Ignorance: Scents behave radically differently in 35°C monsoon humidity vs. 10°C dry European winter.", options: { breakLine: true } }
    ];

    slide.addText(problemPoints, {
      x: 1.1,
      y: 3.1,
      w: 5.0,
      h: 3.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C_DARK_MUTED,
      lineSpacing: 22
    });

    // Box 2: The Olfactory AI Solution
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 6.8,
      y: 1.9,
      w: 5.7,
      h: 4.8,
      fill: { color: C_LIGHT_CARD },
      line: { color: C_BORDER_GOLD, width: 1.5 }
    });

    slide.addText("THE OLFACTORY AI PLATFORM", {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      color: C_AMBER,
      bold: true,
      letterSpacing: 2
    });

    slide.addText("Algorithmic Transparency & Precision", {
      x: 7.1,
      y: 2.5,
      w: 5.1,
      h: 0.4,
      fontSize: 18,
      fontFace: "Georgia",
      color: C_DARK_TEXT,
      bold: true
    });

    const solutionPoints = [
      { text: "• 8-Dimensional Vectorization: Every fragrance is mapped along 8 sensory coordinates from Terpene Freshness to Fixative Anchor.", options: { breakLine: true } },
      { text: "• Mathematical Compatibility Index: Computes Euclidean vector distance and chord resonance (0-100%) before layering.", options: { breakLine: true } },
      { text: "• Real-Time Environmental Adaptation: Computes local temperature, humidity, and time-of-day evaporation curves.", options: { breakLine: true } },
      { text: "• Immersive Sensory Atelier: Calibrated digital instruments, bespoke vector radar, and evocative ambient soundscapes.", options: { breakLine: true } }
    ];

    slide.addText(solutionPoints, {
      x: 7.1,
      y: 3.1,
      w: 5.1,
      h: 3.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C_DARK_TEXT,
      lineSpacing: 22
    });

    addSlideFooter(slide, 2, 10);
  }

  // ==========================================
  // SLIDE 3: The Three Visual Worlds of the Atelier
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText("DESIGN SYSTEM & LIVING ARCHITECTURE", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("The Three Visual Worlds of Olfactory AI", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_LIGHT_TEXT,
      bold: true
    });

    // 3 Cards for the 3 Worlds
    const worlds = [
      {
        title: "THE LIVING ATELIER",
        subtitle: "Private Salon & Wardrobe",
        desc: "Warm ivory, soft alabaster, walnut, champagne, and subtle botanical reflections. Welcoming, luxurious, cinematic.",
        features: ["• Bespoke Daily Wear Rituals", "• Personal Fragrance Vault", "• Weather-Reactive Prescriptions", "• Community Fragrance Society"]
      },
      {
        title: "THE HERITAGE ARCHIVE",
        subtitle: "Ancient Botanical Codex",
        desc: "Aged parchment, terracotta, oxidized copper, olive leaf, and antique Kannauj copper still heritage.",
        features: ["• Deg-Bhapka Distillation Codex", "• Mitti Attar & Sacred Saffron Lore", "• Botanical Sourcing Maps", "• Perfumery Masterclasses & Academy"]
      },
      {
        title: "THE OLFACTORY CHAMBER",
        subtitle: "Precision Laboratory",
        desc: "Smoked obsidian, deep espresso, burnished gold dials, and precision alchemical measuring instruments.",
        features: ["• 8D Vector Radar Coordinates", "• Dual & Triple Layering Matrix", "• Mathematical Harmony Index", "• Headspace Evaporation Dynamics"]
      }
    ];

    worlds.forEach((w, i) => {
      const cardX = 0.8 + i * 4.0;
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: cardX,
        y: 1.9,
        w: 3.7,
        h: 4.8,
        fill: { color: C_CARD_BG },
        line: { color: i === 2 ? C_GOLD : "3A2F25", width: i === 2 ? 1.5 : 1 }
      });

      slide.addText(w.title, {
        x: cardX + 0.3,
        y: 2.2,
        w: 3.1,
        h: 0.3,
        fontSize: 11,
        fontFace: "Arial",
        color: C_GOLD,
        bold: true,
        letterSpacing: 2
      });

      slide.addText(w.subtitle, {
        x: cardX + 0.3,
        y: 2.5,
        w: 3.1,
        h: 0.4,
        fontSize: 16,
        fontFace: "Georgia",
        color: C_LIGHT_TEXT,
        bold: true
      });

      slide.addText(w.desc, {
        x: cardX + 0.3,
        y: 3.0,
        w: 3.1,
        h: 1.0,
        fontSize: 11,
        fontFace: "Arial",
        color: C_MUTED_TEXT,
        lineSpacing: 18
      });

      const featureText = w.features.map(f => ({ text: f, options: { breakLine: true } }));
      slide.addText(featureText, {
        x: cardX + 0.3,
        y: 4.2,
        w: 3.1,
        h: 2.2,
        fontSize: 11,
        fontFace: "Arial",
        color: "DCD5CC",
        lineSpacing: 20
      });
    });

    addSlideFooter(slide, 3, 10);
  }

  // ==========================================
  // SLIDE 4: The 8-Dimensional Olfactory Coordinate Space
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_LIGHT_BG };

    slide.addText("MATHEMATICAL FORMULATION", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_AMBER,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("The 8D Olfactory Vector Space Matrix", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_DARK_TEXT,
      bold: true
    });

    // 8-Dimension Grid (2 rows x 4 columns)
    const dimensions = [
      { name: "1. Freshness", key: "Terpenes & Aldehydes", desc: "Citrus, bergamot, neroli, ozone. High volatility top notes that dissipate rapidly." },
      { name: "2. Sweetness", key: "Gourmand & Lactonic", desc: "Vanillin, toasted tonka, honey, ethyl maltol. Rounding and comforting accords." },
      { name: "3. Intensity", key: "Projection & Sillage", desc: "Diffusive power and radius of the scent plume in still vs circulating air." },
      { name: "4. Woody", key: "Heartwood & Roots", desc: "Sandalwood, Virginia cedar, Haitian vetiver. Structural architectural skeleton." },
      { name: "5. Floral", key: "Petals & Nectars", desc: "Rose Damascena, Jasmine Sambac, Ylang Ylang. Heart complexity and emotional depth." },
      { name: "6. Warm Spices", key: "Resins & Phenols", desc: "Kashmiri saffron, cardamom, frankincense, labdanum. Opulent thermal heat." },
      { name: "7. Earth & Clay", key: "Geosmin & Terpenoids", desc: "Kannauj baked earth (Mitti Attar), patchouli, damp soil, petrichor." },
      { name: "8. Longevity", key: "Fixative Foundation", desc: "Ambroxan, musk, ambergris, heavy woods. Chemical anchors halting evaporation." }
    ];

    dimensions.forEach((d, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const xPos = 0.8 + col * 2.95;
      const yPos = 1.9 + row * 2.5;

      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 2.8,
        h: 2.3,
        fill: { color: C_LIGHT_CARD },
        line: { color: "E2D8CC", width: 1 }
      });

      slide.addText(d.name, {
        x: xPos + 0.2,
        y: yPos + 0.2,
        w: 2.4,
        h: 0.3,
        fontSize: 13,
        fontFace: "Georgia",
        color: C_AMBER,
        bold: true
      });

      slide.addText(d.key, {
        x: xPos + 0.2,
        y: yPos + 0.55,
        w: 2.4,
        h: 0.25,
        fontSize: 9,
        fontFace: "Arial",
        color: C_DARK_MUTED,
        bold: true,
        letterSpacing: 1
      });

      slide.addText(d.desc, {
        x: xPos + 0.2,
        y: yPos + 0.85,
        w: 2.4,
        h: 1.3,
        fontSize: 10.5,
        fontFace: "Arial",
        color: C_DARK_TEXT,
        lineSpacing: 16
      });
    });

    addSlideFooter(slide, 4, 10);
  }

  // ==========================================
  // SLIDE 5: Evaporation Dynamics & Climate Physics
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText("ATMOSPHERIC PHYSICS", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("Headspace Volatility & Weather Grounding", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_LIGHT_TEXT,
      bold: true
    });

    // 5 Stages of Drydown Table
    const drydownStages = [
      { time: "0 Min (Flash)", accord: "Opening Top Volatiles", desc: "Citrus, terpenes, aldehydes burst with immediate high-impact diffusion." },
      { time: "15 Min (Bloom)", accord: "Heart Transition", desc: "Top alcohol flash burns off; delicate spices, floracy, and heart notes blossom." },
      { time: "2 Hours (Heart)", accord: "Peak Sillage Equilibrium", desc: "Harmonic stabilization; full sillage aura and projection radius reached." },
      { time: "6 Hours (Fixation)", accord: "Resinous Base Foundation", desc: "Woody fixatives, ambers, and heavy resins bond with personal skin chemistry." },
      { time: "12+ Hours (Shadow)", accord: "Fixative Skin Residual", desc: "Subtle intimate scent envelope remaining on pulse points and natural fibers." }
    ];

    drydownStages.forEach((s, i) => {
      const y = 1.9 + i * 0.95;
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.8,
        y: y,
        w: 11.7,
        h: 0.85,
        fill: { color: i % 2 === 0 ? C_CARD_BG : "120F0C" },
        line: { color: i === 2 ? C_GOLD : "2E251D", width: i === 2 ? 1.2 : 0.8 }
      });

      slide.addText(s.time, {
        x: 1.0,
        y: y + 0.25,
        w: 2.3,
        h: 0.35,
        fontSize: 12,
        fontFace: "Arial",
        color: C_GOLD,
        bold: true
      });

      slide.addText(s.accord, {
        x: 3.4,
        y: y + 0.25,
        w: 3.2,
        h: 0.35,
        fontSize: 12,
        fontFace: "Georgia",
        color: C_LIGHT_TEXT,
        bold: true
      });

      slide.addText(s.desc, {
        x: 6.8,
        y: y + 0.15,
        w: 5.4,
        h: 0.55,
        fontSize: 11,
        fontFace: "Arial",
        color: C_MUTED_TEXT,
        lineSpacing: 16
      });
    });

    addSlideFooter(slide, 5, 10);
  }

  // ==========================================
  // SLIDE 6: Dual & Triple Fragrance Layering Engine
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_LIGHT_BG };

    slide.addText("CHAMBER SYNTHESIS", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_AMBER,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("Alchemical Compatibility & Clash Detection", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_DARK_TEXT,
      bold: true
    });

    // 3 Cards: Compatibility Metrics
    const metrics = [
      {
        title: "HARMONIC SCORE (0-100%)",
        desc: "Weighted tensor dot-product evaluating shared fixative anchors, complementary volatility rates, and accord balance.",
        example: "e.g., Mitti Attar (Earth) + Rose Damascena (Floral) = 94% Synergistic Harmony"
      },
      {
        title: "CLASH WARNING SYSTEM",
        desc: "Automated alert flags competing olfactory frequencies, such as heavy indolic whites clashing with screechy synthetic ozonics.",
        example: "e.g., Heavy Civet Musk vs. Delicate Aquatic Calone flagged as Discordant Tension"
      },
      {
        title: "APPLICATION RATIOS & SILLAGE",
        desc: "Algorithmic pulse-point distribution instructions (e.g., 2 sprays base resin on collarbone + 1 spray citrus heart on wrists).",
        example: "e.g., Spatial placement prevents heavier oud notes from smothering ephemeral florals"
      }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.8 + idx * 4.0;
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 1.9,
        w: 3.7,
        h: 4.8,
        fill: { color: C_LIGHT_CARD },
        line: { color: "DDD0BE", width: 1 }
      });

      slide.addText(m.title, {
        x: xPos + 0.3,
        y: 2.2,
        w: 3.1,
        h: 0.4,
        fontSize: 12,
        fontFace: "Arial",
        color: C_AMBER,
        bold: true,
        letterSpacing: 1.5
      });

      slide.addText(m.desc, {
        x: xPos + 0.3,
        y: 2.8,
        w: 3.1,
        h: 1.8,
        fontSize: 12,
        fontFace: "Arial",
        color: C_DARK_TEXT,
        lineSpacing: 20
      });

      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos + 0.3,
        y: 4.8,
        w: 3.1,
        h: 1.5,
        fill: { color: "F3EDE4" },
        line: { color: "E2D5C4", width: 1 }
      });

      slide.addText("PRACTICAL APPLICATION", {
        x: xPos + 0.4,
        y: 4.95,
        w: 2.9,
        h: 0.25,
        fontSize: 9,
        fontFace: "Arial",
        color: C_DARK_MUTED,
        bold: true,
        letterSpacing: 1
      });

      slide.addText(m.example, {
        x: xPos + 0.4,
        y: 5.25,
        w: 2.9,
        h: 0.95,
        fontSize: 10.5,
        fontFace: "Georgia",
        color: C_DARK_TEXT,
        italic: true,
        lineSpacing: 16
      });
    });

    addSlideFooter(slide, 6, 10);
  }

  // ==========================================
  // SLIDE 7: Technical Architecture & Engineering Rigor
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText("ENGINEERING STACK", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("Full-Stack Architecture & Reactive Audio Engine", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_LIGHT_TEXT,
      bold: true
    });

    // 4 Stack Pillars
    const stackItems = [
      {
        layer: "UI / UX ENGINE",
        tech: "React 19 + TypeScript + Motion",
        bullets: [
          "• Dynamic visual world styling switching without full-page remounts",
          "• Bespoke zero-dependency SVG Atelier Glyphs and precision instrument bezels",
          "• Responsive touch-optimized mobile rail with haptic spring feedback"
        ]
      },
      {
        layer: "VECTOR GEOMETRY",
        tech: "Custom Mathematical SVG Pipelines",
        bullets: [
          "• 60 FPS real-time 8D radar polygons and overlapping chord overlays",
          "• Cubic Bezier drydown curves calculated from molecular volatility constants",
          "• Zero heavy 3D rendering dependencies for instant mobile cold-starts"
        ]
      },
      {
        layer: "ACOUSTIC ATMOSPHERE",
        tech: "Web Audio Generative Synthesizer",
        bullets: [
          "• Algorithmic ambient soundscapes reacting to dominant fragrance families",
          "• Monsoonal rain for Mitti Attar, warm wood resonance for Oud, petal whispers for Rose",
          "• Client-side synthesis without streaming network bandwidth"
        ]
      },
      {
        layer: "INTELLIGENCE & DATA",
        tech: "Local SQLite + Gemini API Integration",
        bullets: [
          "• Comprehensive fragrance catalog with full 8D coordinate metadata",
          "• AI-driven bespoke recommendation & narrative perfume descriptions",
          "• Secure offline-first synchronization of user fragrance vaults & wear history"
        ]
      }
    ];

    stackItems.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + col * 5.95;
      const yPos = 1.9 + row * 2.5;

      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 5.7,
        h: 2.3,
        fill: { color: C_CARD_BG },
        line: { color: "382D23", width: 1 }
      });

      slide.addText(item.layer, {
        x: xPos + 0.3,
        y: yPos + 0.2,
        w: 5.1,
        h: 0.25,
        fontSize: 10,
        fontFace: "Arial",
        color: C_GOLD,
        bold: true,
        letterSpacing: 2
      });

      slide.addText(item.tech, {
        x: xPos + 0.3,
        y: yPos + 0.45,
        w: 5.1,
        h: 0.35,
        fontSize: 14,
        fontFace: "Georgia",
        color: C_LIGHT_TEXT,
        bold: true
      });

      const bulletLines = item.bullets.map(b => ({ text: b, options: { breakLine: true } }));
      slide.addText(bulletLines, {
        x: xPos + 0.3,
        y: yPos + 0.85,
        w: 5.1,
        h: 1.3,
        fontSize: 10.5,
        fontFace: "Arial",
        color: C_MUTED_TEXT,
        lineSpacing: 18
      });
    });

    addSlideFooter(slide, 7, 10);
  }

  // ==========================================
  // SLIDE 8: Market Opportunity & Business Impact
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_LIGHT_BG };

    slide.addText("BUSINESS VIABILITY", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_AMBER,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("Market Opportunity & Commercial Applications", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_DARK_TEXT,
      bold: true
    });

    // 3 Value Pillars
    const valuePillars = [
      {
        title: "$60B+ GLOBAL FRAGRANCE",
        sub: "Rapid Shift to Artisanal & Niche",
        desc: "Consumers are moving away from mass designer scents toward bespoke, niche, and heritage perfume houses demanding personal guidance."
      },
      {
        title: "RETAIL SALES ACCELERATION",
        sub: "Scent Discovery Kiosk & Web SDK",
        desc: "Luxury department stores and e-commerce platforms can embed the Olfactory AI engine to provide consultative scent consultations."
      },
      {
        title: "LIFETIME VALUE EXPANSION",
        sub: "Wardrobe Retention & Replenishment",
        desc: "Digitizing consumer wardrobes enables personalized replenishment reminders, seasonal rotation prompts, and targeted layering add-ons."
      }
    ];

    valuePillars.forEach((v, idx) => {
      const xPos = 0.8 + idx * 4.0;
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 1.9,
        w: 3.7,
        h: 4.8,
        fill: { color: C_LIGHT_CARD },
        line: { color: "DDD0BE", width: 1 }
      });

      slide.addText(v.title, {
        x: xPos + 0.3,
        y: 2.3,
        w: 3.1,
        h: 0.4,
        fontSize: 13,
        fontFace: "Arial",
        color: C_AMBER,
        bold: true,
        letterSpacing: 1.5
      });

      slide.addText(v.sub, {
        x: xPos + 0.3,
        y: 2.8,
        w: 3.1,
        h: 0.6,
        fontSize: 16,
        fontFace: "Georgia",
        color: C_DARK_TEXT,
        bold: true
      });

      slide.addText(v.desc, {
        x: xPos + 0.3,
        y: 3.6,
        w: 3.1,
        h: 2.8,
        fontSize: 12,
        fontFace: "Arial",
        color: C_DARK_MUTED,
        lineSpacing: 22
      });
    });

    addSlideFooter(slide, 8, 10);
  }

  // ==========================================
  // SLIDE 9: Strategic Roadmap & Future Milestones
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText("STRATEGIC ROADMAP", {
      x: 0.8,
      y: 0.7,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 3
    });

    slide.addText("Product Horizon & Technology Expansion", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      fontFace: "Georgia",
      color: C_LIGHT_TEXT,
      bold: true
    });

    const roadmapPhases = [
      {
        phase: "PHASE 1 (CURRENT)",
        title: "Living Atelier & 8D Vector Foundation",
        points: ["• 8D Olfactory Vectorization Engine", "• Dual & Triple Layering Chord Visualizer", "• Weather-Reactive Daily Wear Prescriptions", "• Heritage Kannauj Hydro-Distillation Archive"]
      },
      {
        phase: "PHASE 2 (NEAR-TERM)",
        title: "Optical Flacon Vision & Scanner",
        points: ["• Mobile camera OCR recognition of perfume flacons", "• Automatic extraction of top/heart/base pyramid", "• One-tap import into user digital wardrobe", "• Crowd-sourced community compatibility ratings"]
      },
      {
        phase: "PHASE 3 (MEDIUM-TERM)",
        title: "Bespoke Formula Compounding API",
        points: ["• Partnership with certified compounding labs", "• Order physical bespoke 50ml flacons created in Chamber", "• Custom laser-engraved flacon cap and personalized packaging", "• Blockchain bottle authentication certificate"]
      },
      {
        phase: "PHASE 4 (FUTURE)",
        title: "Electronic Nose & IoT Micro-Diffusion",
        points: ["• Ambient room diffuser synchronization", "• Scent calibration for hospitality and luxury hotels", "• Real-time digital scent translation hardware", "• Biometric skin-pH olfactory tailoring"]
      }
    ];

    roadmapPhases.forEach((rp, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 1.9,
        w: 2.8,
        h: 4.8,
        fill: { color: C_CARD_BG },
        line: { color: idx === 0 ? C_GOLD : "382D23", width: idx === 0 ? 1.5 : 1 }
      });

      slide.addText(rp.phase, {
        x: xPos + 0.2,
        y: 2.2,
        w: 2.4,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        color: C_GOLD,
        bold: true,
        letterSpacing: 2
      });

      slide.addText(rp.title, {
        x: xPos + 0.2,
        y: 2.5,
        w: 2.4,
        h: 0.8,
        fontSize: 14,
        fontFace: "Georgia",
        color: C_LIGHT_TEXT,
        bold: true
      });

      const bullets = rp.points.map(p => ({ text: p, options: { breakLine: true } }));
      slide.addText(bullets, {
        x: xPos + 0.2,
        y: 3.4,
        w: 2.4,
        h: 3.0,
        fontSize: 10.5,
        fontFace: "Arial",
        color: C_MUTED_TEXT,
        lineSpacing: 18
      });
    });

    addSlideFooter(slide, 9, 10);
  }

  // ==========================================
  // SLIDE 10: Conclusion & Contact
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.0,
      y: 1.5,
      w: 1.5,
      h: 0.04,
      fill: { color: C_GOLD },
      line: { color: C_GOLD }
    });

    slide.addText("EXPERIENCE THE ATELIER", {
      x: 1.0,
      y: 1.8,
      w: 8.0,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 4
    });

    slide.addText("The Future of Scent is Intelligently Measured.", {
      x: 1.0,
      y: 2.3,
      w: 11.0,
      h: 1.2,
      fontSize: 38,
      fontFace: "Georgia",
      color: C_LIGHT_TEXT,
      bold: true
    });

    slide.addText(
      "Olfactory AI bridges the sacred organic intimacy of perfumery with the rigorous beauty of vector geometry, making scent accessible, layerable, and deeply personal.",
      {
        x: 1.0,
        y: 3.7,
        w: 9.5,
        h: 0.9,
        fontSize: 16,
        fontFace: "Arial",
        color: C_MUTED_TEXT,
        lineSpacing: 24
      }
    );

    // Contact & Resource Card
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.0,
      y: 4.8,
      w: 11.33,
      h: 1.8,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER_GOLD, width: 1.2 }
    });

    slide.addText("PROJECT ACCESS & LINKS", {
      x: 1.3,
      y: 5.0,
      w: 5.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C_GOLD,
      bold: true,
      letterSpacing: 2
    });

    slide.addText([
      { text: "• Live Interactive Atelier: ", options: { bold: true, color: C_LIGHT_TEXT } },
      { text: "https://ais-pre-gdhzxthhl6ucklmntaqlgw-943248683897.asia-southeast1.run.app", options: { color: "93C5FD", breakLine: true } },
      { text: "• Direct PowerPoint Presentation File: ", options: { bold: true, color: C_LIGHT_TEXT } },
      { text: "/Olfactory_AI_Presentation.pptx", options: { color: "D4AF37", breakLine: true } },
      { text: "• Inquiries: ", options: { bold: true, color: C_LIGHT_TEXT } },
      { text: "atelier@olfactory.ai  |  Bengaluru & Grasse", options: { color: C_MUTED_TEXT } }
    ], {
      x: 1.3,
      y: 5.35,
      w: 10.7,
      h: 1.1,
      fontSize: 11.5,
      fontFace: "Arial",
      lineSpacing: 20
    });

    addSlideFooter(slide, 10, 10);
  }

  // Ensure output directory exists and write the file
  const outPath = path.resolve("./public/Olfactory_AI_Presentation.pptx");
  await pptx.writeFile({ fileName: outPath });
  console.log(`Presentation successfully created at ${outPath}`);
}

generateDeck().catch((err) => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
