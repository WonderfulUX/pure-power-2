import { moveElementsAntiClockwise, moveElementsClockwise } from "./modules/3Drotate.js";
import { PRODUCTS_FR, PRODUCTS_EN } from "./data.js";

const lang = document.documentElement.lang;

const PRODUCTS = lang === 'fr' ? PRODUCTS_FR : PRODUCTS_EN;

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackdrop = document.querySelector('#mobile-nav-backdrop');
    const menuClose = document.querySelector('.mobile-menu-close');

    if (!menuToggle || !mobileMenu) return;

    function openMenu() {
        mobileMenuBackdrop.setAttribute('aria-hidden', 'false')
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
        }, 200)
    }

    function closeMenu() {
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            mobileMenuBackdrop.setAttribute('aria-hidden', 'true')
            document.body.style.overflow = '';
        }, 200)
    }

    menuToggle.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);
    mobileMenuBackdrop.addEventListener('click', (e) => {
        e.target.id === "mobile-nav-backdrop" && closeMenu()
    })

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function initLanguageDropdown() {
    const langToggle = document.querySelector('.header-language-toggle');
    if (!langToggle) return;

    langToggle.addEventListener('click', () => {
        const expanded = langToggle.getAttribute('aria-expanded') === 'true';
        langToggle.setAttribute('aria-expanded', String(!expanded));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-language')) {
            langToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initLanguageSwitcher() {
    document.querySelectorAll('a[hreflang]').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.setItem('pp-lang', link.getAttribute('hreflang'));
        });
    });
}

