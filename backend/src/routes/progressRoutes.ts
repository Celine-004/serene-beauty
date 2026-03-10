import { Router } from 'express'
import {
  getDailyLog,
  getRoutineProducts,
  logRoutineComplete,
  logProductUsage,
  removeProductFromLog,
  updateDailyLog,
  getUsageHistory,
  getUsageWarnings,
  getRecentProducts
} from '../controllers/progressController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/daily', authenticate, getDailyLog)
router.get('/routine-products', authenticate, getRoutineProducts)
router.post('/routine-complete', authenticate, logRoutineComplete)
router.post('/log-product', authenticate, logProductUsage)
router.post('/remove-product', authenticate, removeProductFromLog)
router.put('/daily', authenticate, updateDailyLog)
router.get('/history', authenticate, getUsageHistory)
router.get('/warnings', authenticate, getUsageWarnings)
router.get('/recent-products', authenticate, getRecentProducts)

export default router
