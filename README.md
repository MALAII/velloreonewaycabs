# Vellore One Way Cabs — Website

Premium, editorial-style cab booking website for **velloreonewaycabs.com**.

Static HTML5 + CSS3 + vanilla JavaScript. No frameworks, no build step, no backend.
Deploy by copying this folder to any static host.

---

## 1. Quick start

| Item | Value |
| --- | --- |
| Local preview | `python3 -m http.server 8080` then open `http://localhost:8080/` |
| Entry point | `index.html` |
| Stylesheet | `css/style.css` |
| Script | `js/script.js` |
| Primary colour | Champagne gold `#C6A36B` on charcoal `#17191B` / ivory `#F7F4EE` |
| Type | DM Serif Display (headings) + Inter (body), self-hosted |

---

## 2. ⚠️ Before going live — 3 required actions

### 2.1 Add the WhatsApp number (blocking)

The business number has **not** been supplied, so it is intentionally empty. Open
`js/script.js` and edit the `BUSINESS` object at the top of the file:

```js
const BUSINESS = {
  name: "Vellore One Way Cabs",
  domain: "https://velloreonewaycabs.com",
  whatsappNumber: "",   // <-- add e.g. "919876543210"  (country code + number, digits only)
  phoneNumber: "",      // <-- add e.g. "+91 98765 43210" (display only)
  email: ""             // <-- add e.g. "bookings@velloreonewaycabs.com"
};
```

While `whatsappNumber` is empty, the booking form **does not pretend** to send anything. It validates
the form, then shows an honest notice explaining that WhatsApp is not connected and offers a
"copy enquiry details" button. The moment a number is added, the same form opens
`https://wa.me/<number>?text=<formatted enquiry>` with every field included.

### 2.2 Publish contact details

The contact page deliberately shows placeholders ("Number to be published", "Address to be
published", "Hours to be confirmed") and a Google Maps placeholder — nothing has been invented.
Update `contact.html` (search for `contact-value--pending`, `contact-items__value--pending` and
`map-placeholder` / `map-card`) once real details exist.

### 2.3 Publish the rate card

`tariff.html` uses "Rate to be confirmed" everywhere, because no rates were supplied. Replace the
placeholder amounts once the business rate card is available, and update the FAQ answer that explains
why rates are pending.

**Optional but recommended:** connect the contact form to a real endpoint (e.g. Formspree, a
serverless function, or a WhatsApp link). It currently validates and prepares the enquiry only — as
the on-page copy states.

---

## 3. Pages

| File | Purpose | Schema |
| --- | --- | --- |
| `index.html` | Home: hero, booking widget, services, benefits, vehicles, 38-district coverage, routes, process, FAQ | TaxiService, WebSite, WebPage, ItemList, FAQPage |
| `about.html` | Story, mission, vision, travel philosophy, planning process | AboutPage, BreadcrumbList |
| `services.html` | Six service sections + comparison table + service FAQs | Service (×6 in ItemList), FAQPage, BreadcrumbList |
| `tariff.html` | Vehicle categories, fare components, FAQ, quote CTA | OfferCatalog, FAQPage, BreadcrumbList |
| `contact.html` | Contact form, channel placeholders, map placeholder | ContactPage, BreadcrumbList |
| `privacy.html` | Privacy policy | WebPage, BreadcrumbList |
| `terms.html` | Terms & conditions | WebPage, BreadcrumbList |

SEO files: `robots.txt`, `sitemap.xml`, `assets/favicon.svg`, `assets/apple-touch-icon.png`,
`assets/og/*.jpg` (one Open Graph image per page).

---

## 4. Design system notes

* **Layout** — editorial grids, asymmetric image blocks, hairline rules, generous whitespace, minimal
  corner radius (2–3 px) to keep the luxury feel.
* **Typography** — `clamp()` throughout: hero 44→88 px, section headings 34→56 px, body 17→19 px.
* **Motion** — IntersectionObserver reveals, word-by-word hero stagger, image mask wipes, gold line
  draws, subtle parallax, image zooms on hover. All of it degrades gracefully and is disabled under
  `prefers-reduced-motion`.
* **Images** — 23 locally hosted, optimised photographs (`assets/images`), `object-fit: cover`,
  explicit `width`/`height` to prevent layout shift, `loading="lazy"` below the fold.
* **Accessibility** — single `<h1>` per page, skip link, labelled form fields with `aria-invalid`
  handling, `aria-expanded` accordions, visible focus rings, 4.5:1+ text contrast.

---

## 5. Photo licensing — please verify before commercial launch

Photographs were sourced from Pexels (Pexels License) and Wikimedia Commons (CC BY / CC BY-SA /
CC0 / public domain) and are stored locally in `assets/images/`.

* Pexels images may be used commercially without attribution, but must not be presented as an
  endorsement by the people or brands shown.
* Wikimedia Commons images distributed under CC BY / CC BY-SA **require attribution** if you keep
  them. If you prefer a zero-obligation setup, replace them with your own fleet photography.

Images are illustrative of vehicle **categories**, not of this business's actual fleet, and no
business branding is applied to any vehicle. Before launch, replace any image you cannot license
comfortably with original photography of the real fleet — that will also strengthen trust and SEO.

---

## 6. Deployment

1. Upload the entire folder to your host (Netlify, Vercel, Cloudflare Pages, cPanel, S3 — anything
   static).
2. Point `velloreonewaycabs.com` at it and enable HTTPS.
3. Confirm these resolve: `/`, `/about.html`, `/services.html`, `/tariff.html`, `/contact.html`,
   `/robots.txt`, `/sitemap.xml`.
4. Submit `https://velloreonewaycabs.com/sitemap.xml` in Google Search Console.
5. Replace placeholder contact details and the rate card (see section 2).
6. Validate structured data: <https://validator.schema.org/> and the Rich Results Test.

### Caching hint

Fonts and images are immutable — serve `/assets/*` with a long `Cache-Control`, and `/*.html` with a
short one.

---

## 7. Quality checks performed

* 7 pages audited at 1440, 1280, 1024, 768, 390 and 360 px — no horizontal overflow, no console
  errors, no duplicate `id`s, no broken internal links, exactly one `<h1>` per page.
* All JSON-LD blocks parse and contain only confirmed information (no invented phone, address,
  coordinates, hours, prices, ratings or reviews).
* Booking and contact forms tested: empty submit flags all required fields, invalid mobile numbers are
  rejected, unconfigured WhatsApp shows the honest notice instead of a fake success.
* Mobile navigation, sticky header states, FAQs and route pre-fill buttons verified in a browser.

---

© Vellore One Way Cabs. Built as a static site for velloreonewaycabs.com.
# velloreonewaycabs
