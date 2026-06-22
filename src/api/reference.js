import { authFetch } from './http'

// API POZIVI ZA REFERENCE DATA
// SVRHA:
// - dohvat vrsta otpada
// - dohvat lokacija ako se koriste u aplikaciji
// - koristi lokalni backend u razvoju
// - koristi cloud backend ako je postavljen VITE_API_BASE_URL

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - dohvaća backend URL iz .env datoteke ako postoji
// - ako .env ne postoji, koristi lokalni backend na localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - osnovna putanja za referentne podatke
const REFERENCE_URL = `${API_BASE_URL}/api/reference`

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - dohvaća vrste otpada iz backend aplikacije
export async function fetchWasteTypes() {
  const response = await authFetch(`${REFERENCE_URL}/waste-types`)

  if (!response.ok) {
    throw new Error('Dohvat vrsta otpada nije uspio.')
  }

  return response.json()
}

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - dohvaća lokacije prikupljanja ako se koriste u aplikaciji
// - u trenutnoj verziji sustava korisnik uglavnom ručno unosi adresu preuzimanja
export async function fetchCollectionPoints() {
  const response = await authFetch(`${REFERENCE_URL}/collection-points`)

  if (!response.ok) {
    throw new Error('Dohvat lokacija nije uspio.')
  }

  return response.json()
}