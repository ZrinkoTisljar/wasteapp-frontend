// API POZIVI ZA LOGIN

export async function loginUser(email, password) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
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



export const registerUser = async (userData) => {
    // Pretpostavljam da koristiš fetch i proxy u vite.config.js, 
    // pa je URL samo '/api/auth/register'. Ako koristiš neki bazni URL, prilagodi ga.
    const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        //  backend baca badRequest() s tekstualnom porukom
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Greška prilikom registracije');
    }

    // Vraća "Registered." kao običan tekst
    return response.text();
};