import { useState, useEffect } from 'react'
import { api } from '../../api'
import ConcernSelection from '../ConcernSelection/ConcernSelection'

interface Option {
  text: string
  skinType: string
}

interface Question {
  id: number
  question: string
  options: Option[]
}

interface QuizResult {
  skinType: string
  result: {
    title: string
    message: string
  }
}

type FlowStep = 'quiz' | 'results' | 'concerns'

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: number; skinType: string }[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [flowStep, setFlowStep] = useState<FlowStep>('quiz')
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await api.getQuiz()
        setQuestions(data.questions)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching quiz:', error)
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [])

  const handleAnswer = (skinType: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = { questionId: questions[currentQuestion].id, skinType }
    setAnswers(newAnswers)
  }

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitQuiz()
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = async () => {
    try {
      setLoading(true)
      const data = await api.submitQuiz(answers)
      setResult(data)
      setFlowStep('results')
      setLoading(false)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setLoading(false)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
    setFlowStep('quiz')
    setSelectedConcerns([])
  }

  const handleConcernsComplete = (concerns: string[]) => {
    setSelectedConcerns(concerns)
    // Store in sessionStorage for dashboard to access
    sessionStorage.setItem('skinType', result?.skinType || '')
    sessionStorage.setItem('concerns', JSON.stringify(concerns))
    window.location.href = '/dashboard'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-porcelain">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  // Show concern selection after results
  if (flowStep === 'concerns' && result) {
    return (
      <ConcernSelection
        skinType={result.skinType}
        onComplete={handleConcernsComplete}
        onBack={() => setFlowStep('results')}
      />
    )
  }

  // Show results
  if (flowStep === 'results' && result) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-alabaster">
          <h2 className="text-3xl font-heading text-deep-twilight mb-4">Your Skin Type</h2>
          <div className="bg-lavender-veil rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-heading text-deep-twilight">{result.result.title}</h3>
            <p className="mt-3 leading-relaxed">{result.result.message}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setFlowStep('concerns')}
              className="w-full bg-deep-twilight py-3 rounded-lg hover:opacity-90 transition font-medium"
            >
              Continue
            </button>
            <button
              onClick={restartQuiz}
              className="w-full bg-alabaster py-3 rounded-lg hover:bg-wisteria/30 transition font-medium"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show quiz questions
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = answers[currentQuestion]?.skinType

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full border border-alabaster">
        <div className="mb-8">
          <div className="flex justify-between text-sm opacity-70 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-alabaster rounded-full h-2">
            <div 
              className="bg-deep-twilight h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-heading text-deep-twilight mb-6 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.skinType)}
              className={`w-full text-left p-4 border rounded-lg transition ${
                currentAnswer === option.skinType
                  ? 'border-deep-twilight bg-lavender-veil'
                  : 'border-alabaster hover:border-wisteria hover:bg-lavender-veil/30'
              }`}
            >
              <span>{option.text}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={goBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg transition font-medium ${
              currentQuestion === 0
                ? 'bg-alabaster/50 opacity-30 cursor-not-allowed'
                : 'bg-alabaster hover:bg-wisteria/30'
            }`}
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!currentAnswer}
            className={`px-6 py-2 rounded-lg transition font-medium ${
              !currentAnswer
                ? 'bg-deep-twilight/50 opacity-50 cursor-not-allowed'
                : 'bg-deep-twilight hover:opacity-90'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
