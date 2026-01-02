import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import Navbar from '../Layout/Navbar'

interface User {
  _id: string
  name: string
  username: string
  email: string
  googleId?: string
  password: string
  emailVerified: boolean
  createdAt: string
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showSetPassword, setShowSetPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [changeNewPassword, setChangeNewPassword] = useState('')
  const [confirmChangePassword, setConfirmChangePassword] = useState('')
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)


  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const BACKEND_URL = API_URL.replace('/api', '')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetchUser()
  }, [navigate])

  const fetchUser = async () => {
    try {
      const data = await api.getMe()
      setUser(data.user)
      setName(data.user.name)
      setUsername(data.user.username)
    } catch (err: any) {
      setError(err.message)
      if (err.message.includes('unauthorized') || err.message.includes('401')) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')

    try {
      const data = await api.updateMe({ name, username })
      setUser(data.user)
      setEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleCancel = () => {
    if (user) {
      setName(user.name)
      setUsername(user.username)
    }
    setEditing(false)
    setError('')
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await api.deleteMe()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('skinType')
      localStorage.removeItem('concerns')
      navigate('/')
    } catch (err: any) {
      setError(err.message)
      setDeleteLoading(false)
    }
  }

  const handleUnlinkGoogle = async () => {
    setError('')
    setSuccess('')
    try {
      await api.unlinkGoogle()
      await fetchUser()
      setSuccess('Google account unlinked')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleLinkGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSetPassword = async () => {
  setError('')
  setSuccess('')

  if (newPassword.length < 8) {
    setError('Password must be at least 8 characters')
    return
  }
  if (!/[A-Z]/.test(newPassword)) {
    setError('Password must contain at least one uppercase letter')
    return
  }
  if (!/[a-z]/.test(newPassword)) {
    setError('Password must contain at least one lowercase letter')
    return
  }
  if (!/[0-9]/.test(newPassword)) {
    setError('Password must contain at least one number')
    return
  }
  if (newPassword !== confirmNewPassword) {
    setError('Passwords do not match')
    return
  }

  setPasswordLoading(true)
    try {
      await api.setPassword(newPassword)
      await fetchUser()
      setShowSetPassword(false)
      setNewPassword('')
      setConfirmNewPassword('')
      setSuccess('Password set successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleChangePassword = async () => {
  setError('')
  setSuccess('')

  if (!currentPassword) {
    setError('Please enter your current password')
    return
  }

  if (changeNewPassword.length < 8) {
    setError('New password must be at least 8 characters')
    return
  }
  if (!/[A-Z]/.test(changeNewPassword)) {
    setError('New password must contain at least one uppercase letter')
    return
  }
  if (!/[a-z]/.test(changeNewPassword)) {
    setError('New password must contain at least one lowercase letter')
    return
  }
  if (!/[0-9]/.test(changeNewPassword)) {
    setError('New password must contain at least one number')
    return
  }
  if (changeNewPassword !== confirmChangePassword) {
    setError('New passwords do not match')
    return
  }

  setChangePasswordLoading(true)
  try {
    await api.changePassword(currentPassword, changeNewPassword)
    setShowChangePassword(false)
    setCurrentPassword('')
    setChangeNewPassword('')
    setConfirmChangePassword('')
    setSuccess('Password changed successfully')
    setTimeout(() => setSuccess(''), 3000)
  } catch (err: any) {
    setError(err.message)
  } finally {
    setChangePasswordLoading(false)
  }
}


  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 border-4 border-deep-twilight border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-heading text-deep-twilight mb-8">My Account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg border border-alabaster p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading text-deep-twilight">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-deep-twilight hover:underline font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-70">Name</label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                />
              ) : (
                <p className="text-lg">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 opacity-70">Username</label>
              {editing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                />
              ) : (
                <p className="text-lg">@{user?.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 opacity-70">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 opacity-70">Member Since</label>
              <p className="text-lg">{user?.createdAt && formatDate(user.createdAt)}</p>
            </div>

            {editing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-deep-twilight rounded-lg font-medium hover:opacity-90 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-alabaster rounded-lg font-medium hover:bg-alabaster/50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-alabaster p-6 mb-6">
        <h2 className="text-xl font-heading text-deep-twilight mb-4">Connected Accounts</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Google</span>
          </div>
          
          {user?.googleId ? (
            <button
              onClick={handleUnlinkGoogle}
              className="text-red-600 hover:underline font-medium"
            >
              Unlink
            </button>
          ) : (
            <button
              onClick={handleLinkGoogle}
              className="text-deep-twilight hover:underline font-medium"
            >
              Link Account
            </button>
          )}
        </div>
        
        {user?.googleId && !user?.password && (
          <div className="mt-4 pt-4 border-t border-alabaster">
            {!showSetPassword ? (
              <div>
                <p className="text-sm opacity-70 mb-3">
                  Set a password to enable email login and allow unlinking your Google account.
                </p>
                <button
                  onClick={() => setShowSetPassword(true)}
                  className="text-deep-twilight hover:underline font-medium"
                >
                  Set Password
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs opacity-60">
                  8+ characters with uppercase, lowercase, and number
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSetPassword}
                    disabled={passwordLoading}
                    className="px-4 py-2 bg-deep-twilight rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {passwordLoading ? 'Setting...' : 'Set Password'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSetPassword(false)
                      setNewPassword('')
                      setConfirmNewPassword('')
                    }}
                    className="px-4 py-2 border border-alabaster rounded-lg font-medium hover:bg-alabaster/50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
        <div className="bg-white rounded-lg shadow-lg border border-red-200 p-6">
          <h2 className="text-xl font-heading text-red-600 mb-2">Danger Zone</h2>
          <p className="opacity-70 mb-4">
            Once you delete your account, there is no going back. This will permanently delete your account and all your saved routines.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="font-medium text-red-600">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 border border-alabaster rounded-lg font-medium hover:bg-alabaster/50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {user?.password && (
          <div className="bg-white rounded-lg shadow-lg border border-alabaster p-6 mb-6">
            <h2 className="text-xl font-heading text-deep-twilight mb-4">Security</h2>
            
            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-deep-twilight hover:underline font-medium"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={changeNewPassword}
                    onChange={(e) => setChangeNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmChangePassword}
                    onChange={(e) => setConfirmChangePassword(e.target.value)}
                    className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs opacity-60">
                  8+ characters with uppercase, lowercase, and number
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    disabled={changePasswordLoading}
                    className="px-4 py-2 bg-deep-twilight rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {changePasswordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false)
                      setCurrentPassword('')
                      setChangeNewPassword('')
                      setConfirmChangePassword('')
                    }}
                    className="px-4 py-2 border border-alabaster rounded-lg font-medium hover:bg-alabaster/50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
</div>

  )
}
