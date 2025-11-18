import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 5503,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    mongoUri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
};

// Validate required environment variables
const validateConfig = () => {
  const required = {
    'MONGO_URI': config.database.mongoUri,
    'JWT_SECRET': config.jwt.secret,
    'JWT_REFRESH_SECRET': config.jwt.refreshSecret,
    'SESSION_SECRET': config.session.secret,
  };

  const missing = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

try {
  validateConfig();
  console.log('✓ Environment configuration loaded successfully');
} catch (error) {
  console.error('✗ Environment configuration error:', error.message);
  process.exit(1);
}

export default config;
