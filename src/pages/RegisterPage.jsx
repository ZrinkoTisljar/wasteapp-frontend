// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';

const RegisterPage = () => {
    const navigate = useNavigate();
    
    // Inicijalno stanje forme
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'CITIZEN', // Zadano je građanin
        fullName: '',
        companyName: '',
        oib: '',
        address: '',
        phone: ''
    });

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dinamičko ažuriranje polja
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            await registerUser(formData);
            setSuccessMsg('Registracija uspješna! Molimo pričekajte da administrator odobri vaš račun.');
            
            // Prebaci korisnika na login nakon 3 sekunde
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Registracija</h2>
            
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <label>Tip korisnika:</label>
                <select name="userType" value={formData.userType} onChange={handleChange}>
                    <option value="CITIZEN">Građanin</option>
                    <option value="COMPANY">Tvrtka</option>
                </select>

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Lozinka:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="8" />

                {/* Dinamički prikaz polja ovisno o tipu korisnika */}
                {formData.userType === 'CITIZEN' ? (
                    <>
                        <label>Ime i prezime:</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </>
                ) : (
                    <>
                        <label>Naziv tvrtke:</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                        
                        <label>OIB:</label>
                        <input type="text" name="oib" value={formData.oib} onChange={handleChange} required />
                    </>
                )}

                <label>Adresa:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />

                <label>Telefon:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

                <button type="submit" disabled={isLoading} style={{ marginTop: '10px', padding: '10px' }}>
                    {isLoading ? 'Registracija u tijeku...' : 'Registriraj se'}
                </button>
            </form>

            <p style={{ marginTop: '20px' }}>
                Već imate račun? <Link to="/login">Prijavite se ovdje</Link>.
            </p>
        </div>
    );
};

export default RegisterPage;