const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// API POZIV ZA LOGIN
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login nije uspio.')
  }

  return response.json()
}

// API POZIV ZA REGISTRACIJU
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'Greška prilikom registracije')
  }

  return response.text()
}