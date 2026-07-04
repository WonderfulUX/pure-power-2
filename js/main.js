const lang = document.documentElement.lang;

const PRODUCTS_EN = [
    {
        id: 'iconic-4kg',
        name: 'Pure Power 4KG',
        image: {
            webp: { desktop: '../assets/img/webp/4k-product-desktop.webp', tablet: '../assets/img/webp/4k-product-tablet.webp', mobile: '../assets/img/webp/4k-product-mobile.webp' },
            png: { desktop: '../assets/img/png/4k-product-desktop.png', tablet: '../assets/img/png/4k-product-tablet.png', mobile: '../assets/img/png/4k-product-mobile.png' }
        },
        badge: 'Best seller',
        features: [
            'Most economical choice',
            'Maximum concentration',
            'Long-lasting fragrance'
        ],
        description: 'Loved by families for its unbeatable value and maximum concentration.',
        composition: 'Sodium carbonate, sodium percarbonate, enzymes, optical brighteners, fragrance.'
    },
    {
        id: 'compact-2kg',
        name: 'Pure Power 2KG',
        image: {
            webp: { desktop: '../assets/img/webp/2kg-product-desktop.webp', tablet: '../assets/img/webp/2kg-product-tablet.webp', mobile: '../assets/img/webp/2kg-product-mobile.webp' },
            png: { desktop: '../assets/img/png/2kg-product-desktop.png', tablet: '../assets/img/png/2kg-product-tablet.png', mobile: '../assets/img/png/2kg-product-mobile.png' }
        },
        badge: null,
        features: [
            'Compact format',
            'Maximum concentration',
            'Long-lasting fragrance'
        ],
        description: 'The ideal compact format for smaller households without sacrificing performance.',
        composition: 'Sodium carbonate, sodium percarbonate, enzymes, optical brighteners, fragrance.'
    },
    {
        id: 'family-5kg',
        name: 'Pure Power 5KG',
        image: {
            webp: { desktop: '../assets/img/webp/5kg-product-desktop.webp', tablet: '../assets/img/webp/5kg-product-tablet.webp', mobile: '../assets/img/webp/5kg-product-mobile.webp' },
            png: { desktop: '../assets/img/png/5kg-product-desktop.png', tablet: '../assets/img/png/5kg-product-tablet.png', mobile: '../assets/img/png/5kg-product-mobile.png' }
        },
        badge: null,
        features: [
            'Family format',
            'Maximum concentration',
            'Long-lasting fragrance'
        ],
        description: 'The family-sized format designed for larger households and frequent use.',
        composition: 'Sodium carbonate, sodium percarbonate, enzymes, optical brighteners, fragrance.'
    },
    {
        id: 'pro-format-6kg',
        name: 'Pure Power 6KG',
        image: {
            webp: { desktop: '../assets/img/webp/6kg-desktop-product.webp', tablet: '../assets/img/webp/6kg-tablet-product.webp', mobile: '../assets/img/webp/6kg-mobile-product.webp' },
            png: { desktop: '../assets/img/png/6kg-desktop.png', tablet: '../assets/img/png/6kg-tablet.png', mobile: '../assets/img/png/6kg-mobile.png' }
        },
        badge: null,
        features: [
            'Professional format',
            'Maximum concentration',
            'Long-lasting fragrance'
        ],
        description: 'The professional format for intensive and high-volume use.',
        composition: 'Sodium carbonate, sodium percarbonate, enzymes, optical brighteners, fragrance.'
    },
    {
        id: 'liquid-5kg',
        name: 'Pure Power Liquid 5KG',
        image: {
            webp: { desktop: '../assets/img/webp/5k-liquid-product-desktop.webp', tablet: '../assets/img/webp/5k-liquid-product-tablet.webp', mobile: '../assets/img/webp/5k-liquid-product-mobile.webp' },
            png: { desktop: '../assets/img/png/5k-liquid-product-desktop.png', tablet: '../assets/img/png/5k-liquid-product-tablet.png', mobile: '../assets/img/png/5k-liquid-product-mobile.png' }
        },
        badge: null,
        features: [
            '100% hypoallergenic',
            'Suitable for delicate fabrics',
            'Long-lasting fragrance'
        ],
        description: 'The liquid formula crafted for delicate fabrics and sensitive skin.',
        composition: 'Aqua, anionic surfactants, non-ionic surfactants, enzymes, fragrance, preservatives.'
    }
];

