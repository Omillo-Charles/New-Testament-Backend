import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  profilePicture: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  church: {
    type: String,
    trim: true,
  },
  newsletter: {
    type: Boolean,
    default: false,
  },
  
  // Social Authentication
  googleId: {
    type: String,
  },
  
  // Authentication Provider
  provider: {
    type: String,
    enum: ['google', 'local'],
    required: true,
  },
  
  // Role & Status
  role: {
    type: String,
    enum: ['user', 'pastor', 'regional-bishop', 'admin', 'super-admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  
  // Tokens
  refreshToken: String,
  
  // Activity Tracking
  lastLogin: Date,
}, {
  timestamps: true,
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.email;
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ provider: 1 });

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
