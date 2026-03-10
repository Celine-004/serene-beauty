import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

// Common ingredients to highlight (easier for users to find)
const COMMON_ALLERGENS = [
  'FRAGRANCE',
  'PARFUM',
  'ALCOHOL',
  'ALCOHOL DENAT',
  'SODIUM LAURYL SULFATE',
  'SODIUM LAURETH SULFATE',
  'PARABENS',
  'METHYLPARABEN',
  'PROPYLPARABEN',
  'BUTYLPARABEN',
  'FORMALDEHYDE',
  'PHENOXYETHANOL',
  'RETINOL',
  'RETINYL PALMITATE',
  'SALICYLIC ACID',
  'BENZOYL PEROXIDE',
  'HYDROQUINONE',
  'LINALOOL',
  'LIMONENE',
  'CITRONELLOL',
  'GERANIOL',
  'EUGENOL',
  'COUMARIN'
]

export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const dataPath = path.join(__dirname, '../data/products')
    const files = ['cleansers.json', 'toners.json', 'serums.json', 'moisturizers.json', 'sunscreens.json', 'treatments.json']
    
    const ingredientSet = new Set<string>()
    
    for (const file of files) {
      const filePath = path.join(dataPath, file)
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const products = data.products || data
        
        for (const product of products) {
          if (product.allIngredients) {
            // Parse the INCI string
            const ingredients = product.allIngredients
              .split(/[,.]/)
              .map((i: string) => i.trim().toUpperCase())
              .filter((i: string) => i.length > 0 && i.length < 100)
            
            ingredients.forEach((ing: string) => ingredientSet.add(ing))
          }
        }
      }
    }
    
    const allIngredients = Array.from(ingredientSet).sort()
    
    // Separate common allergens from the rest
    const commonAllergens = COMMON_ALLERGENS.filter(a => ingredientSet.has(a))
    const otherIngredients = allIngredients.filter(i => !COMMON_ALLERGENS.includes(i))
    
    res.json({
      commonAllergens,
      allIngredients: otherIngredients,
      total: allIngredients.length
    })
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    res.status(500).json({ message: 'Failed to fetch ingredients' })
  }
}