function initContactModal() {
    const t = lang === 'fr'
        ? { title: 'Contact', intro: 'Une question ? clients ou revendeurs, nous vous répondrons rapidement.', closeLabel: 'Fermer', legend: 'Type de demande', customer: 'Particulier', business: 'Professionnel', firstName: 'Prénom', lastName: 'Nom', email: 'Email', message: 'Message', submit: 'Envoyer', company: 'Nom de l\'entreprise' }
        : { title: 'Contact', intro: "Have a question? Whether you're a customer or a retailer, we'll get back to you shortly.", closeLabel: 'Close', legend: 'Type of request', customer: 'Individual', business: 'Professional', firstName: 'First name', lastName: 'Last name', email: 'Email', message: 'Message', submit: 'Send', company: 'Company name' };

    const modal = document.createElement('div');
    modal.id = 'contact-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="contact-modal-panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
            <button class="contact-modal-close" aria-label="${t.closeLabel}">
                <svg width="20" height="20" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.0018 0.87684C28.5876 0.291053 29.5371 0.291053 30.1229 0.87684C30.7087 1.46263 30.7087 2.41215 30.1229 2.99793L17.621 15.4999L30.1229 28.0018C30.7087 28.5876 30.7087 29.5371 30.1229 30.1229C29.5371 30.7087 28.5876 30.7087 28.0018 30.1229L15.4999 17.621L2.99793 30.1229C2.41215 30.7087 1.46263 30.7087 0.87684 30.1229C0.291053 29.5371 0.291053 28.5876 0.87684 28.0018L13.3788 15.4999L0.87684 2.99793C0.291053 2.41215 0.291053 1.46263 0.87684 0.87684C1.46263 0.291053 2.41215 0.291053 2.99793 0.87684L15.4999 13.3788L28.0018 0.87684Z"/></svg>
            </button>
            <h2 id="contact-modal-title" class="section-title">${t.title}</h2>
            <p id="contact-modal-message" class="section-title">${t.intro}</p>
            <form class="contact-form" novalidate>
                <fieldset class="contact-type">
                    <legend class="visually-hidden">${t.legend}</legend>
                    <label><input type="radio" name="query-type" value="customer"> ${t.customer}</label>
                    <label><input type="radio" name="query-type" value="business"> ${t.business}</label>
                </fieldset>
                <div class="contact-fields">
                    <label class="field"><span>${t.firstName}</span><input type="text" name="firstName" autocomplete="given-name"></label>
                    <label class="field"><span>${t.lastName}</span><input type="text" name="lastName" autocomplete="family-name"></label>
                    <label class="field field-full"><span>${t.email}</span><input type="email" name="email" autocomplete="email"></label>
                    <label class="field field-full"><span>${t.message}</span><textarea name="message" rows="5"></textarea></label>
                </div>
                <button type="submit" class="contact-submit">${t.submit}</button>
            </form>
        </div>`;
    document.body.appendChild(modal);

    const backdrop = modal.querySelector('.contact-modal-backdrop');
    const closeBtn = modal.querySelector('.contact-modal-close');
    const fields = modal.querySelector('.contact-fields');

    const open = () => {
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const close = (e) => {
        if (e.target.classList.contains('is-open') ||
            e.target.closest('.contact-modal-close')) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    // backdrop.addEventListener('click', close);
    modal.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    document.querySelectorAll('a[href*="#contact"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            open();
        });
    });

    window.addEventListener('resize', () => {
        document.querySelector("#powderDetergents .products-grid").style.translate = '0px 0px'
        deActivateButton(slideLeft)
        activateButton(slideRight)
    })

    const radios = modal.querySelectorAll('input[name="query-type"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const existing = fields.querySelector('.field-company');
            if (radio.value === 'business') {
                if (!existing) {
                    const label = document.createElement('label');
                    label.className = 'field field-full field-company';
                    label.innerHTML = `<span>${t.company}</span><input type="text" name="company" autocomplete="organization">`;
                    fields.prepend(label);
                }
            } else {
                existing?.remove();
            }
        });
    });
}

function initProductsPage() {
    const panel = document.getElementById('products-panel');
    if (!panel) return;

    const hint = panel.querySelector('.products-hint');
    if (hint) {
        const dismiss = () => hint.remove();
        hint.querySelector('.products-hint-close')?.addEventListener('click', (e) => {
            e.stopPropagation();
            dismiss();
        });
        hint.addEventListener('click', dismiss);
    }

    const categoryTabs = panel.querySelectorAll('.category-tab');
    const categoryCount = panel.querySelector('#category-products-count');
    const thumbsContainer = panel.querySelector('.product-list-scrollable-ctn');
    const previewContainer = panel.querySelector('.products-preview');
    const detailName = panel.querySelector('.product-name');
    const detailBadge = panel.querySelector('.product-badge');
    const detailFeatures = panel.querySelector('.product-features');
    const tabs = panel.querySelectorAll('.product-tab');
    const tabPanels = panel.querySelectorAll('.product-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            tabPanels.forEach(p => {
                p.hidden = p.dataset.tab !== tab.dataset.tab;
            });
        });
    });

    function renderProduct(product) {
        if (previewContainer) {
            const image = document.createElement('div');
            image.className = 'product-image';
            image.innerHTML = `<img src="${product.image}" alt="${product.name}" loading="lazy">`;
            const existing = previewContainer.querySelector('.product-image');
            if (existing) existing.replaceWith(image);
            else previewContainer.appendChild(image);
        }

        if (detailName) detailName.textContent = product.name;

        if (detailBadge) {
            if (product.badge) {
                detailBadge.innerHTML = product.badge.map(line => `<span>${line}</span>`).join('');
                detailBadge.classList.toggle('badge-pill', product.badgeShape === 'pill');
                detailBadge.hidden = false;
            } else {
                detailBadge.innerHTML = '';
                detailBadge.classList.remove('badge-pill');
                detailBadge.hidden = true;
            }
        }

        if (detailFeatures) {
            detailFeatures.innerHTML = product.features
                .map(f => `<li>${f}</li>`)
                .join('');
        }

        tabPanels.forEach(p => {
            if (p.dataset.tab === 'description') p.textContent = product.description;
            if (p.dataset.tab === 'composition') {
                p.textContent = product.composition;
                const detailPageHref = product.category === 'liquid'
                    ? './descriptif-complet-liquides.html'
                    : './descriptif-complet-poudres.html';
                const detailLink = document.createElement('a');
                detailLink.href = detailPageHref;
                detailLink.textContent = lang === 'fr' ? 'Voir la description détaillée' : 'See the full description';
                p.append(' ', detailLink);
            }
        });
    }

    function selectThumb(thumb) {
        thumbsContainer.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    }

    function renderThumbs(category) {
        if (!thumbsContainer) return;

        const items = PRODUCTS.filter(p => p.category === category);

        if (categoryCount) {
            categoryCount.textContent = lang === 'fr'
                ? `${items.length} produit${items.length > 1 ? 's' : ''}`
                : `${items.length} product${items.length > 1 ? 's' : ''}`;
        }

        thumbsContainer.innerHTML = items
            .map(p => `<button class="product-thumb" data-product="${p.id}" role="listitem" aria-label="${p.name}"><img src="${p.image}" loading="lazy" alt="${p.name}"></button>`)
            .join('');

        thumbsContainer.querySelectorAll('.product-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                selectThumb(thumb);
                const product = PRODUCTS.find(p => p.id === thumb.dataset.product);
                if (product) renderProduct(product);
            });
        });

        const first = thumbsContainer.querySelector('.product-thumb');
        if (first) {
            selectThumb(first);
            const product = PRODUCTS.find(p => p.id === first.dataset.product);
            if (product) renderProduct(product);
        }
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            renderThumbs(tab.dataset.category);
        });
    });

    const initialCategory = panel.querySelector('.category-tab.active')?.dataset.category || PRODUCTS[0]?.category;
    renderThumbs(initialCategory);
}

function initTickers() {
    const AVAILABILITY_ITEMS_EN = [
        { flag: '../assets/svg/guadeloupe.svg', name: 'Guadeloupe' },
        { flag: '../assets/svg/martinique.svg', name: 'Martinique' },
        { flag: '../assets/svg/guyane.svg', name: 'Guyane' },
        { flag: '../assets/svg/new-caledonia.svg', name: 'New-Caledonia' }
    ];

    const AVAILABILITY_ITEMS_FR = [
        { flag: './assets/svg/guadeloupe.svg', name: 'Guadeloupe' },
        { flag: './assets/svg/martinique.svg', name: 'Martinique' },
        { flag: './assets/svg/guyane.svg', name: 'Guyane' },
        { flag: './assets/svg/new-caledonia.svg', name: 'Nouvelle-Calédonie' }
    ];

    const AVAILABILITY_ITEMS = lang === 'fr' ? AVAILABILITY_ITEMS_FR : AVAILABILITY_ITEMS_EN;
    const REPEAT = 6;

    document.querySelectorAll('[data-ticker="availability"]').forEach(track => {
        const items = Array.from({ length: REPEAT }, () =>
            AVAILABILITY_ITEMS.map(item =>
                `<span class="ticker-item">
                    <span>${item.name}</span>
                    <img src="${item.flag}" alt="">
                </span>`
            ).join('')
        ).join('');
        track.innerHTML = items;
    });
}

initMobileMenu();
initLanguageDropdown();
initLanguageSwitcher();
initContactModal();
initProductsPage();
initTickers();


document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.clockwise-trig').forEach(trigger => {
        trigger.addEventListener('click', moveElementsClockwise)
    })
    document.querySelectorAll('.anti-clockwise-trig').forEach(trigger => {
        trigger.addEventListener('click', moveElementsAntiClockwise)
    })
})

let commentsWidth = document.querySelector('.comments-grid').getBoundingClientRect().width
const duration = document.querySelectorAll('.comment-card').length
console.log(commentsWidth)

document.querySelector('.comments-grid').animate(
    [{ translate: "0 0 " }, { translate: `-${commentsWidth / 2}px 0` }],
    { duration: duration * 6000, easing: "linear", iterations: "Infinity" }
)


slideRight.addEventListener('click', () => {
    const translateXvalue = getTranslationValue()
    document.querySelector('#powderDetergents .products-grid').style.translate = `-${translateXvalue}px 0px`
    deActivateButton(slideRight)
    activateButton(slideLeft)
})
slideLeft.addEventListener('click', () => {
    const translateXvalue = getTranslationValue()
    document.querySelector('#powderDetergents .products-grid').style.translate = `0 0`
    deActivateButton(slideLeft)
    activateButton(slideRight)
})

function getTranslationValue() {
    const grid = document.querySelector('#powderDetergents .products-grid')
    return Math.abs(grid.getBoundingClientRect().width - innerWidth)
}

function activateButton(btnId) {
    btnId.removeAttribute('disabled')
    btnId.setAttribute('aria-disabled', false)
}
function deActivateButton(btnId) {
    btnId.disabled = true
    btnId.setAttribute('aria-disabled', true)
}
