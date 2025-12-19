import { Router } from 'express'
import {
  getProfile,
  createOrUpdateProfile,
  selectProduct,
  removeProduct,
  getSelectedProducts
} from '../controllers/profileController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getProfile)
router.post('/', authenticate, createOrUpdateProfile)
router.post('/select-product', authenticate, selectProduct)
router.post('/remove-product', authenticate, removeProduct)
router.get('/selected-products', authenticate, getSelectedProducts)

export default router