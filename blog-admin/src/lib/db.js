function genId() {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function emptySection(index = 0) {
    return {
        id: genId(),
        title: `SECTION ${index + 1}`,
        subsections: [{ id: genId(), title: '', paragraph: '' }],
    }
}

export function emptyContent() {
    return { intro: null, sections: [emptySection(0)] }
}

const ARTICLES_KEY = 'pp_articles'
const CATEGORIES_KEY = 'pp_categories'
const TAGS_FR_KEY = 'pp_tags_fr'
const TAGS_EN_KEY = 'pp_tags_en'

export function getArticles() {
    return JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]')
}

function saveArticles(articles) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles))
}

export function getArticle(id) {
    return getArticles().find(a => a.id === id) || null
}

export function createArticle(data) {
    const articles = getArticles()
    const now = new Date().toISOString()
    const { id: _id, ...rest } = data || {}
    const article = {
        id: genId(),
        title_fr: '',
        title_en: '',
        slug_fr: '',
        slug_fr_history: [],
        slug_en: '',
        slug_en_history: [],
        category_id: null,
        tags_fr: [],
        tags_en: [],
        status: 'sauvegardé',
        content_fr: emptyContent(),
        content_en: emptyContent(),
        created_at: now,
        updated_at: now,
        published_at: null,
        ...rest,
    }
    articles.push(article)
    saveArticles(articles)
    return article
}

export function updateArticle(id, data) {
    const articles = getArticles()
    const idx = articles.findIndex(a => a.id === id)
    if (idx === -1) return null
    const { id: _id, created_at: _ca, ...rest } = data
    articles[idx] = { ...articles[idx], ...rest, updated_at: new Date().toISOString() }
    saveArticles(articles)
    return articles[idx]
}

export function deleteArticle(id) {
    saveArticles(getArticles().filter(a => a.id !== id))
    pruneGlobalTags()
}

export function getCategories() {
    return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]')
}

function saveCategories(cats) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats))
}

export function createCategory(data) {
    const cats = getCategories()
    const cat = { id: genId(), name_fr: '', name_en: '', status: 'active', ...data }
    cats.push(cat)
    saveCategories(cats)
    return cat
}

export function updateCategory(id, data) {
    const cats = getCategories()
    const idx = cats.findIndex(c => c.id === id)
    if (idx === -1) return null
    cats[idx] = { ...cats[idx], ...data }
    saveCategories(cats)
    return cats[idx]
}

export function deleteCategory(id) {
    saveCategories(getCategories().filter(c => c.id !== id))
}

export function getGlobalTags() {
    return {
        fr: JSON.parse(localStorage.getItem(TAGS_FR_KEY) || '[]'),
        en: JSON.parse(localStorage.getItem(TAGS_EN_KEY) || '[]'),
    }
}

export function addGlobalTag(lang, tag) {
    const key = lang === 'fr' ? TAGS_FR_KEY : TAGS_EN_KEY
    const tags = JSON.parse(localStorage.getItem(key) || '[]')
    if (!tags.includes(tag)) {
        tags.push(tag)
        localStorage.setItem(key, JSON.stringify(tags))
    }
}

export function pruneGlobalTags() {
    const articles = getArticles()
    const allFr = new Set(articles.flatMap(a => a.tags_fr || []))
    const allEn = new Set(articles.flatMap(a => a.tags_en || []))
    localStorage.setItem(TAGS_FR_KEY, JSON.stringify([...allFr]))
    localStorage.setItem(TAGS_EN_KEY, JSON.stringify([...allEn]))
}
