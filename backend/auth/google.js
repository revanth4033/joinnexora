const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        isEmailVerified: true,
        isPhoneVerified: false,
        password: null,
        role: 'student',
        avatar: null,
        bio: null,
        title: null,
        resetPasswordToken: null,
        resetPasswordExpire: null,
        emailVerificationToken: null,
        emailVerificationExpire: null,
        emailVerificationOtp: null,
        emailVerificationOtpExpires: null,
        resetPasswordOtp: null,
        resetPasswordOtpExpires: null,
        dateOfBirth: null,
        gender: null,
        country: null,
        state: null,
        city: null,
        address: null,
        educationLevel: null,
        institution: null,
        fieldOfStudy: null,
        occupation: null,
        linkedin: null,
        website: null
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
  }));
} else {
  console.log('⚠️ Google OAuth not configured - skipping Google login setup');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport; 