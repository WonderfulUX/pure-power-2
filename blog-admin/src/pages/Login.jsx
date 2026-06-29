import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthenticated } from '../lib/auth'
import '../css/login.css'

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) navigate('/listing')
    }, [navigate])

    function handleSubmit(e) {
        e.preventDefault()
        if (login(username, password)) {
            navigate('/listing')
        } else {
            setError(true)
        }
    }

    return (
        <main id="admin-login">
            <div className="login-card">
                <div className="login-brand">Blog Admin</div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-field">
                        <span>Identifiant</span>
                        <input
                            type="text"
                            value={username}
                            onChange={e => { setUsername(e.target.value); setError(false) }}
                            autoComplete="username"
                            autoFocus
                        />
                    </label>
                    <label className="login-field">
                        <span>Mot de passe</span>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(false) }}
                            autoComplete="current-password"
                        />
                    </label>
                    {error && <p className="login-error">Identifiant ou mot de passe incorrect.</p>}
                    <button type="submit" className="login-submit">Se connecter</button>
                </form>
            </div>
        </main>
    )
}
