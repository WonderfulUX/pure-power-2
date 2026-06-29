import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RouteGuard from './components/RouteGuard'
import Login from './pages/Login'
import Listing from './pages/Listing'
import Builder from './pages/Builder'
import Preview from './pages/Preview'

export default function App() {
    return (
        <BrowserRouter basename="/blog-admin">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/listing" element={<RouteGuard><Listing /></RouteGuard>} />
                <Route path="/builder" element={<RouteGuard><Builder /></RouteGuard>} />
                <Route path="/builder/preview/*" element={<RouteGuard><Preview /></RouteGuard>} />
            </Routes>
        </BrowserRouter>
    )
}
