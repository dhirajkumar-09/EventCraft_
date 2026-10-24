/**
 * Application Constants for EventCraft AI Client
 * Centralizes magic numbers, options, and storage keys
 */

export const STORAGE_KEYS = Object.freeze({
  THEME: 'eventcraft_theme',
  PLAN: 'eventcraft_current_plan',
  META: 'eventcraft_plan_meta',
  CHECKED: 'eventcraft_checked_items',
  CHAT: 'eventcraft_chat_history',
  API_KEY: 'eventcraft_custom_api_key'
});

export const EVENT_TYPES = Object.freeze([
  'Wedding',
  'Birthday',
  'Anniversary',
  'Baby Shower',
  'Community/Festival event',
  'Corporate'
]);

export const VENUE_TYPES = Object.freeze([
  { value: 'banquet', label: 'Banquet Hall / Hotel Ballroom' },
  { value: 'outdoor', label: 'Outdoor Lawn / Beach / Farmhouse' },
  { value: 'indoor', label: 'Indoor Lounge / Restaurant' },
  { value: 'home', label: 'Private Home / Terrace' }
]);

export const CUISINE_DIETS = Object.freeze([
  { value: 'veg', label: 'Pure Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian & Halal' },
  { value: 'jain', label: 'Jain (No Root Veg / Onion / Garlic)' },
  { value: 'mixed', label: 'Mixed (Veg & Non-Veg Multi-Cuisine)' }
]);

export const CURRENCIES = Object.freeze([
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AED', symbol: 'AED', label: 'AED (AED)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' }
]);

export const LOADING_QUOTES = Object.freeze([
  'Curating authentic local catering options...',
  'Balancing venue aesthetics with your budget...',
  'Composing your hour-by-hour celebration run sheet...',
  'Crafting unforgettable wow moments and surprises...',
  'Securing backup plans and emergency buffers...',
  'Polishing your custom celebration itinerary...'
]);

export const CONFETTI_COLORS = Object.freeze([
  '#D4AF37', // Gold
  '#BE123C', // Rose
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EC4899'  // Pink
]);

export const DONUT_PALETTE = Object.freeze([
  '#b45309', // amber-700
  '#e11d48', // rose-600
  '#0d9488', // teal-600
  '#7c3aed', // violet-600
  '#d97706', // amber-600
  '#2563eb', // blue-600
  '#059669', // emerald-600
  '#c026d3', // fuchsia-600
  '#475569'  // slate-600 (contingency reserve)
]);

export const QUOTE_ROTATION_INTERVAL_MS = 2500;
export const DEFAULT_BUDGET = 500000;
export const DEFAULT_GUEST_COUNT = 100;
