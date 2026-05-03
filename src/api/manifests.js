import { authFetch } from "./http"

/**
 * API POZIVI ZA MANIFESTE
 */

export async function fetchMyManifests() {

  const response = await authFetch(
    "http://localhost:8080/api/manifests/mine"
  )

  if (!response.ok) {
    throw new Error("Dohvat manifesta nije uspio.")
  }

  return response.json()
}



//  Funkcija za sigurno preuzimanje PDF-a preko Blob-a
export async function downloadManifestPdf(id) {
  // 1. Koristi authFetch koji automatski šalje JWT token
  const response = await authFetch(`http://localhost:8080/api/manifests/${id}/pdf`);

  if (!response.ok) {
    throw new Error("Preuzimanje PDF-a nije uspjelo.");
  }

  // 2. Pretvara odgovor u binarne podatke (Blob)
  const blob = await response.blob();

  // 3. Stvara privremeni link i forsira preuzimanje
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Prateci_list_${id}.pdf`; // Ime pod kojim će se spremiti na disk
  
  document.body.appendChild(a);
  a.click(); // Simulira klik
  
  // 4. Čisti memoriju
  a.remove();
  window.URL.revokeObjectURL(url);
}

