import config from '../config/env.js';

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '❌' : '✅';
    
    console.log(
      `${statusColor} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

// API activity logger
export const apiLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.body,
    query: req.query,
    params: req.params
  };

  // Only log in development or if explicitly enabled
  if (config.server.env === 'development') {
    console.log('API Request:', JSON.stringify(logData, null, 2));
  }

  next();
};

// Security logger - log suspicious activities
export const securityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /expression\(/i
  ];

  const checkForSuspicious = (obj) => {
    if (!obj) return false;
    
    const str = JSON.stringify(obj);
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  if (checkForSuspicious(req.body) || checkForSuspicious(req.query)) {
    console.warn('SECURITY ALERT: Suspicious input detected');
    console.warn({
      timestamp: new Date().toISOString(),
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('user-agent'),
      body: req.body,
      query: req.query
    });
  }

  next();
};

export default { requestLogger, apiLogger, securityLogger }