import { authFetch } from "./http"

/**
 * API POZIVI ZA MANIFESTE
 * SVRHA:
 * - dohvat pratećih listova za prijavljenog korisnika
 * - preuzimanje PDF dokumenta pratećeg lista
 * - koristi lokalni backend u razvoju
 * - koristi cloud backend ako je postavljen VITE_API_BASE_URL
 */

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - dohvaća backend URL iz .env datoteke ako postoji
// - ako .env ne postoji, koristi lokalni backend na localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - osnovna putanja za korisničke manifeste
const MANIFESTS_URL = `${API_BASE_URL}/api/manifests`

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - dohvaća manifeste/prateće listove prijavljenog korisnika
 */
export async function fetchMyManifests() {
  const response = await authFetch(`${MANIFESTS_URL}/mine`)

  if (!response.ok) {
    throw new Error("Dohvat manifesta nije uspio.")
  }

  return response.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - preuzima PDF pratećeg lista prema ID-u manifesta
 * - koristi Blob kako bi se PDF mogao spremiti kao datoteka
 */
export async function downloadManifestPdf(id) {
  // 1. Koristi authFetch koji automatski šalje JWT token
  const response = await authFetch(`${MANIFESTS_URL}/${id}/pdf`)

  if (!response.ok) {
    throw new Error("Preuzimanje PDF-a nije uspjelo.")
  }

  // 2. Pretvara odgovor u binarne podatke (Blob)
  const blob = await response.blob()

  // 3. Stvara privremeni link i pokreće preuzimanje PDF datoteke
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = `Prateci_list_${id}.pdf`

  document.body.appendChild(a)
  a.click()

  // 4. Čisti privremeni link i oslobađa memoriju
  a.remove()
  window.URL.revokeObjectURL(url)
}