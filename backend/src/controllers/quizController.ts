import { Request, Response } from 'express'
import quizData from '../data/skin-assessment-questions.json'

export const getQuiz = async (req: Request, res: Response) => {
  try {
    res.json({
      title: quizData.quiz.title,
      description: quizData.quiz.description,
      questions: quizData.quiz.questions,
      totalQuestions: quizData.quiz.questions.length
    })
  } catch (error) {
    console.error('Error fetching quiz:', error)
    res.status(500).json({ message: 'Server error fetching quiz' })
  }
}

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { answers } = req.body

    if (!answers || !Array.isArray(answers) || answers.length !== 7) {
      return res.status(400).json({ message: 'Please answer all 7 questions' })
    }

    // Count skin type occurrences
    const skinTypeCounts: Record<string, number> = {
      oily: 0,
      dry: 0,
      combination: 0,
      sensitive: 0,
      normal: 0
    }

    answers.forEach((answer: { questionId: number; skinType: string }) => {
      if (skinTypeCounts.hasOwnProperty(answer.skinType)) {
        skinTypeCounts[answer.skinType]++
      }
    })

    // Find the dominant skin type
    const skinType = Object.entries(skinTypeCounts).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0]

    const result = quizData.quiz.results[skinType as keyof typeof quizData.quiz.results]

    res.json({
      skinType,
      result,
      message: 'Quiz completed successfully'
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    res.status(500).json({ message: 'Server error processing quiz' })
  }
}
