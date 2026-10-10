import PptxGenJS from 'pptxgenjs';
import { PRESENTATION_METADATA, PRESENTATION_SLIDES, PresentationSlide } from '../data/presentationData.js';

/**
 * Builds the complete Olfactory AI PowerPoint presentation with high visual polish,
 * 16:9 widescreen layout, custom card designs, and detailed speaker notes.
 */
export function createOlfactoryAIPresentation(): PptxGenJS {
  const pres = new PptxGenJS();

  // Configure presentation properties
  pres.layout = 'LAYOUT_16x9';
  pres.author = PRESENTATION_METADATA.author;
  pres.company = PRESENTATION_METADATA.organization;
  pres.title = PRESENTATION_METADATA.title;
  pres.subject = PRESENTATION_METADATA.subtitle;

  // Slide dimensions: 10.0 in wide by 5.625 in high
  const SLIDE_WIDTH = 10.0;
  const SLIDE_HEIGHT = 5.625;

  // Master themes & colors
  const BG_COLOR = '120F0D';
  const CARD_BG = '1C1713';
  const CARD_BORDER = '382E25';
  const ACCENT_GOLD = 'C59A3F';
  const ACCENT_AMBER = 'D97706';
  const TEXT_LIGHT = 'F7F4EF';
  const TEXT_MUTED = 'A69B8F';
  const FOOTER_COLOR = '6E645A';

  // Render each slide
  PRESENTATION_SLIDES.forEach((slideData: PresentationSlide, index: number) => {
    const slide = pres.addSlide();

    // 1. Dark Luxury Background
    slide.background = { color: BG_COLOR };

    // 2. Subtle Top Brass Hairline Accent
    slide.addShape(pres.ShapeType.rect, {
      x: 0.6,
      y: 0.25,
      w: SLIDE_WIDTH - 1.2,
      h: 0.015,
      fill: { color: ACCENT_GOLD },
      line: { color: ACCENT_GOLD, width: 0 }
    });

    // 3. Category Pill / Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 0.42,
      w: 2.3,
      h: 0.28,
      fill: { color: '241D17' },
      line: { color: ACCENT_GOLD, width: 0.75 },
      rectRadius: 0.06
    });

    slide.addText(slideData.category, {
      x: 0.6,
      y: 0.42,
      w: 2.3,
      h: 0.28,
      fontSize: 8.5,
      fontFace: 'Calibri',
      color: ACCENT_GOLD,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    // 4. Slide Counter (top right)
    slide.addText(slideData.slideNumber, {
      x: SLIDE_WIDTH - 2.2,
      y: 0.42,
      w: 1.6,
      h: 0.28,
      fontSize: 9.5,
      fontFace: 'Calibri',
      color: TEXT_MUTED,
      align: 'right',
      valign: 'middle'
    });

    // 5. Slide Title (Editorial Serif)
    slide.addText(slideData.title, {
      x: 0.6,
      y: 0.76,
      w: SLIDE_WIDTH - 1.2,
      h: 0.52,
      fontSize: 22,
      fontFace: 'Georgia',
      color: TEXT_LIGHT,
      bold: true,
      valign: 'top'
    });

    // 6. Subtitle (Champagne/Amber)
    slide.addText(slideData.subtitle, {
      x: 0.6,
      y: 1.28,
      w: SLIDE_WIDTH - 1.2,
      h: 0.32,
      fontSize: 10.5,
      fontFace: 'Calibri',
      color: ACCENT_GOLD,
      italic: true,
      valign: 'top'
    });

    // 7. 4 Structured Content Cards (2x2 Grid)
    const cardW = 4.28;
    const cardH = 1.28;
    const col0X = 0.6;
    const col1X = 5.12;
    const row0Y = 1.74;
    const row1Y = 3.16;

    slideData.keyPoints.slice(0, 4).forEach((point, pIdx) => {
      const cx = pIdx % 2 === 0 ? col0X : col1X;
      const cy = pIdx < 2 ? row0Y : row1Y;

      // Card Container
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx,
        y: cy,
        w: cardW,
        h: cardH,
        fill: { color: CARD_BG },
        line: { color: CARD_BORDER, width: 0.8 },
        rectRadius: 0.08
      });

      // Card Accent Top Line
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx,
        y: cy,
        w: cardW,
        h: 0.035,
        fill: { color: ACCENT_AMBER },
        line: { color: ACCENT_AMBER, width: 0 },
        rectRadius: 0.02
      });

      // Optional Badge inside Card
      if (point.badge || point.highlight) {
        const badgeText = point.badge || point.highlight || '';
        slide.addShape(pres.ShapeType.roundRect, {
          x: cx + 0.16,
          y: cy + 0.14,
          w: Math.max(1.1, badgeText.length * 0.085),
          h: 0.22,
          fill: { color: '2E231B' },
          line: { color: ACCENT_GOLD, width: 0.5 },
          rectRadius: 0.04
        });

        slide.addText(badgeText, {
          x: cx + 0.16,
          y: cy + 0.14,
          w: Math.max(1.1, badgeText.length * 0.085),
          h: 0.22,
          fontSize: 7.5,
          fontFace: 'Calibri',
          color: ACCENT_GOLD,
          bold: true,
          align: 'center',
          valign: 'middle'
        });
      }

      // Card Title
      const titleY = (point.badge || point.highlight) ? cy + 0.40 : cy + 0.16;
      slide.addText(point.title, {
        x: cx + 0.16,
        y: titleY,
        w: cardW - 0.32,
        h: 0.28,
        fontSize: 11,
        fontFace: 'Georgia',
        color: TEXT_LIGHT,
        bold: true,
        valign: 'middle'
      });

      // Card Description
      const descY = titleY + 0.28;
      slide.addText(point.description, {
        x: cx + 0.16,
        y: descY,
        w: cardW - 0.32,
        h: cardH - (descY - cy) - 0.1,
        fontSize: 8.5,
        fontFace: 'Calibri',
        color: TEXT_MUTED,
        valign: 'top',
        lineSpacing: 11
      });
    });

    // 8. Bottom Highlights / Metrics Bar (4 mini metrics pills)
    if (slideData.metricsOrHighlights && slideData.metricsOrHighlights.length > 0) {
      const metricY = 4.56;
      const metricW = 2.06;
      const metricH = 0.52;
      const metricGap = 0.22;

      slideData.metricsOrHighlights.slice(0, 4).forEach((m, mIdx) => {
        const mx = 0.6 + mIdx * (metricW + metricGap);

        // Metric Pill
        slide.addShape(pres.ShapeType.roundRect, {
          x: mx,
          y: metricY,
          w: metricW,
          h: metricH,
          fill: { color: '171310' },
          line: { color: '2E2620', width: 0.6 },
          rectRadius: 0.06
        });

        // Metric Value
        slide.addText(m.value, {
          x: mx + 0.08,
          y: metricY + 0.05,
          w: metricW - 0.16,
          h: 0.24,
          fontSize: 11,
          fontFace: 'Georgia',
          color: ACCENT_AMBER,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        // Metric Label
        slide.addText(m.label, {
          x: mx + 0.08,
          y: metricY + 0.28,
          w: metricW - 0.16,
          h: 0.18,
          fontSize: 7,
          fontFace: 'Calibri',
          color: TEXT_MUTED,
          align: 'center',
          valign: 'middle'
        });
      });
    }

    // 9. Bottom Footer Bar
    slide.addText('OLFACTORY AI  •  INTELLIGENT FRAGRANCE ATELIER  •  GOOGLE AI STUDIO BUILD', {
      x: 0.6,
      y: 5.22,
      w: 6.5,
      h: 0.25,
      fontSize: 7.5,
      fontFace: 'Calibri',
      color: FOOTER_COLOR,
      valign: 'middle'
    });

    slide.addText('16:9 WIDESCREEN PRESENTATION', {
      x: SLIDE_WIDTH - 3.2,
      y: 5.22,
      w: 2.6,
      h: 0.25,
      fontSize: 7.5,
      fontFace: 'Calibri',
      color: FOOTER_COLOR,
      align: 'right',
      valign: 'middle'
    });

    // 10. Comprehensive Speaker Notes
    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes);
    }
  });

  return pres;
}

/**
 * Generates and triggers a direct browser download of the .pptx presentation file.
 */
export async function downloadPresentationClient(fileName = 'Olfactory_AI_Presentation.pptx'): Promise<void> {
  const pres = createOlfactoryAIPresentation();
  await pres.writeFile({ fileName });
}

/**
 * Server-side generation: returns a Buffer of the generated .pptx presentation.
 */
export async function generatePresentationBuffer(): Promise<Buffer> {
  const pres = createOlfactoryAIPresentation();
  const buffer = await pres.write({ outputType: 'nodebuffer' });
  return buffer as Buffer;
}
