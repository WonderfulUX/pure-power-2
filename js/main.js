const PRODUCTS = [
    {
        id: 'iconic-4kg',
        name: 'Pure Power 4KG',
        image: 'assets/img/webp/4kg.webp',
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
        image: 'assets/img/webp/2kg.webp',
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
        image: 'assets/img/webp/5kg.webp',
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
        image: 'assets/img/webp/6kg.webp',
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
        image: 'assets/img/webp/liquid-5kg.webp',
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

function initMobileMenu() {
    const menuToggle = document.querySelector('.header-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');

    if (!menuToggle || !mobileMenu) return;

    function openMenu() {
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);

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

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const radios = form.querySelectorAll('input[name="query-type"]');
    const fields = form.querySelector('.contact-fields');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const existing = fields.querySelector('.field-company');
            if (radio.value === 'business') {
                if (!existing) {
                    const label = document.createElement('label');
                    label.className = 'field field-full field-company';
                    label.innerHTML = '<span>Company name</span><input type="text" name="company" autocomplete="organization">';
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
    const AVAILABILITY_ITEMS = [
        { flag: 'assets/svg/guadeloupe.svg', name: 'Guadeloupe' },
        { flag: 'assets/svg/martinique.svg', name: 'Martinique' },
        { flag: 'assets/svg/guyane.svg', name: 'Guyane' },
        { flag: 'assets/svg/new-caledonia.svg', name: 'New-Caledonia' }
    ];

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
initContactForm();
initProductsPage();
initTickers();
