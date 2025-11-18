import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5502,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // MongoDB Configuration
  database: {
    mongoUri: process.env.MONGO_URI,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // Frontend Configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Password Reset Configuration
  resetPassword: {
    expires: parseInt(process.env.RESET_PASSWORD_EXPIRES) || 3600000, // 1 hour in milliseconds
  },
};

// Validate required environment variables
const validateConfig = () => {
  const required = {
    'MONGO_URI': config.database.mongoUri,
    'JWT_SECRET': config.jwt.secret,
    'JWT_REFRESH_SECRET': config.jwt.refreshSecret,
    'EMAIL_HOST': config.email.host,
    'EMAIL_USER': config.email.user,
    'EMAIL_PASS': config.email.pass,
  };

  const missing = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Validate on load
try {
  validateConfig();
  console.log('✓ Environment configuration loaded successfully');
} catch (error) {
  console.error('✗ Environment configuration error:', error.message);
  process.exit(1);
}

export default config;
