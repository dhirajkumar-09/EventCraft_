/**
 * Color Palette Generator for EventCraft AI
 */

const PALETTES_BY_TYPE = Object.freeze({
  wedding: Object.freeze([
    { name: 'Royal Gold', hex: '#D4AF37' },
    { name: 'Crimson Rose', hex: '#BE123C' },
    { name: 'Champagne Silk', hex: '#FDF6E2' },
    { name: 'Deep Emerald', hex: '#064E3B' },
    { name: 'Warm Terracotta', hex: '#C2410C' }
  ]),
  birthday: Object.freeze([
    { name: 'Celebration Coral', hex: '#F97316' },
    { name: 'Electric Berry', hex: '#EC4899' },
    { name: 'Golden Spark', hex: '#EAB308' },
    { name: 'Teal Dream', hex: '#14B8A6' },
    { name: 'Midnight Navy', hex: '#1E1B4B' }
  ]),
  anniversary: Object.freeze([
    { name: 'Silver Shimmer', hex: '#CBD5E1' },
    { name: 'Dusty Rose', hex: '#FDA4AF' },
    { name: 'French Burgundy', hex: '#881337' },
    { name: 'Pearl Cream', hex: '#FFFBEB' },
    { name: 'Antique Bronze', hex: '#78350F' }
  ]),
  corporate: Object.freeze([
    { name: 'Executive Navy', hex: '#0F172A' },
    { name: 'Platinum Slate', hex: '#94A3B8' },
    { name: 'Electric Cyan', hex: '#06B6D4' },
    { name: 'Clean White', hex: '#FFFFFF' },
    { name: 'Accent Gold', hex: '#F59E0B' }
  ]),
  default: Object.freeze([
    { name: 'Festive Marigold', hex: '#F59E0B' },
    { name: 'Royal Peacock', hex: '#0D9488' },
    { name: 'Gilded Amber', hex: '#D97706' },
    { name: 'Ivory Silk', hex: '#FEF3C7' },
    { name: 'Rich Crimson', hex: '#991B1B' }
  ])
});

/**
 * Returns a 5-color palette matching event type
 * @param {string} eventType - Type of celebration
 * @returns {Array<{ name: string, hex: string }>}
 */
export function getPaletteForEventType(eventType = '') {
  const typeLower = eventType.toLowerCase();
  for (const [key, palette] of Object.entries(PALETTES_BY_TYPE)) {
    if (key !== 'default' && typeLower.includes(key)) {
      return [...palette];
    }
  }
  return [...PALETTES_BY_TYPE.default];
}
