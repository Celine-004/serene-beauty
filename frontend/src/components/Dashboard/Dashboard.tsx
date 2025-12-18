import { useState, useEffect } from 'react'
import { api } from '../../api'

interface Step {
  order: number
  category: string
}

interface Routine {
  id: string
  name: string
  skinType: string
  dayTime: string
  description: string
  steps: Step[]
}

interface Product {
  id: string
  name: string
  brand: string
  category: string
  description: string
  suitableFor: string[]
  targetConcerns: string[]
  keyIngredients: string[]
  priceRange: string
  imageURL?: string
}

const stepInstructions: Record<string, string> = {
  cleanser: "Apply to damp skin and gently massage in circular motions. Rinse with lukewarm water.",
  toner: "Apply to clean skin using hands or a cotton pad. Gently press into the skin.",
  serum: "Apply a small amount and gently pat until absorbed.",
  treatment: "Apply a thin layer to targeted areas only.",
  moisturizer: "Apply evenly to lock in hydration.",
  sunscreen: "Apply as the final morning step. Reapply every few hours if exposed to sunlight."
}

const concernLabels: Record<string, string> = {
  acne: "Acne",
  dryness: "Dryness",
  oiliness: "Oiliness",
  sensitivity: "Sensitivity",
  redness: "Redness",
  uneven_texture: "Uneven Texture",
  dullness: "Dullness",
  large_pores: "Large Pores",
  fine_lines: "Fine Lines",
  dark_spots: "Dark Spots"
}

const skinTypeDescriptions: Record<string, string> = {
  oily: "Your skin produces excess sebum, especially in the T-zone. Focus on balancing and mattifying products.",
  dry: "Your skin lacks moisture and may feel tight. Focus on hydrating and nourishing products.",
  combination: "Your skin is oily in some areas and dry in others. Focus on balancing products.",
  sensitive: "Your skin reacts easily to products and environment. Focus on gentle, soothing products.",
  normal: "Your skin is well-balanced. Focus on maintaining its health with consistent care."
}

