import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { saveAuth } from '../utils/auth'
import { Link } from 'react-router-dom';

// STRANICA: LoginPage
// SVRHA:
// - prikazuje login formu
// - šalje podatke backendu
// - sprema token i role u localStorage
// - preusmjerava korisnika na odgovarajući dashboard

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser(email, password)

      saveAuth(data)

      if (data.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/user')
      }
    } catch (err) {
      setError(err.message || 'Greška kod prijave.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Evidencija zbrinjavanja otpada</h1>
        <p>Prijava u sustav</p>

        <form onSubmit={handleSubmit} className="form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="unesi email"
            required
          />

          <label>Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="unesi lozinku"
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Prijava u tijeku...' : 'Prijavi se'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <p>Nemate račun?</p>
    <Link to="/register" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
        Registrirajte se ovdje
    </Link>
</div>
      </div>
    </div>
  )
}

export default LoginPage