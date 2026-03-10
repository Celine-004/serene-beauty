import { useState, useEffect } from 'react'
import { api } from '../../api'
import Navbar from '../Layout/Navbar'

interface Concern {
  id: string
  name: string
  description: string
  commonFor: string[]
}

const concerns: Concern[] = [
  { id: "acne", name: "Acne", description: "A condition where pores become clogged, leading to breakouts.", commonFor: ["oily", "combination"] },
  { id: "dryness", name: "Dryness", description: "Lack of moisture that causes tightness and flaking.", commonFor: ["dry", "sensitive"] },
  { id: "oiliness", name: "Oiliness", description: "Excess oil production that causes shine.", commonFor: ["oily"] },
  { id: "sensitivity", name: "Sensitivity", description: "Skin that reacts easily to products or environment.", commonFor: ["sensitive"] },
  { id: "redness", name: "Redness", description: "Visible redness caused by irritation or sensitivity.", commonFor: ["sensitive", "dry"] },
  { id: "uneven_texture", name: "Uneven Texture", description: "Rough or bumpy skin surface.", commonFor: ["oily", "combination", "normal"] },
  { id: "dullness", name: "Dullness", description: "Lack of radiance or glow.", commonFor: ["dry", "normal", "combination"] },
  { id: "large_pores", name: "Large Pores", description: "Visible pores often related to oil production.", commonFor: ["oily", "combination"] },
  { id: "fine_lines", name: "Fine Lines", description: "Small lines caused by dehydration or aging.", commonFor: ["dry", "normal"] },
  { id: "dark_spots", name: "Dark Spots", description: "Pigmented areas from sun exposure or acne.", commonFor: ["normal", "combination", "oily"] }
]

interface ConcernSelectionProps {
  skinType: string
  onComplete: (selectedConcerns: string[]) => void
  onBack: () => void
}

type Step = 'concerns' | 'ingredients'

