import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    const error = searchParams.get('error')

    if (error) {
      navigate('/login?error=oauth_failed')
      return
    }

    if (token && userId) {
      // Store auth data (same as regular login)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ id: userId, name }))

      // Transfer quiz data from sessionStorage to localStorage
      const skinType = sessionStorage.getItem('skinType')
      const concerns = sessionStorage.getItem('concerns')
      if (skinType) localStorage.setItem('skinType', skinType)
      if (concerns) localStorage.setItem('concerns', concerns)

      // Redirect to dashboard
      navigate('/dashboard')
    } else {
      navigate('/login?error=missing_token')
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-deep-twilight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}