const PRODUCTS_FR = [
    {
        id: 'iconic-4kg',
        name: 'Pure Power 4KG',
        image: {
            webp: { desktop: './assets/img/webp/4k-product-desktop.webp', tablet: './assets/img/webp/4k-product-tablet.webp', mobile: './assets/img/webp/4k-product-mobile.webp' },
            png: { desktop: './assets/img/png/4k-product-desktop.png', tablet: './assets/img/png/4k-product-tablet.png', mobile: './assets/img/png/4k-product-mobile.png' }
        },
        badge: 'Best seller',
        features: [
            'Choix le plus économique',
            'Concentration maximale',
            'Parfum longue durée'
        ],
        description: 'Adoré des familles pour son rapport qualité-prix imbattable et sa concentration maximale.',
        composition: 'Carbonate de sodium, percarbonate de sodium, enzymes, azurants optiques, parfum.'
    },
    {
        id: 'compact-2kg',
        name: 'Pure Power 2KG',
        image: {
            webp: { desktop: './assets/img/webp/2kg-product-desktop.webp', tablet: './assets/img/webp/2kg-product-tablet.webp', mobile: './assets/img/webp/2kg-product-mobile.webp' },
            png: { desktop: './assets/img/png/2kg-product-desktop.png', tablet: './assets/img/png/2kg-product-tablet.png', mobile: './assets/img/png/2kg-product-mobile.png' }
        },
        badge: null,
        features: [
            'Format compact',
            'Concentration maximale',
            'Parfum longue durée'
        ],
        description: 'Le format compact idéal pour les petits foyers sans compromis sur les performances.',
        composition: 'Carbonate de sodium, percarbonate de sodium, enzymes, azurants optiques, parfum.'
    },
    {
        id: 'family-5kg',
        name: 'Pure Power 5KG',
        image: {
            webp: { desktop: './assets/img/webp/5kg-product-desktop.webp', tablet: './assets/img/webp/5kg-product-tablet.webp', mobile: './assets/img/webp/5kg-product-mobile.webp' },
            png: { desktop: './assets/img/png/5kg-product-desktop.png', tablet: './assets/img/png/5kg-product-tablet.png', mobile: './assets/img/png/5kg-product-mobile.png' }
        },
        badge: null,
        features: [
            'Format familial',
            'Concentration maximale',
            'Parfum longue durée'
        ],
        description: 'Le format familial conçu pour les grands foyers et une utilisation fréquente.',
        composition: 'Carbonate de sodium, percarbonate de sodium, enzymes, azurants optiques, parfum.'
    },
    {
        id: 'pro-format-6kg',
        name: 'Pure Power 6KG',
        image: {
            webp: { desktop: './assets/img/webp/6kg-desktop-product.webp', tablet: './assets/img/webp/6kg-tablet-product.webp', mobile: './assets/img/webp/6kg-mobile-product.webp' },
            png: { desktop: './assets/img/png/6kg-desktop.png', tablet: './assets/img/png/6kg-tablet.png', mobile: './assets/img/png/6kg-mobile.png' }
        },
        badge: null,
        features: [
            'Format professionnel',
            'Concentration maximale',
            'Parfum longue durée'
        ],
        description: 'Le format professionnel pour une utilisation intensive et à haut volume.',
        composition: 'Carbonate de sodium, percarbonate de sodium, enzymes, azurants optiques, parfum.'
    },
    {
        id: 'liquid-5kg',
        name: 'Pure Power 5KG liquide',
        image: {
            webp: { desktop: './assets/img/webp/5k-liquid-product-desktop.webp', tablet: './assets/img/webp/5k-liquid-product-tablet.webp', mobile: './assets/img/webp/5k-liquid-product-mobile.webp' },
            png: { desktop: './assets/img/png/5k-liquid-product-desktop.png', tablet: './assets/img/png/5k-liquid-product-tablet.png', mobile: './assets/img/png/5k-liquid-product-mobile.png' }
        },
        badge: null,
        features: [
            '100% hypoallergénique',
            'Adapté aux tissus délicats',
            'Parfum longue durée'
        ],
        description: 'La formule liquide conçue pour les tissus délicats et les peaux sensibles.',
        composition: 'Aqua, tensioactifs anioniques, tensioactifs non ioniques, enzymes, parfum, conservateurs.'
    }
];

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

    const thumbs = panel.querySelectorAll('.product-thumb');
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
            const picture = document.createElement('picture');
            picture.className = 'product-image';
            picture.innerHTML =
                `<source media="(min-width: 1000px)" srcset="${product.image.webp.desktop}" type="image/webp">` +
                `<source media="(min-width: 1000px)" srcset="${product.image.png.desktop}">` +
                `<source media="(min-width: 575px)" srcset="${product.image.webp.tablet}" type="image/webp">` +
                `<source media="(min-width: 575px)" srcset="${product.image.png.tablet}">` +
                `<source srcset="${product.image.webp.mobile}" type="image/webp">` +
                `<img src="${product.image.png.mobile}" alt="${product.name}" loading="lazy">`;
            const existing = previewContainer.querySelector('.product-image');
            if (existing) existing.replaceWith(picture);
            else previewContainer.appendChild(picture);
        }

        if (detailName) detailName.textContent = product.name;

        if (detailBadge) {
            if (product.badge) {
                detailBadge.textContent = product.badge;
                detailBadge.hidden = false;
            } else {
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
            if (p.dataset.tab === 'composition') p.textContent = product.composition;
        });
    }

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const product = PRODUCTS.find(p => p.id === thumb.dataset.product);
            if (product) renderProduct(product);
        });
    });

    thumbs[0]?.click();
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


document.querySelector('.powders-grid').addEventListener('click', moveElements)

function moveElements() {
    // document.querySelector('.product-item[data-pos="1"]').style.translate = "50% 0 -200px";
    // document.querySelector('.product-item[data-pos="2"]').style.translate = "-100% 0 -400px";
    // document.querySelector('.product-item[data-pos="3"]').style.translate = "0 0 0"

    document.querySelector('.product-item-CTN[data-pos="1"]').setAttribute('data-pos', 5)
    document.querySelector('.product-item-CTN[data-pos="2"]').setAttribute('data-pos', 6)
    document.querySelector('.product-item-CTN[data-pos="3"]').setAttribute('data-pos', 4)
    document.querySelector('.product-item-CTN[data-pos="4"]').setAttribute('data-pos', 2)
    document.querySelector('.product-item-CTN[data-pos="5"]').setAttribute('data-pos', 3)
    document.querySelector('.product-item-CTN[data-pos="6"]').setAttribute('data-pos', 1)
    console.log('New');

}