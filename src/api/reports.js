import { authFetch } from "./http"

/**
 * API POZIVI ZA IZVJEŠĆA
 * SVRHA:
 * - dohvat administratorskih izvješća
 * - izvješće po vrsti otpada
 * - izvješće po statusu radnih naloga
 * - izvješće po gradu
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
// - osnovna putanja za administratorska izvješća
const REPORTS_URL = `${API_BASE_URL}/api/admin/reports`

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - dohvaća izvješće o količini otpada prema vrsti otpada
 */
export async function fetchWasteByType() {
  const res = await authFetch(`${REPORTS_URL}/waste-by-type`)

  if (!res.ok) {
    throw new Error("Izvješće po vrsti otpada nije dostupno.")
  }

  return res.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - dohvaća izvješće o radnim nalozima prema statusu
 */
export async function fetchWorkOrdersByStatus() {
  const res = await authFetch(`${REPORTS_URL}/work-orders-by-status`)

  if (!res.ok) {
    throw new Error("Izvješće po statusu nije dostupno.")
  }

  return res.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - dohvaća izvješće o otpadu prema gradu
 */
export async function fetchWasteByCity() {
  const res = await authFetch(`${REPORTS_URL}/waste-by-city`)

  if (!res.ok) {
    throw new Error("Izvješće po gradu nije dostupno.")
  }

  return res.json()
}