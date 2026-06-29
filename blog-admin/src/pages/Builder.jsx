import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    getArticle, createArticle, updateArticle, deleteArticle,
    getCategories, getGlobalTags, addGlobalTag, pruneGlobalTags,
    emptyContent, emptySection,
} from '../lib/db'
import { slugify } from '../lib/slugify'
import ConfirmModal from '../components/ConfirmModal'
import CategoriesModal from '../components/CategoriesModal'
import Toast from '../components/Toast'
import '../css/builder.css'

function genId() {
    return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function emptyArticle() {
    return {
        id: null,
        title_fr: '', title_en: '',
        slug_fr: '', slug_fr_history: [],
        slug_en: '', slug_en_history: [],
        category_id: null,
        tags_fr: [], tags_en: [],
        status: 'sauvegardé',
        content_fr: emptyContent(),
        content_en: emptyContent(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: null,
    }
}

function ContentEditable({ html, onChange, className, placeholder }) {
    const ref = useRef(null)
    const prevHtml = useRef(html)
    const isComposing = useRef(false)

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = html || ''
            prevHtml.current = html
        }
    }, [])

    useEffect(() => {
        if (
            ref.current &&
            html !== prevHtml.current &&
            document.activeElement !== ref.current
        ) {
            ref.current.innerHTML = html || ''
            prevHtml.current = html
        }
    })

    return (
        <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onCompositionStart={() => { isComposing.current = true }}
            onCompositionEnd={() => {
                isComposing.current = false
                onChange(ref.current.innerHTML)
                prevHtml.current = ref.current.innerHTML
            }}
            onInput={() => {
                if (!isComposing.current) {
                    prevHtml.current = ref.current.innerHTML
                    onChange(ref.current.innerHTML)
                }
            }}
            className={className}
            data-placeholder={placeholder}
        />
    )
}

function LinkPopover({ defaultText, defaultUrl, hasLink, onSave, onRemove, onClose }) {
    const [text, setText] = useState(defaultText || '')
    const [url, setUrl] = useState(defaultUrl || '')

    return (
        <div className="link-popover">
            <input
                autoFocus
                placeholder="Texte du lien"
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <input
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onSave(text, url) }}
            />
            <div className="link-popover-actions">
                <button onClick={() => onSave(text, url)}>Insérer</button>
                {hasLink && <button className="link-remove" onClick={onRemove}>Supprimer</button>}
                <button onClick={onClose}>Annuler</button>
            </div>
        </div>
    )
}

