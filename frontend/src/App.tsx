import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Quiz from './components/Quiz/Quiz'

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App