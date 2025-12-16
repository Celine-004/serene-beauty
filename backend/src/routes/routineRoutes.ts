import { Router } from 'express'
import { getAllRoutines, getRoutinesBySkinType } from '../controllers/routineController'

const router = Router()

router.get('/', getAllRoutines)
router.get('/:skinType', getRoutinesBySkinType)

export default router