function RichEditable({ html, onChange, className }) {
    const ref = useRef(null)
    const prevHtml = useRef(html)
    const savedRange = useRef(null)
    const [linkPopover, setLinkPopover] = useState(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = html || ''
            prevHtml.current = html
        }
    }, [])

    useEffect(() => {
        if (
            ref.current &&
            html !== prevHtml.current &&
            document.activeElement !== ref.current
        ) {
            ref.current.innerHTML = html || ''
            prevHtml.current = html
        }
    })

    function saveSelection() {
        const sel = window.getSelection()
        if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange()
    }

    function restoreSelection() {
        if (!savedRange.current) return
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(savedRange.current)
    }

    function handleKeyDown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault()
            document.execCommand('bold')
            prevHtml.current = ref.current.innerHTML
            onChange(ref.current.innerHTML)
        }
    }

    function handleClick(e) {
        const link = e.target.closest('a')
        if (link) {
            e.preventDefault()
            saveSelection()
            setLinkPopover({ text: link.textContent, url: link.href, element: link })
        }
    }

    function openLinkPopover(e) {
        e.preventDefault()
        ref.current.focus()
        saveSelection()
        const sel = window.getSelection()
        setLinkPopover({ text: sel ? sel.toString() : '', url: '', element: null })
    }

    function handleLinkSave(text, url) {
        ref.current.focus()
        restoreSelection()
        if (linkPopover.element) {
            linkPopover.element.href = url
            if (text) linkPopover.element.textContent = text
        } else {
            if (savedRange.current && !savedRange.current.collapsed) {
                document.execCommand('createLink', false, url)
            } else {
                const a = document.createElement('a')
                a.href = url
                a.textContent = text || url
                if (savedRange.current) {
                    savedRange.current.deleteContents()
                    savedRange.current.insertNode(a)
                }
            }
        }
        prevHtml.current = ref.current.innerHTML
        onChange(ref.current.innerHTML)
        setLinkPopover(null)
    }

    function handleLinkRemove() {
        if (linkPopover.element) {
            const text = document.createTextNode(linkPopover.element.textContent)
            linkPopover.element.parentNode.replaceChild(text, linkPopover.element)
            prevHtml.current = ref.current.innerHTML
            onChange(ref.current.innerHTML)
        }
        setLinkPopover(null)
    }

    return (
        <div className="rich-wrap">
            <div className="rich-toolbar">
                <button
                    type="button"
                    title="Gras (Ctrl+B)"
                    onMouseDown={e => {
                        e.preventDefault()
                        ref.current.focus()
                        document.execCommand('bold')
                        prevHtml.current = ref.current.innerHTML
                        onChange(ref.current.innerHTML)
                    }}
                >
                    <strong>B</strong>
                </button>
                <button type="button" title="Insérer un lien" onMouseDown={openLinkPopover}>
                    Lien
                </button>
            </div>
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                    prevHtml.current = ref.current.innerHTML
                    onChange(ref.current.innerHTML)
                }}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                className={className}
            />
            {linkPopover && (
                <LinkPopover
                    defaultText={linkPopover.text}
                    defaultUrl={linkPopover.url}
                    hasLink={!!linkPopover.element}
                    onSave={handleLinkSave}
                    onRemove={handleLinkRemove}
                    onClose={() => setLinkPopover(null)}
                />
            )}
        </div>
    )
}

