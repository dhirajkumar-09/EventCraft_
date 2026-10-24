/**
 * PDF Export Configuration & Shared Color Tokens
 */

export const PDF_COLORS = Object.freeze({
  PRIMARY: [180, 83, 9], // Amber 700
  SECONDARY: [225, 29, 72], // Rose 600
  DARK: [30, 41, 59], // Slate 800
  TEXT: [51, 65, 85], // Slate 700
  MUTED: [100, 116, 139], // Slate 500
  LIGHT_BG: [254, 248, 238], // Warm cream
  BORDER: [241, 228, 211] // Cream border
});

export const PDF_DIMENSIONS = Object.freeze({
  MARGIN: 14,
  HEADER_HEIGHT: 6,
  ACCENT_HEIGHT: 2
});

/**
 * Converts a hex color string to an RGB array
 * @param {string} hex - Hex color e.g. '#D4AF37'
 * @returns {[number, number, number]} RGB array
 */
export function hexToRgb(hex) {
  let clean = (hex || '#000000').replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
