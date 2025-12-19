const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  // Quiz
  getQuiz: async () => {
    const response = await fetch(`${API_URL}/quiz`)
    return response.json()
  },

  submitQuiz: async (answers: { questionId: number; skinType: string }[]) => {
    const response = await fetch(`${API_URL}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
    return response.json()
  },

  // Routines
  getRoutinesBySkinType: async (skinType: string) => {
    const response = await fetch(`${API_URL}/routines/${skinType}`)
    return response.json()
  },

  // Products
  getProductsForStep: async (skinType: string, category: string) => {
    const response = await fetch(`${API_URL}/products/recommend/${skinType}/${category}`)
    return response.json()
  },

  getProductsForStepByTime: async (skinType: string, category: string, dayTime: string) => {
    const response = await fetch(`${API_URL}/products/recommend/${skinType}/${category}/${dayTime}`)
    return response.json()
  },

  // Auth
  register: async (data: { name: string; username: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
    return response.json()
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
    return response.json()
  },

  // Profile
  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { ...getAuthHeader() }
    })
    return response.json()
  },

  saveProfile: async (data: { skinType: string; concerns: string[]; quizAnswers?: any[] }) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  selectProduct: async (data: { category: string; productId: string; dayTime?: string }) => {
    const response = await fetch(`${API_URL}/profile/select-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  removeProduct: async (data: { category: string; dayTime?: string }) => {
    const response = await fetch(`${API_URL}/profile/remove-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  getSelectedProducts: async () => {
    const response = await fetch(`${API_URL}/profile/selected-products`, {
      headers: { ...getAuthHeader() }
    })
    return response.json()
  }
}
