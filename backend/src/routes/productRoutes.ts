import { Router } from 'express'
import {
  getAllProducts,
  getProductsByCategory,
  getProductsForSkinType,
  getProductsForRoutineStep,
  getProductsForRoutineStepByTime
} from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/skin-type/:skinType', getProductsForSkinType)
router.get('/recommend/:skinType/:category', getProductsForRoutineStep)
router.get('/recommend/:skinType/:category/:dayTime', getProductsForRoutineStepByTime)

export default router