export default function Builder() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    const isNew = !articleId

    const [article, setArticle] = useState(null)
    const [lang, setLang] = useState('fr')
    const [categories, setCategories] = useState([])
    const [globalTags, setGlobalTags] = useState({ fr: [], en: [] })
    const [dirty, setDirty] = useState(false)
    const [savedUnpublished, setSavedUnpublished] = useState(false)
    const [toast, setToast] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [showCategories, setShowCategories] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const [tagSuggestions, setTagSuggestions] = useState([])

    const historyRef = useRef([])
    const histIdxRef = useRef(-1)
    const histTimer = useRef(null)

    useEffect(() => {
        setCategories(getCategories())
        setGlobalTags(getGlobalTags())
        const a = articleId ? getArticle(articleId) : emptyArticle()
        if (a) {
            setArticle(a)
            historyRef.current = [JSON.parse(JSON.stringify(a))]
            histIdxRef.current = 0
            setSavedUnpublished(!isNew && a.status === 'sauvegardé')
        }
    }, [articleId])

    useEffect(() => {
        function onKeyDown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                const activeTag = document.activeElement?.tagName
                if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') return
                e.preventDefault()
                if (histIdxRef.current > 0) {
                    histIdxRef.current -= 1
                    setArticle(JSON.parse(JSON.stringify(historyRef.current[histIdxRef.current])))
                    setDirty(true)
                }
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    function pushHistoryDebounced(snapshot) {
        if (histTimer.current) clearTimeout(histTimer.current)
        histTimer.current = setTimeout(() => {
            const sliced = historyRef.current.slice(0, histIdxRef.current + 1)
            sliced.push(JSON.parse(JSON.stringify(snapshot)))
            historyRef.current = sliced
            histIdxRef.current = sliced.length - 1
        }, 500)
    }

    function mutate(updater) {
        setArticle(prev => {
            const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
            pushHistoryDebounced(next)
            setDirty(true)
            return next
        })
    }

    function buildSlug(title, catId, langKey) {
        const cat = categories.find(c => c.id === catId)
        const catSlug = cat ? slugify(langKey === 'fr' ? cat.name_fr : cat.name_en) : ''
        const titleSlug = slugify(title)
        return catSlug ? `${catSlug}/${titleSlug}` : titleSlug
    }

    function updateTitle(value) {
        mutate(a => {
            const next = { ...a, [lang === 'fr' ? 'title_fr' : 'title_en']: value }
            if (!next.published_at) {
                if (lang === 'fr') next.slug_fr = buildSlug(value, next.category_id, 'fr')
                else next.slug_en = buildSlug(value, next.category_id, 'en')
            }
            return next
        })
    }

    function updateCategory(catId) {
        mutate(a => {
            const next = { ...a, category_id: catId || null }
            if (!next.published_at) {
                if (next.title_fr) next.slug_fr = buildSlug(next.title_fr, catId, 'fr')
                if (next.title_en) next.slug_en = buildSlug(next.title_en, catId, 'en')
            }
            return next
        })
    }

    function addTag(tag) {
        const field = lang === 'fr' ? 'tags_fr' : 'tags_en'
        if ((article[field] || []).includes(tag)) return
        addGlobalTag(lang, tag)
        mutate(a => ({ ...a, [field]: [...(a[field] || []), tag] }))
        setTagInput('')
        setTagSuggestions([])
    }

    function removeTag(tag) {
        const field = lang === 'fr' ? 'tags_fr' : 'tags_en'
        mutate(a => ({ ...a, [field]: (a[field] || []).filter(t => t !== tag) }))
    }

    function handleTagInput(e) {
        const val = e.target.value
        setTagInput(val)
        if (val.length >= 2) {
            const pool = lang === 'fr' ? globalTags.fr : globalTags.en
            const used = article ? (lang === 'fr' ? article.tags_fr : article.tags_en) || [] : []
            setTagSuggestions(pool.filter(t => t.toLowerCase().includes(val.toLowerCase()) && !used.includes(t)))
        } else {
            setTagSuggestions([])
        }
    }

    const contentField = lang === 'fr' ? 'content_fr' : 'content_en'

    function setContent(updater) {
        mutate(a => ({
            ...a,
            [contentField]: typeof updater === 'function' ? updater(a[contentField]) : updater,
        }))
    }

    function doSave(overrides = {}) {
        if (!article.title_fr) {
            setToast('Le titre FR est requis.')
            return null
        }
        const toSave = { ...article, ...overrides }
        let saved
        if (toSave.id) {
            saved = updateArticle(toSave.id, toSave)
        } else {
            saved = createArticle(toSave)
            setArticle(saved)
            navigate(`/builder?id=${saved.id}`, { replace: true })
        }
        setDirty(false)
        setSavedUnpublished((saved || toSave).status !== 'publié')
        return saved || toSave
    }

    function handleSave() {
        const saved = doSave()
        if (saved) setToast('Article sauvegardé. Cliquez sur Sauvegarder et Publier pour mettre les changements en ligne.')
    }

    function handlePublish() {
        const publish = () => {
            const saved = doSave({
                status: 'publié',
                published_at: article.published_at || new Date().toISOString(),
            })
            if (saved) {
                setArticle(a => ({ ...a, status: 'publié', published_at: saved.published_at }))
                setSavedUnpublished(false)
            }
        }
        if (!dirty && article.id) {
            setConfirm({
                message: "Aucune modification n'a été effectuée. Êtes-vous sûr de vouloir publier cet article ?",
                onConfirm: () => { publish(); setConfirm(null) },
            })
        } else {
            publish()
        }
    }

    function handleArchive() {
        setConfirm({
            message: `Êtes-vous sûr de vouloir archiver "${article.title_fr || '(sans titre)'}" ?`,
            onConfirm: () => {
                updateArticle(article.id, { status: 'archivé' })
                setArticle(a => ({ ...a, status: 'archivé' }))
                setConfirm(null)
            },
        })
    }

    function handleDelete() {
        setConfirm({
            message: `Êtes-vous sûr de vouloir supprimer "${article.title_fr || '(sans titre)'}" ?`,
            onConfirm: () => {
                deleteArticle(article.id)
                pruneGlobalTags()
                navigate('/listing')
                setConfirm(null)
            },
        })
    }

    function handleBack() {
        if (dirty) {
            setConfirm({
                message: 'Vos modifications non sauvegardées seront perdues. Continuer ?',
                onConfirm: () => navigate('/listing'),
            })
        } else if (savedUnpublished) {
            setConfirm({
                message: "Vos modifications sont sauvegardées mais ne sont pas encore publiées. Cliquez sur Sauvegarder et Publier pour les mettre en ligne.",
                confirmLabel: 'Retour au listing quand même',
                onConfirm: () => navigate('/listing'),
            })
        } else {
            navigate('/listing')
        }
    }

    function handlePreview() {
        const saved = doSave()
        if (!saved) return
        const slug = lang === 'fr' ? saved.slug_fr : saved.slug_en
        if (slug) window.open(`/blog-admin/builder/preview/${slug}`, '_blank')
    }

    if (!article) return null

    const content = article[contentField]
    const tags = lang === 'fr' ? (article.tags_fr || []) : (article.tags_en || [])
    const slug = lang === 'fr' ? article.slug_fr : article.slug_en
    const titleValue = lang === 'fr' ? article.title_fr : article.title_en

    return (
        <div id="builder">
            <div className="builder-topbar">
                <button className="builder-back" onClick={handleBack}>←</button>
                <div className="builder-actions">
                    {!isNew && article.id && (
                        <>
                            <button className="btn-delete" onClick={handleDelete}>Supprimer</button>
                            <button className="btn-archive" onClick={handleArchive}>Archiver</button>
                        </>
                    )}
                    <button
                        className="btn-save"
                        onClick={handleSave}
                        style={{ opacity: dirty ? 1 : 0.2, pointerEvents: dirty ? 'auto' : 'none' }}
                    >
                        Sauvegarder
                    </button>
                    <button className="btn-preview" onClick={handlePreview}>Aperçu</button>
                    <button className="btn-publish" onClick={handlePublish}>Sauvegarder et Publier</button>
                </div>
            </div>

            <div className="builder-layout">
                <aside className="builder-meta">
                    <div className="lang-toggle">
                        <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>FR</button>
                        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
                    </div>

                    <label className="meta-field">
                        <span>Titre</span>
                        <input
                            type="text"
                            value={titleValue}
                            onChange={e => updateTitle(e.target.value)}
                            placeholder="Titre de l'article"
                        />
                    </label>

                    <div className="meta-field">
                        <span>Catégorie</span>
                        <select value={article.category_id || ''} onChange={e => updateCategory(e.target.value)}>
                            <option value="">— Sélectionner —</option>
                            {categories.filter(c => c.status === 'active').map(c => (
                                <option key={c.id} value={c.id}>{c.name_fr}</option>
                            ))}
                        </select>
                        <button className="meta-new-cat" onClick={() => setShowCategories(true)}>
                            Nouvelle catégorie +
                        </button>
                    </div>

                    <div className="meta-field">
                        <span>Tags</span>
                        <div className="meta-tags">
                            {tags.map(tag => (
                                <span key={tag} className="tag-pill">
                                    {tag}
                                    <button onClick={() => removeTag(tag)}>×</button>
                                </span>
                            ))}
                            <div className="tag-input-wrap">
                                <input
                                    type="text"
                                    placeholder="Nouveau tag +"
                                    value={tagInput}
                                    onChange={handleTagInput}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && tagInput.trim()) {
                                            e.preventDefault()
                                            addTag(tagInput.trim())
                                        }
                                    }}
                                />
                                {tagSuggestions.length > 0 && (
                                    <ul className="tag-suggestions">
                                        {tagSuggestions.map(s => (
                                            <li key={s} onClick={() => addTag(s)}>{s}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="meta-field">
                        <span>Slug</span>
                        <div className="meta-slug">/{slug || '—'}</div>
                    </div>
                </aside>

                <main className="builder-content">
                    {content.intro !== null ? (
                        <div className="block-intro">
                            <div className="block-actions">
                                <button onClick={() => setContent(c => ({ ...c, intro: null }))}>
                                    ✕ Supprimer l'intro
                                </button>
                            </div>
                            <ContentEditable
                                html={content.intro}
                                onChange={val => setContent(c => ({ ...c, intro: val }))}
                                className="intro-editable"
                                placeholder="Texte d'introduction..."
                            />
                        </div>
                    ) : (
                        <button className="add-intro-btn" onClick={() => setContent(c => ({ ...c, intro: '' }))}>
                            + Ajouter un bloc d'introduction
                        </button>
                    )}

                    {content.sections.map((section, sIdx) => (
                        <div key={section.id} className="block-section">
                            <div className="section-head">
                                <ContentEditable
                                    html={section.title}
                                    onChange={val => setContent(c => ({
                                        ...c,
                                        sections: c.sections.map(s =>
                                            s.id === section.id ? { ...s, title: val } : s
                                        ),
                                    }))}
                                    className="section-title-editable"
                                />
                                <div className="block-actions">
                                    <button title="Dupliquer" onClick={() => setContent(c => {
                                        const copy = JSON.parse(JSON.stringify(section))
                                        copy.id = genId()
                                        copy.subsections = copy.subsections.map(sub => ({ ...sub, id: genId() }))
                                        const secs = [...c.sections]
                                        secs.splice(sIdx + 1, 0, copy)
                                        return { ...c, sections: secs }
                                    })}>⧉</button>
                                    {content.sections.length > 1 && (
                                        <button title="Supprimer" onClick={() => setContent(c => ({
                                            ...c,
                                            sections: c.sections.filter(s => s.id !== section.id),
                                        }))}>✕</button>
                                    )}
                                </div>
                            </div>

                            {section.subsections.map((sub, subIdx) => (
                                <div key={sub.id} className="block-subsection">
                                    <div className="block-actions">
                                        <button title="Dupliquer" onClick={() => setContent(c => ({
                                            ...c,
                                            sections: c.sections.map(s => {
                                                if (s.id !== section.id) return s
                                                const copy = { ...JSON.parse(JSON.stringify(sub)), id: genId() }
                                                const subs = [...s.subsections]
                                                subs.splice(subIdx + 1, 0, copy)
                                                return { ...s, subsections: subs }
                                            }),
                                        }))}>⧉</button>
                                        {section.subsections.length > 1 && (
                                            <button title="Supprimer" onClick={() => setContent(c => ({
                                                ...c,
                                                sections: c.sections.map(s =>
                                                    s.id === section.id
                                                        ? { ...s, subsections: s.subsections.filter(sb => sb.id !== sub.id) }
                                                        : s
                                                ),
                                            }))}>✕</button>
                                        )}
                                    </div>
                                    <ContentEditable
                                        html={sub.title}
                                        onChange={val => setContent(c => ({
                                            ...c,
                                            sections: c.sections.map(s =>
                                                s.id === section.id
                                                    ? { ...s, subsections: s.subsections.map(sb => sb.id === sub.id ? { ...sb, title: val } : sb) }
                                                    : s
                                            ),
                                        }))}
                                        className="subsection-title-editable"
                                        placeholder="Titre de la sous-section..."
                                    />
                                    <RichEditable
                                        html={sub.paragraph}
                                        onChange={val => setContent(c => ({
                                            ...c,
                                            sections: c.sections.map(s =>
                                                s.id === section.id
                                                    ? { ...s, subsections: s.subsections.map(sb => sb.id === sub.id ? { ...sb, paragraph: val } : sb) }
                                                    : s
                                            ),
                                        }))}
                                        className="subsection-paragraph-editable"
                                    />
                                </div>
                            ))}

                            <button className="add-subsection-btn" onClick={() => setContent(c => ({
                                ...c,
                                sections: c.sections.map(s =>
                                    s.id === section.id
                                        ? { ...s, subsections: [...s.subsections, { id: genId(), title: '', paragraph: '' }] }
                                        : s
                                ),
                            }))}>+ Nouveau bloc de texte</button>
                        </div>
                    ))}

                    <button className="add-section-btn" onClick={() => setContent(c => ({
                        ...c,
                        sections: [...c.sections, emptySection(c.sections.length)],
                    }))}>+ Nouvelle section</button>
                </main>
            </div>

            {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

            {confirm && (
                <ConfirmModal
                    message={confirm.message}
                    confirmLabel={confirm.confirmLabel}
                    onConfirm={confirm.onConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}

            {showCategories && (
                <CategoriesModal onClose={() => { setShowCategories(false); setCategories(getCategories()) }} />
            )}
        </div>
    )
}
