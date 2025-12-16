import { Request, Response } from 'express'
import cleansersData from '../data/products/cleansers.json'
import tonersData from '../data/products/toners.json'
import serumsData from '../data/products/serums.json'
import moisturizersData from '../data/products/moisturizers.json'
import sunscreensData from '../data/products/sunscreens.json'
import treatmentsData from '../data/products/treatments.json'

// Combine all products into one array
const allProducts = [
  ...cleansersData.products,
  ...tonersData.products,
  ...serumsData.products,
  ...moisturizersData.products,
  ...sunscreensData.products,
  ...treatmentsData.products
]

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    res.json({
      products: allProducts,
      totalProducts: allProducts.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error fetching products' })
  }
}

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params

    const validCategories = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment']
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    const products = allProducts.filter(
      (product) => product.category === category
    )

    res.json({
      category,
      products,
      totalProducts: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error fetching products' })
  }
}

export const getProductsForSkinType = async (req: Request, res: Response) => {
  try {
    const { skinType } = req.params

    const validSkinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal']
    if (!validSkinTypes.includes(skinType)) {
      return res.status(400).json({ message: 'Invalid skin type' })
    }

    const products = allProducts.filter(
      (product) => product.suitableFor.includes(skinType)
    )

    res.json({
      skinType,
      products,
      totalProducts: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error fetching products' })
  }
}

export const getProductsForRoutineStep = async (req: Request, res: Response) => {
  try {
    const { skinType, category } = req.params

    const validSkinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal']
    const validCategories = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment']

    if (!validSkinTypes.includes(skinType)) {
      return res.status(400).json({ message: 'Invalid skin type' })
    }
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    const products = allProducts.filter(
      (product) => product.category === category && product.suitableFor.includes(skinType)
    )

    res.json({
      skinType,
      category,
      products,
      totalProducts: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error fetching products' })
  }
}
