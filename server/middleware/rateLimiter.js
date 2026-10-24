import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter: 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again in 15 minutes.'
  }
});

/**
 * AI Generation rate limiter: 30 generation/chat requests per 5 minutes per IP
 */
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      'AI generation rate limit reached. Please wait a couple minutes before generating another plan.'
  }
});
