import { Router } from 'express'
import { getQuiz, submitQuiz } from '../controllers/quizController'

const router = Router()

router.get('/', getQuiz)
router.post('/submit', submitQuiz)

export default router
