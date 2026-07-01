const lang = document.documentElement.lang;

const PRODUCTS_EN = [
    {
        id: 'iconic-4kg',
        name: 'Pure Power 4KG',
        image: '../assets/img/webp/4kg.webp',
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
        image: '../assets/img/webp/2kg.webp',
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
        image: '../assets/img/webp/5kg.webp',
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
        image: '../assets/img/webp/6kg.webp',
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
        image: '../assets/img/webp/liquid-5kg.webp',
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
        image: './assets/img/webp/4kg.webp',
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
        image: './assets/img/webp/2kg.webp',
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
        image: './assets/img/webp/5kg.webp',
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
        image: './assets/img/webp/6kg.webp',
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
        name: 'Pure Power Liquide 5KG',
        image: './assets/img/webp/liquid-5kg.webp',
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

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const radios = form.querySelectorAll('input[name="query-type"]');
    const fields = form.querySelector('.contact-fields');
    const companyLabel = lang === 'fr' ? 'Nom de l\'entreprise' : 'Company name';

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const existing = fields.querySelector('.field-company');
            if (radio.value === 'business') {
                if (!existing) {
                    const label = document.createElement('label');
                    label.className = 'field field-full field-company';
                    label.innerHTML = `<span>${companyLabel}</span><input type="text" name="company" autocomplete="organization">`;
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
    const previewImage = panel.querySelector('.products-preview .product-image');
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
        if (previewImage) {
            previewImage.src = product.image;
            previewImage.alt = product.name;
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
initContactForm();
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