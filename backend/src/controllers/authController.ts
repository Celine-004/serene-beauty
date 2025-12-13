import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { registerSchema, loginSchema } from '../utils/validation'

const JWT_SECRET = process.env.JWT_SECRET as string

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
