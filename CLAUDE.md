# Pure Power — Project Instructions

## Project Overview

Laundry brand presentation and blog website.
Vanilla HTML + CSS + JS. No frameworks. No build tools unless explicitly requested.

---

## Reference Material

- `/reference/instructions/` — written specs, read when needed
- `/reference/jpg/` — design mockups and screenshots, read when needed
- `/reference/pdf/` — **DO NOT READ**, files are too large and will burn context window

`instructions.txt` in the project root is a legacy file — ignore it, use this CLAUDE.md instead.

---

## CSS Bootstrap Spec

> These values are the source of truth **until the CSS files exist**.
> Once `/css/variables.css` and `/css/typography.css` are generated, treat those files as the source of truth and never re-read these sections.

### Variables → `/css/variables.css`

```css
:root {
    --bgColor: #02399A;
    --brightBlue: #39B7FF;
    --yellow: #FDD835;
    --electricBlue: #2040EC;
    --pink: #F96CDA;
    --white: #FFFFFF;
    --lightGrey: #CBDFEE;
    --black: #000000;
    --lightBlack: #444444;
}
```

### Typography → `/css/typography.css`

```css
/* Font: HK Grotesk Wide — must be loaded via @font-face or hosted source */

body {
    font-family: 'HK Grotesk Wide', sans-serif;
    font-weight: 400; /* regular */
    color: var(--white);
    background-color: var(--bgColor);
}

h1 { font-weight: 500; } /* medium */
h2, h3, h4 { font-weight: 400; } /* regular */
```

### Base body → `/css/base.css`

```css
body {
    background-color: var(--bgColor);
    color: var(--white);
}

/* Use clamp() for all responsive sizing — no fixed px breakpoints for type or spacing */
```

---

## Pages & Routes

| Page | Route |
|---|---|
| Home | `/` |
| About | `/about` |
| Products | `/products` |
| FAQ | `/faq` |
| Blog article | `/blog/[article-category]/[article-slug]` |

---

## Product Structure Standard

Every product element must follow this naming convention:

- Container: `id="[product-name]"`
- Image: `.product-image`
- Description: `.product-description`
- Price: `.product-price`
- Action: `.product-button` or `.product-link`

Every product is a reusable component / partial.

---

## Asset Map

All assets live in `/assets/`. Reference by filename as listed. Do not rename or reorganize.

### Global
- `pure-power-logo` — header logo
- `chevron-down.svg` — header language dropdown
- `question-marks.svg` — above "Feel free to reach out" CTA (FAQ, About, Products pages)
- `sky.webp`, `stars.svg`, `cloud1.webp`, `cloud2.webp` — footer + comments section

### Homepage
- `hero.png` — hero background
- `foam.jpg` — `#intro` background (50% opacity over `--brightBlue`)
- `2kg.png` — best seller + laundry powders
- `5kg.png` — laundry powders
- `6kg.png` — laundry powders
- `liquid-5kg.png` — liquid laundry section
- `liquid.png` — `#liquidLaundry` background (20% opacity over `--brightBlue`)
- `splash.png` — `#laundryPowders` background (30% opacity)
- `community.png` — `#community` background (15% opacity)
- `guadeloupe.svg`, `martinique.svg`, `guyane.svg`, `new-caledonia.svg` — availability banner flags
- `tik-tok.svg`, `facebook.svg`, `instagram.svg`, `youtube.svg` — social icons
- `u-logo.svg`, `leclerc-logo.svg`, `promocash-logo.svg`, `leaderprice-logo.svg` — reseller logos

### FAQ & About
- `foam.webp` — FAQ background (50% opacity with wave shape)
- `liquid.webp` — About background (20% opacity with wave shape)

---

## Global Components

### Header `#header`

- Fixed, centered, `top: 20px`
- Width: `calc(100% - 40px)`, `20px` margin left and right
- Background: `--black` at 10% opacity with `backdrop-filter: blur(20px)`
- Contents: Pure Power logo (left) · nav links (center) · Contact button + EN switcher with `chevron-down.svg` (right)
- Contact button is an anchor link to `/#contact`
- Language switcher: EN default, chevron toggles dropdown

