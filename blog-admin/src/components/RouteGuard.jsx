import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, refreshActivity } from '../lib/auth'

export default function RouteGuard({ children }) {
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/')
            return
        }

        const events = ['mousemove', 'keydown', 'click', 'scroll']
        events.forEach(ev => window.addEventListener(ev, refreshActivity))

        const check = setInterval(() => {
            if (!isAuthenticated()) navigate('/')
        }, 30000)

        return () => {
            events.forEach(ev => window.removeEventListener(ev, refreshActivity))
            clearInterval(check)
        }
    }, [navigate])

    if (!isAuthenticated()) return null
    return children
}
