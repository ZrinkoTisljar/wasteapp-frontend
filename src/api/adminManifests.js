import { authFetch } from "./http"

/**
 * API: admin manifests
 * SVRHA:
 * - admin generiranje manifesta za work order
 */

export async function createManifestForWorkOrder(workOrderId, note = "") {
  const res = await authFetch("http://localhost:8080/api/admin/manifests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workOrderId,
      note,
    }),
  })

  if (!res.ok) {
    // pokušaj pročitati poruku ako backend vraća tekst
    const text = await res.text().catch(() => "")
    throw new Error(text || "Generiranje manifesta nije uspjelo.")
  }

  return res.json()
}

  export async function fetchAllManifests() {

  const res = await authFetch(
    "http://localhost:8080/api/admin/manifests"
  )

  if (!res.ok) {
    throw new Error("Dohvat manifesta nije uspio.")
  }

  return res.json()


}