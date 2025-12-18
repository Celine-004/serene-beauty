import { useState } from 'react'
import { api } from '../../api'

export default function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter')
      return
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter')
      return
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number')
      return
    }

    setLoading(true)

    try {
      const data = await api.register({ name, username, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Transfer quiz data to saved profile
      const skinType = sessionStorage.getItem('skinType')
      const concerns = sessionStorage.getItem('concerns')
      if (skinType) {
        localStorage.setItem('skinType', skinType)
      }
      if (concerns) {
        localStorage.setItem('concerns', concerns)
      }
      
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border border-alabaster">
        <h1 className="text-3xl font-heading text-deep-twilight mb-2 text-center">
          Create Account
        </h1>
        <p className="text-center mb-8 opacity-80">
          Save your routine and track your skincare journey
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              className="w-full px-4 py-3 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
              placeholder="janedoe"
              required
              minLength={3}
              maxLength={20}
            />
            <p className="text-xs mt-1 opacity-60">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
              placeholder="••••••••"
              required
            />
            <p className="text-xs mt-1 opacity-60">
              8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition mt-2 ${
              loading
                ? 'bg-deep-twilight/50 cursor-not-allowed'
                : 'bg-deep-twilight hover:opacity-90'
            }`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-deep-twilight font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

