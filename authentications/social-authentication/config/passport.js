import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import config from './env.js';

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
if (config.google.clientID && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          
          // Admin emails list
          const adminEmails = [
            'info@ntcogk.org',
            'fidelomillo812@gmail.com',
            'officialomillocharles@gmail.com',
            'fidelomillo1@gmail.com'
          ];
          
          // Determine role based on email
          const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';
          
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Update last login and role if needed
            user.lastLogin = new Date();
            if (adminEmails.includes(user.email.toLowerCase()) && user.role !== 'admin') {
              user.role = 'admin';
            }
            await user.save();
            return done(null, user);
          }

          // Check if email already exists
          user = await User.findOne({ email });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.provider = 'google';
            user.isEmailVerified = true;
            user.lastLogin = new Date();
            if (adminEmails.includes(user.email.toLowerCase()) && user.role !== 'admin') {
              user.role = 'admin';
            }
            if (!user.profilePicture && profile.photos && profile.photos.length > 0) {
              user.profilePicture = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            email,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            provider: 'google',
            role,
            isEmailVerified: true,
            lastLogin: new Date(),
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export default passport;
