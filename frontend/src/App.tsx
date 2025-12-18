import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Quiz from './components/Quiz/Quiz'
import ConcernSelection from './components/ConcernSelection/ConcernSelection'
import { useState } from 'react'

function Home() {
  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-heading text-deep-twilight mb-4">Serene Beauty</h1>
        <p className="text-lg mb-8 leading-relaxed">
          Discover your personalized skincare routine based on your unique skin type.
        </p>
        <a
          href="/quiz"
          className="inline-block bg-deep-twilight px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
        >
          Take the Quiz
        </a>
      </div>
    </div>
  )
}

function StandaloneConcerns() {
  const [savedConcerns, setSavedConcerns] = useState<string[]>([])
  
  // For standalone access, we need skin type from somewhere
  // For now, default to 'normal' or get from localStorage later
  const handleComplete = (concerns: string[]) => {
    setSavedConcerns(concerns)
    // TODO: Save to user profile when auth is ready
    window.location.href = '/dashboard'
  }

  return (
    <ConcernSelection
      skinType="normal"
      onComplete={handleComplete}
      onBack={() => window.location.href = '/'}
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/concerns" element={<StandaloneConcerns />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
