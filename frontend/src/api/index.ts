const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
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
submitContact: async (data: { name: string; email: string; subject: string; message: string }) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to send message')
  }
  return res.json()
}, 

  getRoutinesBySkinType: async (skinType: string) => {
    const response = await fetch(`${API_URL}/routines/${skinType}`)
    return response.json()
  },

  getProductsForStep: async (skinType: string, category: string) => {
    const response = await fetch(`${API_URL}/products/recommend/${skinType}/${category}`)
    return response.json()
  },

  getProductsForStepByTime: async (skinType: string, category: string, dayTime: string) => {
    const response = await fetch(`${API_URL}/products/recommend/${skinType}/${category}/${dayTime}`)
    return response.json()
  },

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

  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { ...getAuthHeader() }
    })
     if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch profile')
    }
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
  },

  // User account
getMe: async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeader()
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch user')
  }
  return res.json()
},

updateMe: async (data: { name?: string; username?: string }) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update profile')
  }
  return res.json()
},

deleteMe: async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'DELETE',
    headers: getAuthHeader()
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to delete account')
  }
  return res.json()
},

unlinkGoogle: async () => {
  const res = await fetch(`${API_URL}/auth/unlink-google`, {
    method: 'POST',
    headers: getAuthHeader()
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to unlink Google')
  }
  return res.json()
},
setPassword: async (password: string) => {
  const res = await fetch(`${API_URL}/auth/set-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ password })
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to set password')
  }
  return res.json()
},

changePassword: async (currentPassword: string, newPassword: string) => {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to change password')
  }
  return res.json()
},

updateIngredientSettings: async (data: { allergies: string[]; preferences: string[] }) => {
  const res = await fetch(`${API_URL}/profile/ingredient-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update ingredient settings')
  }
  return res.json()
},

getIngredientSettings: async () => {
  const res = await fetch(`${API_URL}/profile/ingredient-settings`, {
    headers: getAuthHeader()
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch ingredient settings')
  }
  return res.json()
},

// Progress tracking
  getDailyLog: async (date?: string) => {
    const url = date 
      ? `${API_URL}/progress/daily?date=${date}` 
      : `${API_URL}/progress/daily`
    const res = await fetch(url, {
      headers: getAuthHeader()
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to fetch daily log')
    }
    return res.json()
  },

  getRoutineProducts: async () => {
    const res = await fetch(`${API_URL}/progress/routine-products`, {
      headers: getAuthHeader()
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to fetch routine products')
    }
    return res.json()
  },

  logRoutineComplete: async (data: { dayTime: 'AM' | 'PM'; products: any[] }) => {
    const res = await fetch(`${API_URL}/progress/routine-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to log routine')
    }
    return res.json()
  },

  logProductUsage: async (data: { dayTime: 'AM' | 'PM'; product: any; isCustom?: boolean }) => {
    const res = await fetch(`${API_URL}/progress/log-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to log product')
    }
    return res.json()
  },

  removeProductFromLog: async (data: { dayTime: 'AM' | 'PM'; productId: string; isCustom?: boolean }) => {
    const res = await fetch(`${API_URL}/progress/remove-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to remove product')
    }
    return res.json()
  },

  updateDailyLog: async (data: { skinRating?: number; skinFeeling?: string[]; notes?: string }) => {
    const res = await fetch(`${API_URL}/progress/daily`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to update log')
    }
    return res.json()
  },

  getUsageHistory: async (days: number = 7) => {
    const res = await fetch(`${API_URL}/progress/history?days=${days}`, {
      headers: getAuthHeader()
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to fetch history')
    }
    return res.json()
  },

  getUsageWarnings: async () => {
    const res = await fetch(`${API_URL}/progress/warnings`, {
      headers: getAuthHeader()
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to fetch warnings')
    }
    return res.json()
  },

  getRecentProducts: async () => {
    const res = await fetch(`${API_URL}/progress/recent-products`, {
      headers: getAuthHeader()
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to fetch recent products')
    }
    return res.json()
  },

}
