import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('skinType')
    localStorage.removeItem('concerns')
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-alabaster">
      <div className="w-full px-6 md:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-heading text-deep-twilight">
            Serene Beauty
          </a>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <a 
              href="/" 
              className="hover:text-deep-twilight transition"
            >
              Home
            </a>
            {isLoggedIn ? (
              <>
                <a 
                  href="/dashboard" 
                  className="hover:text-deep-twilight transition"
                >
                  Dashboard
                </a>
                <a 
                  href="/concerns" 
                  className="hover:text-deep-twilight transition"
                >
                  My Concerns
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-alabaster hover:bg-wisteria/30 transition font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a 
                  href="/login" 
                  className="hover:text-deep-twilight transition"
                >
                  Log In
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-deep-twilight hover:opacity-90 transition font-medium"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}