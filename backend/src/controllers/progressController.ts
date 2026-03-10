import { Request, Response } from 'express'
import ProductUsageLog from '../models/ProductUsageLog'
import UserProfile from '../models/UserProfile'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

const STEP_ORDER: Record<string, number> = {
  'cleanser': 1,
  'toner': 2,
  'serum': 3,
  'moisturizer': 4,
  'sunscreen': 5,
  'treatment': 6
}

const getToday = (): Date => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const getDateFromString = (dateStr?: string): Date => {
  if (!dateStr) return getToday()
  const date = new Date(dateStr)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const getStepOrder = (product: any): number => {
  if (product.stepOrder && typeof product.stepOrder === 'number') {
    return product.stepOrder
  }
  if (product.category && STEP_ORDER[product.category]) {
    return STEP_ORDER[product.category]
  }
  return 99
}

export const getDailyLog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const date = getDateFromString(req.query.date as string)

    let log = await ProductUsageLog.findOne({ userId, date })

    if (!log) {
      return res.json({
        date,
        amRoutine: { completed: false, productsUsed: [] },
        pmRoutine: { completed: false, productsUsed: [] },
        customProducts: [],
        skinRating: null,
        skinFeeling: [],
        notes: ''
      })
    }

    res.json(log)
  } catch (error) {
    console.error('Get daily log error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getRoutineProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    const profile = await UserProfile.findOne({ userId })

    if (!profile || !profile.selectedProducts || profile.selectedProducts.length === 0) {
      return res.json({ amProducts: [], pmProducts: [] })
    }

    const amProducts: any[] = []
    const pmProducts: any[] = []

    for (const product of profile.selectedProducts) {
      const productData = {
        productId: product.productId,
        category: product.category,
        name: product.productId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        stepOrder: STEP_ORDER[product.category] || 99
      }

      if (product.dayTime === 'AM' || product.dayTime === 'Both') {
        amProducts.push({ ...productData, dayTime: 'AM' })
      }
      if (product.dayTime === 'PM' || product.dayTime === 'Both') {
        pmProducts.push({ ...productData, dayTime: 'PM' })
      }
    }

    amProducts.sort((a, b) => a.stepOrder - b.stepOrder)
    pmProducts.sort((a, b) => a.stepOrder - b.stepOrder)

    res.json({ amProducts, pmProducts })
  } catch (error) {
    console.error('Get routine products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const logRoutineComplete = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { dayTime, products } = req.body
    const date = getToday()

    if (!dayTime || !['AM', 'PM'].includes(dayTime)) {
      return res.status(400).json({ message: 'Invalid dayTime. Must be AM or PM' })
    }

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Products array required' })
    }

    let log = await ProductUsageLog.findOne({ userId, date })

    if (!log) {
      log = new ProductUsageLog({
        userId,
        date,
        amRoutine: { completed: false, productsUsed: [] },
        pmRoutine: { completed: false, productsUsed: [] },
        customProducts: []
      })
    }

    const routineKey = dayTime === 'AM' ? 'amRoutine' : 'pmRoutine'

    log[routineKey] = {
      completed: true,
      completedAt: new Date(),
      productsUsed: products.map(p => ({
        productId: p.productId,
        category: p.category || 'other',
        name: p.name,
        stepOrder: getStepOrder(p)
      }))
    }

    await log.save()
    res.json(log)
  } catch (error) {
    console.error('Log routine complete error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const logProductUsage = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { dayTime, product, isCustom } = req.body
    const date = getToday()

    if (!dayTime || !['AM', 'PM'].includes(dayTime)) {
      return res.status(400).json({ message: 'Invalid dayTime' })
    }

    if (!product || !product.productId || !product.name) {
      return res.status(400).json({ message: 'Product info required' })
    }

    let log = await ProductUsageLog.findOne({ userId, date })

    if (!log) {
      log = new ProductUsageLog({
        userId,
        date,
        amRoutine: { completed: false, productsUsed: [] },
        pmRoutine: { completed: false, productsUsed: [] },
        customProducts: []
      })
    }

    if (isCustom) {
      const existingCustom = log.customProducts.find(
        p => p.productId === product.productId && p.dayTime === dayTime
      )
      if (!existingCustom) {
        log.customProducts.push({
          productId: product.productId,
          name: product.name,
          dayTime,
          addedAt: new Date()
        })
      }
    } else {
      const routineKey = dayTime === 'AM' ? 'amRoutine' : 'pmRoutine'
      const existing = log[routineKey].productsUsed.find(p => p.productId === product.productId)

      if (!existing) {
        log[routineKey].productsUsed.push({
          productId: product.productId,
          category: product.category || 'other',
          name: product.name,
          stepOrder: getStepOrder(product)
        })
        log[routineKey].productsUsed.sort((a, b) => a.stepOrder - b.stepOrder)
      }
    }

    await log.save()
    res.json(log)
  } catch (error) {
    console.error('Log product usage error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const removeProductFromLog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { dayTime, productId, isCustom } = req.body
    const date = getToday()

    let log = await ProductUsageLog.findOne({ userId, date })

    if (!log) {
      return res.status(404).json({ message: 'No log found for today' })
    }

    if (isCustom) {
      log.customProducts = log.customProducts.filter(
        p => !(p.productId === productId && p.dayTime === dayTime)
      )
    } else {
      const routineKey = dayTime === 'AM' ? 'amRoutine' : 'pmRoutine'
      log[routineKey].productsUsed = log[routineKey].productsUsed.filter(
        p => p.productId !== productId
      )
      if (log[routineKey].productsUsed.length === 0) {
        log[routineKey].completed = false
        log[routineKey].completedAt = undefined
      }
    }

    await log.save()
    res.json(log)
  } catch (error) {
    console.error('Remove product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateDailyLog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { skinRating, skinFeeling, notes } = req.body
    const date = getToday()

    let log = await ProductUsageLog.findOne({ userId, date })

    if (!log) {
      log = new ProductUsageLog({
        userId,
        date,
        amRoutine: { completed: false, productsUsed: [] },
        pmRoutine: { completed: false, productsUsed: [] },
        customProducts: []
      })
    }

    if (skinRating !== undefined) {
      if (skinRating < 1 || skinRating > 10) {
        return res.status(400).json({ message: 'Skin rating must be between 1 and 10' })
      }
      log.skinRating = skinRating
    }

    if (skinFeeling !== undefined) {
      log.skinFeeling = skinFeeling
    }

    if (notes !== undefined) {
      log.notes = notes.substring(0, 500)
    }

    await log.save()
    res.json(log)
  } catch (error) {
    console.error('Update daily log error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUsageHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const days = parseInt(req.query.days as string) || 7

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const logs = await ProductUsageLog.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: -1 })

    let streak = 0
    const today = getToday()

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)

      const log = logs.find(l => {
        const logDate = new Date(l.date)
        return logDate.getFullYear() === checkDate.getFullYear() &&
               logDate.getMonth() === checkDate.getMonth() &&
               logDate.getDate() === checkDate.getDate()
      })

      if (log && (log.amRoutine.completed || log.pmRoutine.completed)) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    res.json({ logs, streak })
  } catch (error) {
    console.error('Get usage history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUsageWarnings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const logs = await ProductUsageLog.find({
      userId,
      date: { $gte: startDate }
    })

    const profile = await UserProfile.findOne({ userId })
    if (!profile) {
      return res.json({ warnings: [] })
    }

    const warnings: { type: string; message: string; ingredient: string }[] = []

    res.json({ warnings })
  } catch (error) {
    console.error('Get usage warnings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getRecentProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const logs = await ProductUsageLog.find({
      userId,
      date: { $gte: startDate },
      'customProducts.0': { $exists: true }
    })

    const recentMap = new Map<string, { productId: string; name: string; lastUsed: Date }>()

    for (const log of logs) {
      for (const custom of log.customProducts) {
        const existing = recentMap.get(custom.productId)
        if (!existing || custom.addedAt > existing.lastUsed) {
          recentMap.set(custom.productId, {
            productId: custom.productId,
            name: custom.name,
            lastUsed: custom.addedAt
          })
        }
      }
    }

    const recentProducts = Array.from(recentMap.values())
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())

    res.json({ recentProducts })
  } catch (error) {
    console.error('Get recent products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
