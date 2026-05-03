import { getToken } from '../utils/auth'

// POMOĆNA FUNKCIJA ZA AUTH REQUESTOVE
// SVRHA:
// - automatski dodaje Bearer token
// - pojednostavljuje fetch pozive prema backendu

export async function authFetch(url, options = {}) {
  const token = getToken()

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}