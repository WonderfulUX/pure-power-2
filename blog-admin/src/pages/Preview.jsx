import { useParams } from 'react-router-dom'
import { getArticles, getCategories } from '../lib/db'
import '../css/preview.css'

export default function Preview() {
    const { '*': slugPath } = useParams()
    const articles = getArticles()
    const categories = getCategories()

    const article = articles.find(a => a.slug_fr === slugPath || a.slug_en === slugPath)

    if (!article) {
        return (
            <div id="preview">
                <div className="preview-banner">Aperçu</div>
                <p className="preview-not-found">Article non trouvé.</p>
            </div>
        )
    }

    const lang = article.slug_fr === slugPath ? 'fr' : 'en'
    const content = lang === 'fr' ? article.content_fr : article.content_en
    const title = lang === 'fr' ? article.title_fr : article.title_en
    const cat = categories.find(c => c.id === article.category_id)
    const catName = cat ? (lang === 'fr' ? cat.name_fr : cat.name_en) : ''

    return (
        <div id="preview">
            <div className="preview-banner">Aperçu — modifications non publiées</div>
            <article className="preview-article">
                {catName && <span className="preview-category">{catName}</span>}
                <h1 className="preview-title">{title}</h1>
                {content.intro && (
                    <div className="preview-intro" dangerouslySetInnerHTML={{ __html: content.intro }} />
                )}
                {content.sections.map(section => (
                    <section key={section.id} className="preview-section">
                        <h2>{section.title}</h2>
                        {section.subsections.map(sub => (
                            <div key={sub.id} className="preview-subsection">
                                {sub.title && <h3>{sub.title}</h3>}
                                {sub.paragraph && (
                                    <div dangerouslySetInnerHTML={{ __html: sub.paragraph }} />
                                )}
                            </div>
                        ))}
                    </section>
                ))}
            </article>
        </div>
    )
}
