import rateLimit from 'express-rate-limit';

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 хвилина
  max: 15, // максимум 10 запитів
  message: {
    message: 'Too many requests, try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});