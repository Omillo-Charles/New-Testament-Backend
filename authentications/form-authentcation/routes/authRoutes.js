import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendOTP,
  getAdminStats,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  sanitizeInput,
} from '../middlewares/validator.js';
import {
  authRateLimiter,
  passwordResetRateLimiter,
} from '../middlewares/rateLimiter.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  authRateLimiter,
  sanitizeInput,
  validateRegister,
  register
);

router.post(
  '/login',
  authRateLimiter,
  sanitizeInput,
  validateLogin,
  login
);

router.post('/refresh-token', refreshToken);

router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  sanitizeInput,
  validatePasswordResetRequest,
  requestPasswordReset
);

router.post(
  '/reset-password',
  sanitizeInput,
  validatePasswordReset,
  resetPassword
);

router.post('/verify-email', sanitizeInput, verifyEmail);

router.post('/resend-otp', sanitizeInput, resendOTP);

// Protected routes (require authentication)
router.post('/logout', verifyToken, logout);

router.get('/profile', verifyToken, getProfile);

router.put('/profile', verifyToken, sanitizeInput, updateProfile);

router.post('/change-password', verifyToken, sanitizeInput, changePassword);

// Admin routes
router.get('/admin/stats', verifyToken, getAdminStats);

export default router;
