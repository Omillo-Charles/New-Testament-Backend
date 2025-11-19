// Simple in-memory rate limiter
const requestCounts = new Map();

// Rate limiter middleware
export const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests, please try again later.',
  } = options;

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    let record = requestCounts.get(identifier);
    
    if (!record) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      requestCounts.set(identifier, record);
      return next();
    }
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      requestCounts.set(identifier, record);
      return next();
    }
    
    record.count++;
    
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }
    
    next();
  };
};

// Stricter rate limiter for authentication endpoints
export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // max 10 login/register attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.',
});

// Rate limiter for password reset
export const passwordResetRateLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // max 3 password reset requests per hour
  message: 'Too many password reset requests. Please try again later.',
});

// Clean up old records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

export default {
  rateLimiter,
  authRateLimiter,
  passwordResetRateLimiter,
};