### Footer `#footer`

- Contents: Pure Power logo · social icons · sitemap columns (Products, About, Contact)
- Infinite horizontal scroll ticker: "Available in Guadeloupe · Martinique · Guyane · New-Caledonia"
- Ticker assets: `sky.jpg`, `cloud1.png`, `cloud2.png`, `stars.svg`

### Mobile Menu

- Hamburger toggle → full-screen overlay, slides in from right
- Nav items: staggered fade-in on open
- Close button: top-right
- Links: Products · About · FAQ · **Blog** · Contact
- **Blog link must always be present** — easy to forget
- Social icons pinned to bottom of overlay

---

## Homepage `/`

### `#hero`
- Full-viewport, background image: `hero.png`
- Text centered
- Wave from `#intro` overlaps bottom of hero

### `#intro`
- Wave overlaps slightly upward into `#hero`
- Background: `foam.jpg` at 50% opacity over `--brightBlue`
- Content in 2-column grid

### `#bestSeller`
- Product: `2kg.png`
- "See details" → `/products`

### `#laundryPowders`
- Products: `2kg.png`, `5kg.png`, `6kg.png`
- Background: `splash.png` at 30% opacity
- "See details" buttons → `/products`

### `#liquidLaundry`
- Product: `liquid-5kg.png`
- Background: `liquid.png` at 20% opacity over `--brightBlue`
- "See details" → `/products`

### `#availabilityBanner`
- Infinite horizontal scroll ticker
- Flag SVGs + names: Guadeloupe, Martinique, Guyane, New-Caledonia
- Assets: `guadeloupe.svg`, `martinique.svg`, `guyane.svg`, `new-caledonia.svg`

### `#community`
- Background: `community.png` at 15% opacity
- Social links: `tik-tok.svg`, `facebook.svg`, `instagram.svg`, `youtube.svg`
- Infinite scroll ticker (same territories as availability banner)

### `#resellers`
- Logos in a row: `u-logo.svg`, `leclerc-logo.svg`, `promocash-logo.svg`, `leaderprice-logo.svg`

### `#comments`
- Background: `sky.webp`
- Each testimonial has a cloud behind it, alternating `cloud1.webp` / `cloud2.webp`
- Stars: `stars.svg`

### `#contact`
- Query type toggle: **Business** or **Customer**
- Business selected: "Company name" field injected above first/last name fields, full width
- Customer selected: "Company name" field removed from the DOM (not CSS-hidden)

---

## FAQ Page `/faq`

- Hero: floating product images, page title, subtitle (same pattern as About)
- Wave section background: `foam.webp` at 50% opacity
- FAQ items in 2-column asymmetric grid (see `/reference/jpg/faqpage.jpg`)
- `question-marks.svg` above "Feel free to reach out" CTA → `/#contact`

---

## About Page `/about`

- Hero: floating product images, page title, subtitle
- Wave section background: `liquid.webp` at 20% opacity
- Editorial text layout (see `/reference/jpg/aboutpage.jpg`)
- `question-marks.svg` above "Feel free to reach out" CTA → `/#contact`

---

## Products Page `/products`

- On load: dismissible hint message above product list — "Click on a product below to display its details"
- Hint dismissed by clicking it or its X button — removed from DOM, not hidden
- Layout: product list left · product detail panel right
- Clicking a product populates the right panel: image, name, features checklist, description/composition tabs
- `question-marks.svg` above "Feel free to reach out" CTA → `/#contact`

### Product List
- Iconic 4KG
- Compact 2KG
- Family 5KG
- Pro Format 6KG
- Liquid 5KG

---

## Blog Page `/blog/[article-category]/[article-slug]`

- Static template for now
- URL structure must be respected: two dynamic segments (category + slug)
- Layout: article title · subtitle · intro highlight block · sections with subsections · prev/next article nav
- See `/reference/jpg/blog.jpg` for layout reference