export default function Dashboard() {
  const [skinType, setSkinType] = useState<string>('')
  const [concerns, setConcerns] = useState<string[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [activeRoutine, setActiveRoutine] = useState<'AM' | 'PM' | 'Daily'>('AM')
  const [stepProducts, setStepProducts] = useState<Record<string, Product[]>>({})
  const [concernTreatments, setConcernTreatments] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [priceFilter, setPriceFilter] = useState<string>('all')
  const [hiddenSteps, setHiddenSteps] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const storedSkinType = sessionStorage.getItem('skinType') || 'normal'
    const storedConcerns = JSON.parse(sessionStorage.getItem('concerns') || '[]')
    
    setSkinType(storedSkinType)
    setConcerns(storedConcerns)

    const fetchRoutines = async () => {
      try {
        const data = await api.getRoutinesBySkinType(storedSkinType)
        setRoutines(data.routines)
        
        if (data.routines.length > 0) {
          const firstRoutine = data.routines[0]
          setActiveRoutine(firstRoutine.dayTime as 'AM' | 'PM' | 'Daily')
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching routines:', error)
        setLoading(false)
      }
    }

    fetchRoutines()
  }, [])

  useEffect(() => {
    const currentRoutine = routines.find(r => r.dayTime === activeRoutine)
    if (!currentRoutine || !skinType) return

    const fetchProducts = async () => {
      const products: Record<string, Product[]> = {}
      
      for (const step of currentRoutine.steps) {
        try {
          const dayTimeParam = activeRoutine === 'Daily' ? 'AM' : activeRoutine
          const data = await api.getProductsForStepByTime(skinType, step.category, dayTimeParam)
          products[step.category] = data.products || []
        } catch (error) {
          console.error(`Error fetching ${step.category} products:`, error)
          products[step.category] = []
        }
      }
      
      setStepProducts(products)
    }

    fetchProducts()
  }, [activeRoutine, routines, skinType])

  useEffect(() => {
    if (!skinType || concerns.length === 0) return

    const fetchTreatments = async () => {
      try {
        const data = await api.getProductsForStep(skinType, 'treatment')
        const treatments = data.products || []
        
        const relevantTreatments = treatments.filter((product: Product) =>
          product.targetConcerns?.some(concern => concerns.includes(concern))
        )
        
        setConcernTreatments(relevantTreatments)
      } catch (error) {
        console.error('Error fetching treatments:', error)
      }
    }

    fetchTreatments()
  }, [skinType, concerns])

  const currentRoutine = routines.find(r => r.dayTime === activeRoutine)
  const hasMultipleRoutines = routines.length > 1
  const visibleSteps = currentRoutine?.steps.filter(step => !hiddenSteps.includes(step.category)) || []

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      cleanser: "🧴",
      toner: "💧",
      serum: "✨",
      treatment: "🎯",
      moisturizer: "🧈",
      sunscreen: "☀️"
    }
    return icons[category] || "•"
  }

  const toggleStep = (category: string) => {
    if (hiddenSteps.includes(category)) {
      setHiddenSteps(hiddenSteps.filter(s => s !== category))
    } else {
      setHiddenSteps([...hiddenSteps, category])
    }
  }

  const filterProductsByPrice = (products: Product[]) => {
    if (priceFilter === 'all') return products
    return products.filter(p => p.priceRange === priceFilter)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-porcelain">
        <p className="text-lg">Loading your routine...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-porcelain">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 lg:order-1">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-heading text-deep-twilight mb-2">
                Your Skincare Routine
              </h1>
              <p className="text-lg opacity-80">
                A personalized routine designed just for you
              </p>
            </div>

            {/* Routine Toggle */}
            {hasMultipleRoutines && (
              <div className="flex gap-4 mb-6">
                {routines.map(routine => (
                  <button
                    key={routine.id}
                    onClick={() => setActiveRoutine(routine.dayTime as 'AM' | 'PM' | 'Daily')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      activeRoutine === routine.dayTime
                        ? 'bg-deep-twilight'
                        : 'bg-white border border-alabaster hover:border-wisteria'
                    }`}
                  >
                    {routine.dayTime === 'AM' ? '☀️ Morning' : routine.dayTime === 'PM' ? '🌙 Evening' : '📅 Daily'}
                  </button>
                ))}
              </div>
            )}

            {/* Routine Description */}
            {currentRoutine && (
              <div className="bg-lavender-veil rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-heading text-deep-twilight mb-2">
                  {currentRoutine.name}
                </h2>
                <p>{currentRoutine.description}</p>
              </div>
            )}

            {/* Steps */}
            {currentRoutine && (
              <div className="space-y-4 mb-12">
                {visibleSteps.map((step, index) => (
                  <div 
                    key={step.order} 
                    className="bg-white rounded-lg shadow-lg border border-alabaster overflow-hidden"
                  >
                    {/* Step Header */}
                    <button
                      onClick={() => setExpandedStep(expandedStep === step.category ? null : step.category)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-alabaster/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-full bg-deep-twilight flex items-center justify-center text-lg">
                          {getCategoryIcon(step.category)}
                        </span>
                        <div className="text-left">
                          <h3 className="text-xl font-heading text-deep-twilight">
                            Step {index + 1}: {formatCategory(step.category)}
                          </h3>
                          <p className="text-sm opacity-70">
                            {stepInstructions[step.category]}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl opacity-50">
                        {expandedStep === step.category ? '−' : '+'}
                      </span>
                    </button>

                    {/* Expanded Product Recommendations */}
                    {expandedStep === step.category && (
                        <div className="px-6 pb-6 border-t border-alabaster pt-4">
                        <h4 className="font-medium mb-4">Recommended Products</h4>
                        {filterProductsByPrice(stepProducts[step.category] || []).length > 0 ? (
                          <div className="max-h-96 overflow-y-auto">
                            {filterProductsByPrice(stepProducts[step.category] || []).map(product => (
                              <div 
                                key={product.id} 
                                className="border border-alabaster rounded-lg p-4 hover:border-wisteria transition"
                              >
                                <p className="text-sm text-wisteria mb-1">{product.brand}</p>
                                <h5 className="font-medium mb-2">{product.name}</h5>
                                <p className="text-sm opacity-80 mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(product.keyIngredients || []).slice(0, 3).map((ingredient, i) => (
                                    <span key={i} className="text-xs bg-lavender-veil px-2 py-1 rounded">
                                      {ingredient}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-sm opacity-70">
                                  {product.priceRange === 'budget' ? '💰 Budget-friendly' : 
                                   product.priceRange === 'mid-range' ? '💰💰 Mid-range' : '💰💰💰 Premium'}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center opacity-70 py-4">
                            {priceFilter !== 'all' 
                              ? `No ${priceFilter} products found for this step.` 
                              : 'No products found for this step.'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Concern-Based Treatments */}
            {concerns.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading text-deep-twilight mb-4">
                  Treatments for Your Concerns
                </h2>
                <p className="mb-6 opacity-80">
                  These treatments specifically target your selected concerns. Consider adding them to your evening routine.
                </p>
                
                {filterProductsByPrice(concernTreatments).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterProductsByPrice(concernTreatments).map(product => (
                      <div 
                        key={product.id} 
                        className="bg-white border border-alabaster rounded-lg p-4 hover:border-wisteria transition"
                      >
                        <p className="text-sm text-wisteria mb-1">{product.brand}</p>
                        <h5 className="font-medium mb-2">{product.name}</h5>
                        <p className="text-sm opacity-80 mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.targetConcerns
                            .filter(c => concerns.includes(c))
                            .map((concern, i) => (
                              <span key={i} className="text-xs bg-wisteria/30 px-2 py-1 rounded-full">
                                {concernLabels[concern] || concern}
                              </span>
                            ))}
                        </div>
                        
                        <p className="text-sm opacity-70">
                          {product.priceRange === 'budget' ? '💰 Budget-friendly' : 
                           product.priceRange === 'mid-range' ? '💰💰 Mid-range' : '💰💰💰 Premium'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-alabaster rounded-lg p-8 text-center">
                    <p className="opacity-70">
                      {priceFilter !== 'all' 
                        ? `No ${priceFilter} treatments found for your concerns.` 
                        : 'No specific treatments found for your concerns yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Save Prompt */}
            {!isLoggedIn && (
              <div className="bg-deep-twilight rounded-lg p-8 text-center">
                <h3 className="text-2xl font-heading mb-2">Save Your Routine</h3>
                <p className="mb-6 opacity-90">
                  Create a free account to save your routine, track your progress, and get personalized tips.
                </p>
                <a
                  href="/register"
                  className="inline-block bg-white text-deep-twilight px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
                >
                  Create Free Account
                </a>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg border border-alabaster p-6 sticky top-8">
              
              {/* Skin Type Badge */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-lavender-veil mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">
                    {skinType === 'oily' ? '💧' : skinType === 'dry' ? '🏜️' : skinType === 'sensitive' ? '🌸' : skinType === 'combination' ? '⚖️' : '✨'}
                  </span>
                </div>
                <h2 className="text-xl font-heading text-deep-twilight capitalize">
                  {skinType} Skin
                </h2>
                <p className="text-sm mt-2 opacity-80">
                  {skinTypeDescriptions[skinType]}
                </p>
              </div>

              {/* Concerns */}
              {concerns.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-heading text-deep-twilight mb-3">Your Concerns</h3>
                  <div className="flex flex-wrap gap-2">
                    {concerns.map(concern => (
                      <span
                        key={concern}
                        className="text-sm bg-deep-twilight px-3 py-2 rounded-lg"
                      >
                        {concernLabels[concern] || concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-heading text-deep-twilight mb-3">Price Range</h3>
                <div className="space-y-2">
                  {['all', 'budget', 'mid-range', 'premium'].map(price => (
                    <button
                      key={price}
                      onClick={() => setPriceFilter(price)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                        priceFilter === price
                          ? 'bg-deep-twilight'
                          : 'bg-alabaster hover:bg-wisteria/30'
                      }`}
                    >
                      {price === 'all' ? '🏷️ All Prices' : 
                       price === 'budget' ? '💰 Budget-friendly' : 
                       price === 'mid-range' ? '💰💰 Mid-range' : '💰💰💰 Premium'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Steps */}
              <div className="mb-6">
                <h3 className="font-heading text-deep-twilight mb-3">Show/Hide Steps</h3>
                <div className="space-y-2">
                  {currentRoutine?.steps.map(step => (
                    <button
                      key={step.category}
                      onClick={() => toggleStep(step.category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm flex items-center justify-between ${
                        hiddenSteps.includes(step.category)
                          ? 'bg-alabaster opacity-50'
                          : 'bg-alabaster hover:bg-wisteria/30'
                      }`}
                    >
                      <span>{getCategoryIcon(step.category)} {formatCategory(step.category)}</span>
                      <span>{hiddenSteps.includes(step.category) ? '○' : '●'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Routine Info */}
              <div className="mb-6 p-4 bg-alabaster rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-70">Active Steps</span>
                  <span className="font-medium">{visibleSteps.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Est. Time</span>
                  <span className="font-medium">~{visibleSteps.length * 2} min</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <a
                  href="/concerns"
                  className="block text-center px-4 py-2 rounded-lg bg-alabaster hover:bg-wisteria/30 transition font-medium text-sm"
                >
                  Update Concerns
                </a>
                <a
                  href="/quiz"
                  className="block text-center px-4 py-2 rounded-lg bg-alabaster hover:bg-wisteria/30 transition font-medium text-sm"
                >
                  Retake Quiz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}