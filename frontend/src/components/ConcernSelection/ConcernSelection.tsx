import { useState } from 'react'

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

export default function ConcernSelection({ skinType, onComplete, onBack }: ConcernSelectionProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleConcern = (concernId: string) => {
    if (selected.includes(concernId)) {
      setSelected(selected.filter(id => id !== concernId))
    } else {
      setSelected([...selected, concernId])
    }
  }

  const commonConcerns = concerns.filter(c => c.commonFor.includes(skinType))
  const otherConcerns = concerns.filter(c => !c.commonFor.includes(skinType))

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full border border-alabaster">
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
                    selected.includes(concern.id)
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
                    selected.includes(concern.id)
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
          {selected.length} concern{selected.length !== 1 ? 's' : ''} selected
        </p>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-alabaster hover:bg-wisteria/30 transition font-medium"
          >
            Back to Results
          </button>
          <button
            onClick={() => onComplete(selected)}
            className="px-6 py-3 rounded-lg bg-deep-twilight hover:opacity-90 transition font-medium"
          >
            {selected.length > 0 ? 'View My Routine' : 'Skip for Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
