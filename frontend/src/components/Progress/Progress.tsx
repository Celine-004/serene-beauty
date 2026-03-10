import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import Navbar from '../Layout/Navbar'

interface Product {
  productId: string
  category: string
  name: string
  stepOrder: number
  dayTime?: string
}

interface DailyLog {
  date: string
  amRoutine: {
    completed: boolean
    completedAt?: string
    productsUsed: Product[]
  }
  pmRoutine: {
    completed: boolean
    completedAt?: string
    productsUsed: Product[]
  }
  customProducts: {
    productId: string
    name: string
    dayTime: 'AM' | 'PM'
    addedAt: string
  }[]
  skinRating?: number
  skinFeeling?: string[]
  notes?: string
}

const SKIN_FEELINGS = [
  { id: 'oily', label: 'Oily', emoji: '💧' },
  { id: 'dry', label: 'Dry', emoji: '🏜️' },
  { id: 'tight', label: 'Tight', emoji: '😬' },
  { id: 'smooth', label: 'Smooth', emoji: '✨' },
  { id: 'rough', label: 'Rough', emoji: '🪨' },
  { id: 'irritated', label: 'Irritated', emoji: '😣' },
  { id: 'balanced', label: 'Balanced', emoji: '⚖️' },
  { id: 'glowy', label: 'Glowy', emoji: '🌟' },
  { id: 'dull', label: 'Dull', emoji: '😶' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🌸' }
]

const CATEGORY_LABELS: Record<string, string> = {
  cleanser: 'Cleanser',
  toner: 'Toner',
  serum: 'Serum',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
  treatment: 'Treatment'
}

export default function Progress() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null)
  const [amProducts, setAmProducts] = useState<Product[]>([])
  const [pmProducts, setPmProducts] = useState<Product[]>([])
  const [recentProducts, setRecentProducts] = useState<{ productId: string; name: string }[]>([])
  const [streak, setStreak] = useState(0)
  const [history, setHistory] = useState<DailyLog[]>([])
  
  // UI state
  const [selectedAmProducts, setSelectedAmProducts] = useState<Set<string>>(new Set())
  const [selectedPmProducts, setSelectedPmProducts] = useState<Set<string>>(new Set())
  const [skinRating, setSkinRating] = useState<number | null>(null)
  const [skinFeeling, setSkinFeeling] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [showCustomInput, setShowCustomInput] = useState<'AM' | 'PM' | null>(null)
  const [customProductName, setCustomProductName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [logData, routineData, historyData, recentData] = await Promise.all([
        api.getDailyLog(),
        api.getRoutineProducts(),
        api.getUsageHistory(7),
        api.getRecentProducts()
      ])

      setDailyLog(logData)
      setAmProducts(routineData.amProducts || [])
      setPmProducts(routineData.pmProducts || [])
      setHistory(historyData.logs || [])
      setStreak(historyData.streak || 0)
      setRecentProducts(recentData.recentProducts || [])

      // Set initial selections from log
      if (logData.amRoutine?.productsUsed) {
        setSelectedAmProducts(new Set(logData.amRoutine.productsUsed.map((p: Product) => p.productId)))
      }
      if (logData.pmRoutine?.productsUsed) {
        setSelectedPmProducts(new Set(logData.pmRoutine.productsUsed.map((p: Product) => p.productId)))
      }
      if (logData.skinRating) setSkinRating(logData.skinRating)
      if (logData.skinFeeling) setSkinFeeling(logData.skinFeeling)
      if (logData.notes) setNotes(logData.notes)

    } catch (err: any) {
      console.error('Load error:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRoutineComplete = async (dayTime: 'AM' | 'PM') => {
    try {
      setSaving(true)
      const products = dayTime === 'AM' ? amProducts : pmProducts
      await api.logRoutineComplete({ dayTime, products })
      
      if (dayTime === 'AM') {
        setSelectedAmProducts(new Set(products.map(p => p.productId)))
      } else {
        setSelectedPmProducts(new Set(products.map(p => p.productId)))
      }
      
      await loadData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleProduct = async (dayTime: 'AM' | 'PM', product: Product) => {
    try {
      setSaving(true)
      const selected = dayTime === 'AM' ? selectedAmProducts : selectedPmProducts
      const isSelected = selected.has(product.productId)

      if (isSelected) {
        await api.removeProductFromLog({ dayTime, productId: product.productId })
        selected.delete(product.productId)
      } else {
        await api.logProductUsage({ dayTime, product })
        selected.add(product.productId)
      }

      if (dayTime === 'AM') {
        setSelectedAmProducts(new Set(selected))
      } else {
        setSelectedPmProducts(new Set(selected))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddCustomProduct = async (dayTime: 'AM' | 'PM') => {
    if (!customProductName.trim()) return

    try {
      setSaving(true)
      const product = {
        productId: `custom_${Date.now()}`,
        name: customProductName.trim(),
        category: 'other'
      }
      await api.logProductUsage({ dayTime, product, isCustom: true })
      setCustomProductName('')
      setShowCustomInput(null)
      await loadData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddRecentProduct = async (dayTime: 'AM' | 'PM', product: { productId: string; name: string }) => {
    try {
      setSaving(true)
      await api.logProductUsage({ 
        dayTime, 
        product: { ...product, category: 'other' }, 
        isCustom: true 
      })
      await loadData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSkinRating = async (rating: number) => {
    try {
      setSkinRating(rating)
      await api.updateDailyLog({ skinRating: rating })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleToggleSkinFeeling = async (feelingId: string) => {
    try {
      const newFeelings = skinFeeling.includes(feelingId)
        ? skinFeeling.filter(f => f !== feelingId)
        : [...skinFeeling, feelingId]
      
      setSkinFeeling(newFeelings)
      await api.updateDailyLog({ skinFeeling: newFeelings })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSaveNotes = async () => {
    try {
      await api.updateDailyLog({ notes })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const renderRoutineSection = (dayTime: 'AM' | 'PM', products: Product[], selected: Set<string>, isCompleted: boolean) => {
    const groupedByCategory: Record<string, Product[]> = {}
    products.forEach(p => {
      if (!groupedByCategory[p.category]) groupedByCategory[p.category] = []
      groupedByCategory[p.category].push(p)
    })

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deep-twilight flex items-center gap-2">
            {dayTime === 'AM' ? '☀️ Morning Routine' : '🌙 Evening Routine'}
            {isCompleted && <span className="text-green-500 text-sm">✓ Done</span>}
          </h3>
          <button
            onClick={() => handleMarkRoutineComplete(dayTime)}
            disabled={saving || products.length === 0}
            className="px-4 py-2 bg-deep-twilight text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Mark All Done'}
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-drift-gray text-sm">No products in your {dayTime} routine yet. <a href="/dashboard" className="text-deep-twilight underline">Add products</a></p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedByCategory).map(([category, categoryProducts]) => (
              <div key={category}>
                <p className="text-xs font-medium text-drift-gray uppercase mb-2">
                  {CATEGORY_LABELS[category] || category}
                </p>
                <div className="space-y-2">
                  {categoryProducts.map(product => (
                    <button
                      key={product.productId}
                      onClick={() => handleToggleProduct(dayTime, product)}
                      disabled={saving}
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        selected.has(product.productId)
                          ? 'bg-green-50 border-green-300 text-green-800'
                          : 'bg-porcelain border-transparent hover:border-wisteria/30'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {selected.has(product.productId) ? '✓' : '○'} {product.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Product Section */}
        <div className="mt-4 pt-4 border-t border-alabaster">
          {showCustomInput === dayTime ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="Product name..."
                className="flex-1 px-3 py-2 rounded-lg border border-alabaster focus:outline-none focus:border-wisteria"
              />
              <button
                onClick={() => handleAddCustomProduct(dayTime)}
                disabled={saving || !customProductName.trim()}
                className="px-4 py-2 bg-deep-twilight text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => { setShowCustomInput(null); setCustomProductName('') }}
                className="px-3 py-2 text-drift-gray hover:text-deep-twilight"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(dayTime)}
              className="text-sm text-deep-twilight hover:underline"
            >
              + Add custom product
            </button>
          )}

          {/* Recent Products */}
          {recentProducts.length > 0 && showCustomInput !== dayTime && (
            <div className="mt-3">
              <p className="text-xs text-drift-gray mb-2">Recent products:</p>
              <div className="flex flex-wrap gap-2">
                {recentProducts.slice(0, 5).map(p => (
                  <button
                    key={p.productId}
                    onClick={() => handleAddRecentProduct(dayTime, p)}
                    disabled={saving}
                    className="text-xs px-3 py-1 bg-alabaster rounded-full hover:bg-wisteria/20 transition"
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-deep-twilight border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Streak */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading text-deep-twilight mb-2">Progress Tracker</h1>
            <p className="text-drift-gray">Track your daily skincare routine and see your consistency</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl">🔥</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-deep-twilight">{streak}</p>
              <p className="text-sm text-drift-gray">{streak === 1 ? 'day' : 'days'} streak</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
            <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {/* Today's Routines */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {renderRoutineSection('AM', amProducts, selectedAmProducts, dailyLog?.amRoutine?.completed || false)}
          {renderRoutineSection('PM', pmProducts, selectedPmProducts, dailyLog?.pmRoutine?.completed || false)}
        </div>

        {/* Skin Check-in */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-deep-twilight mb-4">How's your skin today?</h3>
          
          {/* Rating */}
          <div className="mb-6">
            <p className="text-sm text-drift-gray mb-3">Skin rating (1-10)</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  onClick={() => handleUpdateSkinRating(num)}
                  className={`w-10 h-10 rounded-full font-medium transition ${
                    skinRating === num
                      ? 'bg-deep-twilight text-white'
                      : 'bg-alabaster text-drift-gray hover:bg-wisteria/20'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Feelings */}
          <div className="mb-6">
            <p className="text-sm text-drift-gray mb-3">How does it feel?</p>
            <div className="flex flex-wrap gap-2">
              {SKIN_FEELINGS.map(feeling => (
                <button
                  key={feeling.id}
                  onClick={() => handleToggleSkinFeeling(feeling.id)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    skinFeeling.includes(feeling.id)
                      ? 'bg-deep-twilight text-white'
                      : 'bg-alabaster text-drift-gray hover:bg-wisteria/20'
                  }`}
                >
                  {feeling.emoji} {feeling.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-sm text-drift-gray mb-3">Notes (optional)</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Any observations about your skin today..."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-alabaster focus:outline-none focus:border-wisteria resize-none"
            />
            <p className="text-xs text-drift-gray mt-1">{notes.length}/500</p>
          </div>
        </div>

        {/* 7-Day History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-deep-twilight mb-4">Last 7 Days</h3>
          
          {history.length === 0 ? (
            <p className="text-drift-gray text-sm">No history yet. Start tracking today!</p>
          ) : (
            <div className="space-y-3">
              {history.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-porcelain rounded-lg">
                  <span className="font-medium text-deep-twilight">{formatDate(log.date)}</span>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${log.amRoutine?.completed ? 'text-green-600' : 'text-drift-gray'}`}>
                      ☀️ {log.amRoutine?.completed ? '✓' : '—'}
                    </span>
                    <span className={`text-sm ${log.pmRoutine?.completed ? 'text-green-600' : 'text-drift-gray'}`}>
                      🌙 {log.pmRoutine?.completed ? '✓' : '—'}
                    </span>
                    {log.skinRating && (
                      <span className="text-sm bg-alabaster px-2 py-1 rounded">
                        {log.skinRating}/10
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}