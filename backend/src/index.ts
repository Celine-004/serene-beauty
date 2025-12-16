import express, { Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes'
import quizRoutes from './routes/quizRoutes'
import routineRoutes from './routes/routineRoutes'
import productRoutes from './routes/productRoutes'

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI as string

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/routines', routineRoutes)
app.use('/api/products', productRoutes)

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Serene Beauty API is running' })
})

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
