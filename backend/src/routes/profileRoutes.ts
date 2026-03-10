import { Router } from 'express'
import {
  getProfile,
  createOrUpdateProfile,
  selectProduct,
  removeProduct,
  getSelectedProducts,
  updateIngredientSettings,
  getIngredientSettings
} from '../controllers/profileController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getProfile)
router.post('/', authenticate, createOrUpdateProfile)
router.post('/select-product', authenticate, selectProduct)
router.post('/remove-product', authenticate, removeProduct)
router.get('/selected-products', authenticate, getSelectedProducts)
router.get('/ingredient-settings', authenticate, getIngredientSettings)
router.post('/ingredient-settings', authenticate, updateIngredientSettings)

export default router
