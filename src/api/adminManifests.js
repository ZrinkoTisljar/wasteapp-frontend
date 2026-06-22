import { authFetch } from "./http"

/**
 * API: admin manifests
 * SVRHA:
 * - admin generiranje manifesta za work order
 * - dohvat svih manifesta za administratora
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
// - osnovna putanja za admin manifest endpoint
const ADMIN_MANIFESTS_URL = `${API_BASE_URL}/api/admin/manifests`

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - administrator generira manifest/prateći list za određeni radni nalog
 *
 * PARAMETRI:
 * - workOrderId: ID radnog naloga
 * - note: napomena za manifest
 */
export async function createManifestForWorkOrder(workOrderId, note = "") {
  const res = await authFetch(ADMIN_MANIFESTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workOrderId,
      note,
    }),
  })

  if (!res.ok) {
    // Pokušaj pročitati poruku greške ako backend vraća tekst
    const text = await res.text().catch(() => "")
    throw new Error(text || "Generiranje manifesta nije uspjelo.")
  }

  return res.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - dohvaća sve manifeste za administratora
 */
export async function fetchAllManifests() {
  const res = await authFetch(ADMIN_MANIFESTS_URL)

  if (!res.ok) {
    throw new Error("Dohvat manifesta nije uspio.")
  }

  return res.json()
}