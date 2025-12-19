import { Request, Response } from 'express'
import UserProfile from '../models/UserProfile'

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const profile = await UserProfile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.json({ profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ message: 'Server error fetching profile' })
  }
}

export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { skinType, concerns, quizAnswers } = req.body

    let profile = await UserProfile.findOne({ userId })

    if (profile) {
      profile.skinType = skinType || profile.skinType
      profile.concerns = concerns || profile.concerns
      profile.quizAnswers = quizAnswers || profile.quizAnswers
      await profile.save()
    } else {
      profile = await UserProfile.create({
        userId,
        skinType,
        concerns: concerns || [],
        quizAnswers: quizAnswers || [],
        selectedProducts: []
      })
    }

    res.json({ message: 'Profile saved', profile })
  } catch (error) {
    console.error('Error saving profile:', error)
    res.status(500).json({ message: 'Server error saving profile' })
  }
}

export const selectProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { category, productId, dayTime } = req.body

    if (!category || !productId) {
      return res.status(400).json({ message: 'Category and productId are required' })
    }

    let profile = await UserProfile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Complete the quiz first.' })
    }

    // Remove existing selection for this category and dayTime
    profile.selectedProducts = profile.selectedProducts.filter(
      (p) => !(p.category === category && p.dayTime === (dayTime || 'Both'))
    )

    // Add new selection
    profile.selectedProducts.push({
      category,
      productId,
      dayTime: dayTime || 'Both'
    })

    await profile.save()

    res.json({ message: 'Product selected', selectedProducts: profile.selectedProducts })
  } catch (error) {
    console.error('Error selecting product:', error)
    res.status(500).json({ message: 'Server error selecting product' })
  }
}

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { category, dayTime } = req.body

    const profile = await UserProfile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    profile.selectedProducts = profile.selectedProducts.filter(
      (p) => !(p.category === category && p.dayTime === (dayTime || 'Both'))
    )

    await profile.save()

    res.json({ message: 'Product removed', selectedProducts: profile.selectedProducts })
  } catch (error) {
    console.error('Error removing product:', error)
    res.status(500).json({ message: 'Server error removing product' })
  }
}

export const getSelectedProducts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const profile = await UserProfile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.json({ selectedProducts: profile.selectedProducts })
  } catch (error) {
    console.error('Error fetching selected products:', error)
    res.status(500).json({ message: 'Server error fetching selected products' })
  }
}
