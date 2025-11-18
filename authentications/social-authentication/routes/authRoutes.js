import express from 'express';
import passport from 'passport';
import {
  googleCallback,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  googleCallback
);

// Token refresh
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/logout', verifyToken, logout);

export default router;
