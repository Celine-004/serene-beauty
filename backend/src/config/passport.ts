import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value
          
          if (!email) {
            return done(new Error('No email found in Google profile'), undefined)
          }

          // Check if user exists
          let user = await User.findOne({ email })

          if (user) {
            // User exists - update Google ID if not set
            if (!user.googleId) {
              user.googleId = profile.id
              await user.save()
            }
          } else {
            // Create new user
            user = await User.create({
              email,
              name: profile.displayName || email.split('@')[0],
              username: email.split('@')[0] + '_' + Date.now().toString().slice(-4),
              googleId: profile.id,
              emailVerified: true // Google already verified their email
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error as Error, undefined)
        }
      }
    )
  )
}

export default passport
