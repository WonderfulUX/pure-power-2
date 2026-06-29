import '../css/modal.css'

export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel }) {
    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="btn-modal-cancel" onClick={onCancel}>Annuler</button>
                    <button className="btn-modal-confirm" onClick={onConfirm}>
                        {confirmLabel || 'Confirmer'}
                    </button>
                </div>
            </div>
        </div>
    )
}
