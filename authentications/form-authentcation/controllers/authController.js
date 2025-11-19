import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

// Generate tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, church } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Admin emails list
    const adminEmails = [
      'info@ntcogk.org',
      'fidelomillo812@gmail.com',
      'officialomillocharles@gmail.com',
      'fidelomillo1@gmail.com'
    ];
    
    // Determine role based on email
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';

    // Extract name from email (part before @)
    const emailName = email.split('@')[0];
    // Capitalize first letter and replace dots/underscores with spaces
    const displayName = emailName
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create new user
    const user = new User({
      email,
      password,
      church,
      role,
      firstName: displayName, // Store extracted name as firstName
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationToken = otp;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send OTP email
    // await sendOTPEmail(user.email, otp);
    
    // For development, log the OTP
    console.log(`OTP for ${user.email}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the verification code.',
      data: {
        email: user.email,
        // For development only - remove in production
        ...(config.server.nodeEnv === 'development' && { otp }),
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token if remember me is checked
    if (rememberMe) {
      user.refreshToken = refreshToken;
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          fullName: user.fullName,
          email: user.email,
          church: user.church,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
        },
        accessToken,
        refreshToken: rememberMe ? refreshToken : undefined,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id, user.role);

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    // Clear refresh token
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        fullName: user.fullName,
        email: user.email,
        church: user.church,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { church } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (church !== undefined) user.church = church;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        fullName: user.fullName,
        email: user.email,
        church: user.church,
      },
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Send password reset email
    // const resetUrl = `${config.frontend.url}/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
      // For development only - remove in production
      ...(config.server.nodeEnv === 'development' && { resetToken }),
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message,
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationToken: otp,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate tokens after successful verification
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          fullName: user.fullName,
          email: user.email,
          church: user.church,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationToken = otp;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send OTP email
    // await sendOTPEmail(user.email, otp);
    
    // For development, log the OTP
    console.log(`New OTP for ${user.email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully',
      // For development only - remove in production
      ...(config.server.nodeEnv === 'development' && { otp }),
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code',
      error: error.message,
    });
  }
};

// Get admin statistics
export const getAdminStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    // Get user statistics from form auth
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'super-admin'] } });
    
    // Get users by church
    const usersByChurch = await User.aggregate([
      { $match: { church: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$church', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Try to get stats from social authentication
    let socialAuthStats = {
      totalUsers: 0,
      verifiedUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      recentRegistrations: 0,
      googleUsers: 0,
    };

    try {
      const { default: SocialUser } = await import('../../social-authentication/models/User.js');
      socialAuthStats.totalUsers = await SocialUser.countDocuments();
      socialAuthStats.verifiedUsers = await SocialUser.countDocuments({ isEmailVerified: true });
      socialAuthStats.activeUsers = await SocialUser.countDocuments({ isActive: true });
      socialAuthStats.adminUsers = await SocialUser.countDocuments({ role: { $in: ['admin', 'super-admin'] } });
      socialAuthStats.googleUsers = await SocialUser.countDocuments({ provider: 'google' });
      socialAuthStats.recentRegistrations = await SocialUser.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });
    } catch (error) {
      console.log('Social authentication database not available:', error.message);
    }

    // Combine stats
    const combinedStats = {
      totalUsers: totalUsers + socialAuthStats.totalUsers,
      verifiedUsers: verifiedUsers + socialAuthStats.verifiedUsers,
      activeUsers: activeUsers + socialAuthStats.activeUsers,
      adminUsers: adminUsers + socialAuthStats.adminUsers,
      recentRegistrations: recentRegistrations + socialAuthStats.recentRegistrations,
      formAuthUsers: totalUsers,
      socialAuthUsers: socialAuthStats.totalUsers,
      googleUsers: socialAuthStats.googleUsers,
      usersByChurch,
    };

    res.status(200).json({
      success: true,
      data: combinedStats,
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message,
    });
  }
};

export default {
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
};
