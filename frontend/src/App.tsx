import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import Quiz from './components/Quiz/Quiz'
import ConcernSelection from './components/ConcernSelection/ConcernSelection'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import OAuthCallback from './components/Auth/OAuthCallback'
import Profile from './components/Profile/Profile'

function StandaloneConcerns() {
  const handleComplete = (concerns: string[]) => {
    sessionStorage.setItem('concerns', JSON.stringify(concerns))
    window.location.href = '/dashboard'
  }

  const skinType = sessionStorage.getItem('skinType') || localStorage.getItem('skinType') || 'normal'

  return (
    <ConcernSelection
      skinType={skinType}
      onComplete={handleComplete}
      onBack={() => window.location.href = '/dashboard'}
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
	<Route path="/oauth-callback" element={<OAuthCallback />} />
	<Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
