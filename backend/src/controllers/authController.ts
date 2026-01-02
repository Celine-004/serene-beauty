import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import UserProfile from '../models/UserProfile'
import { registerSchema, loginSchema } from '../utils/validation'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = registerSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues })
    }

    const { name, username, email, password } = validation.data

    // Check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() })
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password: hashedPassword
    })

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues })
    }

    const { email, password } = validation.data

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check if user has a password (might be Google OAuth user)
    if (!user.password) {
      return res.status(401).json({ message: 'Please sign in with Google' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
}

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logout successful' })
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Server error fetching user' })
  }
}

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name, username } = req.body

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // If username is being changed, check it's not taken
    if (username && username.toLowerCase() !== user.username) {
      const existingUsername = await User.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: userId }
      })
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' })
      }
      user.username = username.toLowerCase()
    }

    if (name) {
      user.name = name
    }

    await user.save()

    res.json({ 
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        googleId: user.googleId,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: 'Server error updating user' })
  }
}

export const deleteMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    // Delete user profile (skincare data)
    await UserProfile.findOneAndDelete({ userId })

    // Delete user account
    await User.findByIdAndDelete(userId)

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Server error deleting account' })
  }
}


export const unlinkGoogle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Can only unlink if they have a password (otherwise they'd be locked out)
    if (!user.password) {
      return res.status(400).json({ message: 'Cannot unlink Google - you need to set a password first' })
    }

    user.googleId = undefined
    await user.save()

    res.json({ message: 'Google account unlinked' })
  } catch (error) {
    console.error('Error unlinking Google:', error)
    res.status(500).json({ message: 'Server error unlinking Google' })
  }
}
export const setPassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { password } = req.body

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' })
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' })
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.password) {
      return res.status(400).json({ message: 'Password already set. Use change password instead.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    await user.save()

    res.json({ message: 'Password set successfully' })
  } catch (error) {
    console.error('Error setting password:', error)
    res.status(500).json({ message: 'Server error setting password' })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: 'New password must contain at least one uppercase letter' })
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ message: 'New password must contain at least one lowercase letter' })
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: 'New password must contain at least one number' })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.password) {
      return res.status(400).json({ message: 'No password set. Use set password instead.' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({ message: 'Server error changing password' })
  }
}
