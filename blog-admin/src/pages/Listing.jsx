import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../lib/auth'
import { getArticles, getCategories, updateArticle, deleteArticle, createArticle } from '../lib/db'
import ConfirmModal from '../components/ConfirmModal'
import CategoriesModal from '../components/CategoriesModal'
import '../css/listing.css'

const STATUSES = ['publié', 'sauvegardé', 'archivé']
const PAGE_SIZE = 20

function formatDate(iso) {
    if (!iso) return '—'
    const d = new Date(iso)
    const p = n => String(n).padStart(2, '0')
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} à ${p(d.getHours())}h${p(d.getMinutes())}`
}

export default function Listing() {
    const navigate = useNavigate()
    const [articles, setArticles] = useState([])
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState([])
    const [statusOpen, setStatusOpen] = useState(false)
    const [sortField, setSortField] = useState(null)
    const [sortDir, setSortDir] = useState('asc')
    const [confirm, setConfirm] = useState(null)
    const [showCategories, setShowCategories] = useState(false)
    const [highlightId, setHighlightId] = useState(null)
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const sentinelRef = useRef(null)
    const statusRef = useRef(null)

    const reload = useCallback(() => {
        setArticles(getArticles())
        setCategories(getCategories())
    }, [])

    useEffect(() => { reload() }, [reload])

    useEffect(() => {
        if (!sentinelRef.current) return
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setVisibleCount(c => c + PAGE_SIZE)
        })
        obs.observe(sentinelRef.current)
        return () => obs.disconnect()
    }, [articles])

    useEffect(() => {
        function onMouseDown(e) {
            if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false)
        }
        document.addEventListener('mousedown', onMouseDown)
        return () => document.removeEventListener('mousedown', onMouseDown)
    }, [])

    function getCat(id) {
        return categories.find(c => c.id === id) || { name_fr: '—', name_en: '—' }
    }

    const totalPublished = articles.filter(a => a.status === 'publié').length
    const totalSaved = articles.filter(a => a.status === 'sauvegardé').length
    const totalArchived = articles.filter(a => a.status === 'archivé').length

    let filtered = statusFilter.length > 0
        ? articles.filter(a => statusFilter.includes(a.status))
        : articles

    if (search.length >= 3) {
        const q = search.toLowerCase()
        filtered = filtered.filter(a => {
            const cat = getCat(a.category_id)
            return (
                (a.title_fr || '').toLowerCase().includes(q) ||
                (a.title_en || '').toLowerCase().includes(q) ||
                cat.name_fr.toLowerCase().includes(q) ||
                cat.name_en.toLowerCase().includes(q) ||
                (a.tags_fr || []).some(t => t.toLowerCase().includes(q)) ||
                (a.tags_en || []).some(t => t.toLowerCase().includes(q)) ||
                a.status.toLowerCase().includes(q)
            )
        })
    }

    if (sortField) {
        filtered = [...filtered].sort((a, b) => {
            const va = sortField === 'title' ? (a.title_fr || '') : getCat(a.category_id).name_fr
            const vb = sortField === 'title' ? (b.title_fr || '') : getCat(b.category_id).name_fr
            return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
        })
    }

    function toggleSort(field) {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortField(field); setSortDir('asc') }
    }

    function sortIcon(field) {
        if (sortField !== field) return null
        return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
    }

    function handleDuplicate(article) {
        const { id: _id, slug_fr_history: _h1, slug_en_history: _h2, ...rest } = article
        const dup = createArticle({
            ...rest,
            title_fr: `${article.title_fr}-copy`,
            title_en: `${article.title_en}-copy`,
            slug_fr: `${article.slug_fr}-copy`,
            slug_en: `${article.slug_en}-copy`,
            status: 'sauvegardé',
            slug_fr_history: [],
            slug_en_history: [],
            published_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        reload()
        setHighlightId(dup.id)
        setTimeout(() => setHighlightId(null), 5000)
    }

    function handleArchive(article) {
        setConfirm({
            message: `Êtes-vous sûr de vouloir archiver "${article.title_fr || '(sans titre)'}" ?`,
            onConfirm: () => { updateArticle(article.id, { status: 'archivé' }); reload(); setConfirm(null) },
        })
    }

    function handleDelete(article) {
        setConfirm({
            message: `Êtes-vous sûr de vouloir supprimer "${article.title_fr || '(sans titre)'}" ?`,
            onConfirm: () => { deleteArticle(article.id); reload(); setConfirm(null) },
        })
    }

    const visible = filtered.slice(0, visibleCount)

    return (
        <div id="listing">
            <header className="listing-header">
                <a href="/" target="_blank" rel="noopener noreferrer" className="listing-site-link">
                    Aller sur le site ↗
                </a>
                <button className="listing-logout" onClick={() => { logout(); navigate('/') }}>
                    Déconnexion
                </button>
            </header>

            <div className="listing-hero">
                <h1 className="listing-title">Articles</h1>
                <div className="listing-hero-actions">
                    <button className="btn-primary" onClick={() => navigate('/builder')}>Article +</button>
                    <button className="btn-secondary" onClick={() => setShowCategories(true)}>Catégorie +</button>
                </div>
            </div>

            <div className="listing-summary">
                <span className="summary-total">{articles.length} articles —</span>
                <span className="summary-dot dot-published" title="Publié">● {totalPublished}</span>
                <span className="summary-dot dot-saved" title="Sauvegardé">● {totalSaved}</span>
                <span className="summary-dot dot-archived" title="Archivé">● {totalArchived}</span>
            </div>

            <div className="listing-toolbar">
                <div className="listing-search-wrap">
                    <input
                        type="text"
                        className="listing-search"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
                    />
                    {search.length >= 3 && (
                        <span className="search-count">{filtered.length} résultats trouvés</span>
                    )}
                </div>
            </div>

            {articles.length === 0 ? (
                <div className="listing-empty">
                    <p>Aucun article pour le moment</p>
                    <button className="btn-primary" onClick={() => navigate('/builder')}>Créer un article +</button>
                </div>
            ) : (
                <div className="listing-table-wrap">
                    <table className="listing-table">
                        <thead>
                            <tr>
                                <th>
                                    <button className="th-sort" onClick={() => toggleSort('title')}>
                                        Titre {sortIcon('title')}
                                    </button>
                                </th>
                                <th>
                                    <button className="th-sort" onClick={() => toggleSort('category')}>
                                        Catégorie {sortIcon('category')}
                                    </button>
                                    <button className="th-cats-btn" onClick={() => setShowCategories(true)} title="Gérer les catégories">⚙</button>
                                </th>
                                <th>Tags</th>
                                <th ref={statusRef}>
                                    <div className="th-status-wrap">
                                        <button className="th-sort" onClick={() => setStatusOpen(o => !o)}>
                                            Statut ▾
                                            {statusFilter.length > 0 && (
                                                <span className="filter-badge">{statusFilter.length}</span>
                                            )}
                                        </button>
                                        {statusOpen && (
                                            <div className="status-dropdown">
                                                {STATUSES.map(s => (
                                                    <label key={s} className="status-option">
                                                        <input
                                                            type="checkbox"
                                                            checked={statusFilter.includes(s)}
                                                            onChange={() => setStatusFilter(f =>
                                                                f.includes(s) ? f.filter(x => x !== s) : [...f, s]
                                                            )}
                                                        />
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>Création</th>
                                <th>Modification</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(article => {
                                const cat = getCat(article.category_id)
                                return (
                                    <tr
                                        key={article.id}
                                        className={highlightId === article.id ? 'row-highlighted' : ''}
                                        onMouseEnter={() => highlightId === article.id && setHighlightId(null)}
                                    >
                                        <td className="td-title">
                                            <a href={`/blog/${article.slug_fr}`} target="_blank" rel="noopener noreferrer">
                                                {article.title_fr || '(sans titre)'}
                                            </a>
                                        </td>
                                        <td className="td-category">
                                            <span className="cat-chip chip-fr">FR {cat.name_fr}</span>
                                            <span className="cat-chip chip-en">EN {cat.name_en}</span>
                                        </td>
                                        <td className="td-tags">
                                            <div className="tags-row">
                                                <span className="tags-lang-label">FR</span>
                                                <div className="tags-scroll">
                                                    {(article.tags_fr || []).map(t => (
                                                        <span key={t} className="tag-chip">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="tags-row">
                                                <span className="tags-lang-label">EN</span>
                                                <div className="tags-scroll">
                                                    {(article.tags_en || []).map(t => (
                                                        <span key={t} className="tag-chip">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${article.status}`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="td-date">{formatDate(article.created_at)}</td>
                                        <td className="td-date">{formatDate(article.updated_at)}</td>
                                        <td className="td-actions">
                                            <button title="Modifier" onClick={() => navigate(`/builder?id=${article.id}`)}>✎</button>
                                            <button title="Dupliquer" onClick={() => handleDuplicate(article)}>⧉</button>
                                            <button title="Archiver" onClick={() => handleArchive(article)}>↓</button>
                                            <button title="Supprimer" onClick={() => handleDelete(article)}>✕</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div ref={sentinelRef} style={{ height: 1 }} />
                </div>
            )}

            {confirm && (
                <ConfirmModal
                    message={confirm.message}
                    onConfirm={confirm.onConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}

            {showCategories && (
                <CategoriesModal onClose={() => { setShowCategories(false); reload() }} />
            )}
        </div>
    )
}
