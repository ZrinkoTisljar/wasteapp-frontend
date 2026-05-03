// POMOĆNE FUNKCIJE ZA AUTH
// SVRHA:
// - spremanje tokena i podataka o korisniku
// - dohvat prijavljenog korisnika
// - logout

const STORAGE_KEY = 'wasteapp_auth'

export function saveAuth(authData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
}

export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getToken() {
  const auth = getAuth()
  return auth?.token || null
}

export function getRole() {
  const auth = getAuth()
  return auth?.role || null
}

export function isLoggedIn() {
  return !!getToken()
}