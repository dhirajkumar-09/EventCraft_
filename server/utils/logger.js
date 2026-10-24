/**
 * Structured Logger for EventCraft AI Server
 * Encapsulates console logging with environment filtering and timestamping.
 */

const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = Object.freeze({
  /**
   * Log an informational message
   * @param {string} message
   * @param {...*} args
   */
  info: (message, ...args) => {
    if (!isTest) {
      // eslint-disable-next-line no-console
      console.info(`[EventCraft INFO] ${message}`, ...args);
    }
  },

  /**
   * Log a warning message
   * @param {string} message
   * @param {...*} args
   */
  warn: (message, ...args) => {
    if (!isTest) {
      // eslint-disable-next-line no-console
      console.warn(`[EventCraft WARN] ${message}`, ...args);
    }
  },

  /**
   * Log an error message
   * @param {string} message
   * @param {...*} args
   */
  error: (message, ...args) => {
    if (!isTest) {
      // eslint-disable-next-line no-console
      console.error(`[EventCraft ERROR] ${message}`, ...args);
    }
  },

  /**
   * Log a debug message in development only
   * @param {string} message
   * @param {...*} args
   */
  debug: (message, ...args) => {
    if (!isProduction && !isTest) {
      // eslint-disable-next-line no-console
      console.debug(`[EventCraft DEBUG] ${message}`, ...args);
    }
  }
});
