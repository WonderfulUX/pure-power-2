import { useState } from 'react'
import {
    getCategories, createCategory, updateCategory, deleteCategory,
    getArticles, updateArticle, deleteArticle,
} from '../lib/db'
import ConfirmModal from './ConfirmModal'
import '../css/modal.css'

export default function CategoriesModal({ onClose }) {
    const [categories, setCategories] = useState(getCategories)
    const [search, setSearch] = useState('')
    const [newRow, setNewRow] = useState(null)
    const [error, setError] = useState('')
    const [confirm, setConfirm] = useState(null)

    function reload() { setCategories(getCategories()) }

    function articleCount(catId) {
        return getArticles().filter(a => a.category_id === catId).length
    }

    function handleBlur(id, field, value) {
        updateCategory(id, { [field]: value })
        reload()
    }

    function handleNewCategory() {
        setNewRow({ name_fr: '', name_en: '' })
        setError('')
    }

    function handleNewValidate() {
        if (!newRow.name_fr && !newRow.name_en) {
            setError('Au moins un nom est requis.')
            return
        }
        createCategory(newRow)
        setNewRow(null)
        setError('')
        reload()
    }

    function handleArchive(cat) {
        const linked = getArticles().filter(a => a.category_id === cat.id)
        if (linked.length > 0) {
            const names = linked.map(a => a.title_fr || '(sans titre)').join(', ')
            setConfirm({
                message: `Êtes-vous sûr de vouloir archiver "${cat.name_fr}" ? Cela archivera les articles suivants : ${names}. Ces articles ne seront plus publiés.`,
                onConfirm: () => {
                    updateCategory(cat.id, { status: 'archived' })
                    linked.forEach(a => updateArticle(a.id, { status: 'archivé' }))
                    reload()
                    setConfirm(null)
                },
            })
        } else {
            updateCategory(cat.id, { status: 'archived' })
            reload()
        }
    }

    function handleDelete(cat) {
        const linked = getArticles().filter(a => a.category_id === cat.id)
        if (linked.length > 0) {
            const names = linked.map(a => a.title_fr || '(sans titre)').join(', ')
            setConfirm({
                message: `Êtes-vous sûr de vouloir supprimer "${cat.name_fr}" ? Cela supprimera les articles suivants : ${names}.`,
                onConfirm: () => {
                    deleteCategory(cat.id)
                    linked.forEach(a => deleteArticle(a.id))
                    reload()
                    setConfirm(null)
                },
            })
        } else {
            deleteCategory(cat.id)
            reload()
        }
    }

    const filtered = search.length >= 1
        ? categories.filter(c =>
            c.name_fr.toLowerCase().includes(search.toLowerCase()) ||
            c.name_en.toLowerCase().includes(search.toLowerCase())
        )
        : categories

    return (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal modal-categories" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Catégories</h2>

                <div className="cats-toolbar">
                    <button className="cats-new-link" onClick={handleNewCategory}>Nouvelle catégorie +</button>
                    <input
                        type="text"
                        className="cats-search"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <table className="cats-table">
                    <thead>
                        <tr>
                            <th>Nom FR</th>
                            <th>Nom EN</th>
                            <th>Articles</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(cat => (
                            <tr key={cat.id}>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={cat.name_fr}
                                        onBlur={e => handleBlur(cat.id, 'name_fr', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={cat.name_en}
                                        onBlur={e => handleBlur(cat.id, 'name_en', e.target.value)}
                                    />
                                </td>
                                <td>{articleCount(cat.id)}</td>
                                <td className="cats-actions">
                                    <button title="Archiver" onClick={() => handleArchive(cat)}>↓</button>
                                    <button title="Supprimer" onClick={() => handleDelete(cat)}>✕</button>
                                </td>
                            </tr>
                        ))}
                        {newRow && (
                            <tr className="cats-new-row">
                                <td>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Nom FR"
                                        value={newRow.name_fr}
                                        onChange={e => setNewRow(r => ({ ...r, name_fr: e.target.value }))}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Nom EN"
                                        value={newRow.name_en}
                                        onChange={e => setNewRow(r => ({ ...r, name_en: e.target.value }))}
                                    />
                                </td>
                                <td>0</td>
                                <td className="cats-actions">
                                    <button title="Valider" onClick={handleNewValidate}>✓</button>
                                    <button title="Annuler" onClick={() => { setNewRow(null); setError('') }}>✕</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {error && <p className="cats-error">{error}</p>}

                <div className="modal-footer">
                    <button className="btn-modal-confirm" onClick={onClose}>Valider</button>
                </div>

                {confirm && (
                    <ConfirmModal
                        message={confirm.message}
                        onConfirm={confirm.onConfirm}
                        onCancel={() => setConfirm(null)}
                    />
                )}
            </div>
        </div>
    )
}
