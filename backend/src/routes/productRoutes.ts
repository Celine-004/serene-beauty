import { Router } from 'express'
import { 
  getAllProducts, 
  getProductsByCategory, 
  getProductsForSkinType,
  getProductsForRoutineStep 
} from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/skin-type/:skinType', getProductsForSkinType)
router.get('/recommend/:skinType/:category', getProductsForRoutineStep)

export default router
