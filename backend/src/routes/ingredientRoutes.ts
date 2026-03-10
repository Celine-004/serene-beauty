import { Router } from 'express'
import { getAllIngredients } from '../controllers/ingredientController'

const router = Router()

router.get('/', getAllIngredients)

export default router
