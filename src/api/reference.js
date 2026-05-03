import { authFetch } from './http'

// API POZIVI ZA REFERENCE DATA

export async function fetchWasteTypes() {
  const response = await authFetch('http://localhost:8080/api/reference/waste-types')

  if (!response.ok) {
    throw new Error('Dohvat vrsta otpada nije uspio.')
  }

  return response.json()
}

export async function fetchCollectionPoints() {
  const response = await authFetch('http://localhost:8080/api/reference/collection-points')

  if (!response.ok) {
    throw new Error('Dohvat lokacija nije uspio.')
  }

  return response.json()
}