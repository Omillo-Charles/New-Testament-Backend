import { validationResult } from 'express-validator';

// Middleware to handle validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

// Sanitize input to prevent XSS attacks
export const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove any HTML tags
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '');
        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitize query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/<[^>]*>/g, '');
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};

// Check for required fields
export const requireFields = (...fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach(field => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    next();
  };
};

export default { validate, sanitizeInput, requireFields };
