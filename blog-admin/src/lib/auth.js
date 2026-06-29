const SESSION_KEY = 'pp_admin_session'
const CREDENTIALS = { username: 'pp_admin', password: 'pp_pwd2026' }
const TIMEOUT = 15 * 60 * 1000

export function login(username, password) {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }))
        return true
    }
    return false
}

export function logout() {
    sessionStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated() {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const session = JSON.parse(raw)
    return Date.now() - session.lastActivity < TIMEOUT
}

export function refreshActivity() {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }))
}
