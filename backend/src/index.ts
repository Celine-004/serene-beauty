import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes'
import quizRoutes from './routes/quizRoutes'
import routineRoutes from './routes/routineRoutes'
import productRoutes from './routes/productRoutes'
import profileRoutes from './routes/profileRoutes'
import passport from './config/passport'

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI as string

// Security headers
app.use(helmet())

// CORS configuration - only allow our frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://serene-beauty-app.netlify.app'
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Rate limiting - general (100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' }
})

// Rate limiting - auth (stricter: 10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later' }
})

// Apply general rate limit to all routes
app.use(generalLimiter)

// Body parser with size limit (prevents large payload attacks)
app.use(express.json({ limit: '10kb' }))
app.use(passport.initialize())

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error))

// Routes - auth has stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/routines', routineRoutes)
app.use('/api/products', productRoutes)
app.use('/api/profile', profileRoutes)

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Serene Beauty API is running' })
})

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
