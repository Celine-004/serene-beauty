import { Router } from 'express'
import passport from '../config/passport'
import jwt from 'jsonwebtoken'
import { register, login, logout } from '../controllers/authController'

const router = Router()

// Existing routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`
  }),
  (req, res) => {
    try {
      const user = req.user as any
      
      // Create JWT token (same as regular login)
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      )

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173'
      res.redirect(`${frontendURL}/oauth-callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}`)
    } catch (error) {
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173'
      res.redirect(`${frontendURL}/login?error=oauth_failed`)
    }
  }
)

export default router
