import rateLimit from 'express-rate-limit';

export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // per IP
  standardHeaders: true,
  legacyHeaders: false
});
