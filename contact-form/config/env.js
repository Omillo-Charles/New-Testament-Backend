import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'RATE_LIMIT_WINDOW',
  'RATE_LIMIT_MAX',
  'ENV',
  'APP_NAME'
];

// Check if all required variables are present
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Export configuration object
const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 5500,
    env: process.env.ENV || 'development',
    appName: process.env.APP_NAME || 'NTCOGK Backend'
  },

  // Database Configuration
  database: {
    mongoUri: process.env.MONGO_URI
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    adminEmail: process.env.ADMIN_EMAIL || 'info@ntcogk.org'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000, // Convert minutes to milliseconds
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
};

export default config;
