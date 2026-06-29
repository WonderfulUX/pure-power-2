import { useEffect } from 'react'
import '../css/modal.css'

export default function Toast({ message, onDismiss }) {
    useEffect(() => {
        const t = setTimeout(onDismiss, 5000)
        return () => clearTimeout(t)
    }, [onDismiss])

    return (
        <div className="toast" onClick={onDismiss}>
            {message}
        </div>
    )
}
