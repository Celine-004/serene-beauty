import { Router } from 'express'
import passport from '../config/passport'
import jwt from 'jsonwebtoken'
import { register, login, logout, getMe, updateMe, deleteMe, unlinkGoogle, setPassword, changePassword } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// Protected routes (require authentication)
router.get('/me', authenticate, getMe)
router.put('/me', authenticate, updateMe)
router.delete('/me', authenticate, deleteMe)
router.post('/unlink-google', authenticate, unlinkGoogle)
router.post('/set-password', authenticate, setPassword)
router.post('/change-password', authenticate, changePassword)



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

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      )

      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173'
      res.redirect(`${frontendURL}/oauth-callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}`)
    } catch (error) {
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173'
      res.redirect(`${frontendURL}/login?error=oauth_failed`)
    }
  }
)

export default router
