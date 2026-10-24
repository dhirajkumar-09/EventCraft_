/**
 * Input Sanitization and Prompt Injection Guard Middleware
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+override/i,
  /disregard\s+(all\s+|previous\s+|prior\s+)?(guidelines|rules|prompts|instructions)/i,
  /you\s+are\s+now\s+dan/i,
  /act\s+as\s+an\s+unfiltered/i,
  /jailbreak/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /drop\s+table/i,
];

/**
 * Sanitizes a string: removes malicious patterns, null bytes, trims, and truncates
 * @param {string} val
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeString(val, maxLength = 1000) {
  if (typeof val !== 'string') return '';
  // Remove null bytes and non-printable characters except standard newlines/tabs
  // eslint-disable-next-line no-control-regex
  let cleaned = val.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Trim and limit length
  cleaned = cleaned.trim().slice(0, maxLength);
  return cleaned;
}

/**
 * Checks if a string contains known prompt injection attempts
 * @param {string} text
 * @returns {boolean}
 */
export function containsPromptInjection(text) {
  if (!text || typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some(regex => regex.test(text));
}

/**
 * Express middleware to sanitize incoming body fields for event planning
 */
export function sanitizeEventInput(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const {
    eventType,
    eventDate,
    city,
    venueType,
    guestCount,
    totalBudget,
    currency,
    currencySymbol,
    cuisineDiet,
    themePreference,
    traditions,
    ageGroup,
    specialRequests,
    message, // for chat
    section  // for regenerate-section
  } = req.body;

  // Check injection in text fields
  const textFields = [
    eventType,
    city,
    venueType,
    themePreference,
    traditions,
    ageGroup,
    specialRequests,
    message
  ];

  for (const text of textFields) {
    if (text && containsPromptInjection(text)) {
      return res.status(400).json({
        error: 'Security alert: Input contains disallowed patterns or prompt injection markers.'
      });
    }
  }

  // Sanitize and normalize fields
  req.sanitizedBody = {
    eventType: sanitizeString(eventType, 100),
    eventDate: sanitizeString(eventDate, 30),
    city: sanitizeString(city, 100),
    venueType: sanitizeString(venueType, 50),
    guestCount: Math.min(Math.max(1, parseInt(guestCount, 10) || 1), 100000),
    totalBudget: Math.min(Math.max(100, parseFloat(totalBudget) || 0), 1000000000),
    currency: sanitizeString(currency || 'INR', 10).toUpperCase(),
    currencySymbol: sanitizeString(currencySymbol || '₹', 5),
    cuisineDiet: sanitizeString(cuisineDiet, 50),
    themePreference: sanitizeString(themePreference, 200),
    traditions: sanitizeString(traditions, 300),
    ageGroup: sanitizeString(ageGroup, 100),
    specialRequests: sanitizeString(specialRequests, 500),
    message: sanitizeString(message, 1000),
    section: sanitizeString(section, 50),
    apiKey: req.body.apiKey ? sanitizeString(req.body.apiKey, 200) : undefined,
    currentPlan: req.body.currentPlan || null
  };

  next();
}