export default function ConcernSelection({ skinType, onComplete, onBack }: ConcernSelectionProps) {
  const [step, setStep] = useState<Step>('concerns')
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [loadingExisting, setLoadingExisting] = useState(true)
  
  // Ingredient states
  const [allergies, setAllergies] = useState<string[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [commonAllergens, setCommonAllergens] = useState<string[]>([])
  const [allIngredients, setAllIngredients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'allergies' | 'preferences'>('allergies')
  const [loading, setLoading] = useState(false)

  // Load existing selections on mount
  useEffect(() => {
    const loadExistingSelections = async () => {
      setLoadingExisting(true)
      
      // Load concerns from storage
      const storedConcerns = sessionStorage.getItem('concerns') || localStorage.getItem('concerns')
      if (storedConcerns) {
        try {
          setSelectedConcerns(JSON.parse(storedConcerns))
        } catch (e) {
          console.error('Error parsing stored concerns:', e)
        }
      }
      
      // Load ingredient settings from storage
      const storedIngredients = sessionStorage.getItem('ingredientSettings') || localStorage.getItem('ingredientSettings')
      if (storedIngredients) {
        try {
          const settings = JSON.parse(storedIngredients)
          setAllergies(settings.allergies || [])
          setPreferences(settings.preferences || [])
        } catch (e) {
          console.error('Error parsing stored ingredients:', e)
        }
      }
      
      // If logged in, fetch from API (overrides storage)
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Fetch profile for concerns
          const profileData = await api.getProfile()
          if (profileData.profile?.concerns) {
            setSelectedConcerns(profileData.profile.concerns)
          }
          
          // Fetch ingredient settings
          const ingredientData = await api.getIngredientSettings()
          if (ingredientData.ingredientSettings) {
            setAllergies(ingredientData.ingredientSettings.allergies || [])
            setPreferences(ingredientData.ingredientSettings.preferences || [])
          }
        } catch (error) {
          console.error('Error fetching existing selections:', error)
        }
      }
      
      setLoadingExisting(false)
    }
    
    loadExistingSelections()
  }, [])

  useEffect(() => {
    if (step === 'ingredients') {
      fetchIngredients()
    }
  }, [step])

  const fetchIngredients = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ingredients`)
      const data = await res.json()
      setCommonAllergens(data.commonAllergens || [])
      setAllIngredients(data.allIngredients || [])
    } catch (error) {
      console.error('Failed to fetch ingredients:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleConcern = (concernId: string) => {
    if (selectedConcerns.includes(concernId)) {
      setSelectedConcerns(selectedConcerns.filter(id => id !== concernId))
    } else {
      setSelectedConcerns([...selectedConcerns, concernId])
    }
  }

  const toggleIngredient = (ingredient: string, type: 'allergies' | 'preferences') => {
    if (type === 'allergies') {
      if (allergies.includes(ingredient)) {
        setAllergies(allergies.filter(i => i !== ingredient))
      } else {
        setAllergies([...allergies, ingredient])
        setPreferences(preferences.filter(i => i !== ingredient))
      }
    } else {
      if (preferences.includes(ingredient)) {
        setPreferences(preferences.filter(i => i !== ingredient))
      } else {
        setPreferences([...preferences, ingredient])
        setAllergies(allergies.filter(i => i !== ingredient))
      }
    }
  }

  const handleComplete = async () => {
    const token = localStorage.getItem('token')
    
    // Save ingredient settings
    if (token) {
      try {
        await api.updateIngredientSettings({ allergies, preferences })
      } catch (error) {
        console.error('Failed to save ingredient settings:', error)
      }
    }
    
    // Store in sessionStorage for all users
    sessionStorage.setItem('ingredientSettings', JSON.stringify({ allergies, preferences }))
    localStorage.setItem('ingredientSettings', JSON.stringify({ allergies, preferences }))
    
    // Store concerns
    sessionStorage.setItem('concerns', JSON.stringify(selectedConcerns))
    localStorage.setItem('concerns', JSON.stringify(selectedConcerns))
    
    onComplete(selectedConcerns)
  }

  const commonConcerns = concerns.filter(c => c.commonFor.includes(skinType))
  const otherConcerns = concerns.filter(c => !c.commonFor.includes(skinType))

  const filteredIngredients = searchTerm
    ? allIngredients.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  // Loading state
  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-porcelain">
        <Navbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-deep-twilight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading your preferences...</p>
          </div>
        </div>
      </div>
    )
  }

  // Step 1: Concerns
  if (step === 'concerns') {
    return (
      <div className="min-h-screen bg-porcelain">
        <Navbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full border border-alabaster">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-deep-twilight flex items-center justify-center text-alabaster font-medium">1</div>
                <div className="w-16 h-1 bg-alabaster"></div>
                <div className="w-8 h-8 rounded-full bg-alabaster flex items-center justify-center text-midnight font-medium">2</div>
              </div>
            </div>

            <h2 className="text-3xl font-heading text-deep-twilight mb-2 text-center">
              What are your skin concerns?
            </h2>
            <p className="text-center mb-6">
              Select all that apply. This helps us personalize your routine.
            </p>

            {commonConcerns.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-heading text-deep-twilight mb-3">
                  Common for {skinType} skin
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {commonConcerns.map(concern => (
                    <button
                      key={concern.id}
                      onClick={() => toggleConcern(concern.id)}
                      className={`p-4 rounded-lg border text-left transition ${
                        selectedConcerns.includes(concern.id)
                          ? 'border-deep-twilight bg-lavender-veil'
                          : 'border-alabaster hover:border-wisteria'
                      }`}
                    >
                      <span className="font-medium">{concern.name}</span>
                      <p className="text-sm mt-1 opacity-80">{concern.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {otherConcerns.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-heading text-deep-twilight mb-3">
                  Other concerns
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {otherConcerns.map(concern => (
                    <button
                      key={concern.id}
                      onClick={() => toggleConcern(concern.id)}
                      className={`p-4 rounded-lg border text-left transition ${
                        selectedConcerns.includes(concern.id)
                          ? 'border-deep-twilight bg-lavender-veil'
                          : 'border-alabaster hover:border-wisteria'
                      }`}
                    >
                      <span className="font-medium">{concern.name}</span>
                      <p className="text-sm mt-1 opacity-80">{concern.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-sm mb-6">
              {selectedConcerns.length} concern{selectedConcerns.length !== 1 ? 's' : ''} selected
            </p>

            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-lg bg-alabaster hover:bg-wisteria/30 transition font-medium"
              >
                Back to Results
              </button>
              <button
                onClick={() => setStep('ingredients')}
                className="px-6 py-3 rounded-lg bg-deep-twilight hover:opacity-90 transition font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Ingredients
  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full border border-alabaster">
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-deep-twilight flex items-center justify-center text-alabaster font-medium">✓</div>
              <div className="w-16 h-1 bg-deep-twilight"></div>
              <div className="w-8 h-8 rounded-full bg-deep-twilight flex items-center justify-center text-alabaster font-medium">2</div>
            </div>
          </div>

          <h2 className="text-3xl font-heading text-deep-twilight mb-2 text-center">
            Any ingredients to avoid?
          </h2>
          <p className="text-center mb-6">
            Tell us about allergies or preferences so we can filter your recommendations.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('allergies')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                activeTab === 'allergies'
                  ? 'bg-deep-twilight'
                  : 'bg-alabaster hover:bg-wisteria/30'
              }`}
            >
              Allergies ({allergies.length})
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                activeTab === 'preferences'
                  ? 'bg-deep-twilight'
                  : 'bg-alabaster hover:bg-wisteria/30'
              }`}
            >
              Preferences ({preferences.length})
            </button>
          </div>

          {/* Tab description */}
          <div className="bg-lavender-veil/30 rounded-lg p-4 mb-6">
            {activeTab === 'allergies' ? (
              <p className="text-sm">
                <strong>Allergies:</strong> Products containing these ingredients will be <strong>hidden</strong> from your recommendations.
              </p>
            ) : (
              <p className="text-sm">
                <strong>Preferences:</strong> Products containing these ingredients will be <strong>flagged with a warning</strong> but still shown.
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-deep-twilight border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Common allergens */}
              <div className="mb-6">
                <h3 className="text-lg font-heading text-deep-twilight mb-3">
                  Common allergens
                </h3>
                <div className="flex flex-wrap gap-2">
                  {commonAllergens.map(ingredient => {
                    const isAllergy = allergies.includes(ingredient)
                    const isPreference = preferences.includes(ingredient)
                    const isSelected = activeTab === 'allergies' ? isAllergy : isPreference
                    
                    return (
                      <button
                        key={ingredient}
                        onClick={() => toggleIngredient(ingredient, activeTab)}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          isSelected
                            ? 'bg-deep-twilight'
                            : isAllergy
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : isPreference
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-alabaster hover:bg-wisteria/30'
                        }`}
                      >
                        {ingredient}
                        {isAllergy && activeTab !== 'allergies' && ' 🚫'}
                        {isPreference && activeTab !== 'preferences' && ' ⚠️'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <h3 className="text-lg font-heading text-deep-twilight mb-3">
                  Search all ingredients
                </h3>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                />
                {searchTerm && (
                  <div className="mt-3 max-h-40 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {filteredIngredients.slice(0, 20).map(ingredient => {
                        const isAllergy = allergies.includes(ingredient)
                        const isPreference = preferences.includes(ingredient)
                        const isSelected = activeTab === 'allergies' ? isAllergy : isPreference
                        
                        return (
                          <button
                            key={ingredient}
                            onClick={() => toggleIngredient(ingredient, activeTab)}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                              isSelected
                                ? 'bg-deep-twilight'
                                : isAllergy
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : isPreference
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-alabaster hover:bg-wisteria/30'
                            }`}
                          >
                            {ingredient}
                          </button>
                        )
                      })}
                      {filteredIngredients.length > 20 && (
                        <span className="text-sm opacity-60 self-center">
                          +{filteredIngredients.length - 20} more...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected summary */}
              {(allergies.length > 0 || preferences.length > 0) && (
                <div className="mb-6 p-4 bg-alabaster/50 rounded-lg">
                  <h4 className="font-medium mb-2">Your selections:</h4>
                  {allergies.length > 0 && (
                    <div className="mb-2">
                      <span className="text-red-600 text-sm font-medium">🚫 Allergies: </span>
                      <span className="text-sm">{allergies.join(', ')}</span>
                    </div>
                  )}
                  {preferences.length > 0 && (
                    <div>
                      <span className="text-amber-600 text-sm font-medium">⚠️ Preferences: </span>
                      <span className="text-sm">{preferences.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Disclaimer */}
          <div className="bg-alabaster/50 rounded-lg p-4 mb-6">
            <p className="text-xs opacity-70">
              <strong>Note:</strong> Ingredient lists are sourced from official brand websites. 
              Formulations may vary by country or region. Always check the product packaging for the most accurate information.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('concerns')}
              className="px-6 py-3 rounded-lg bg-alabaster hover:bg-wisteria/30 transition font-medium"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-3 rounded-lg bg-deep-twilight hover:opacity-90 transition font-medium"
            >
              {allergies.length > 0 || preferences.length > 0 || selectedConcerns.length > 0 ? 'Save & View Routine' : 'Skip & View Routine'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
