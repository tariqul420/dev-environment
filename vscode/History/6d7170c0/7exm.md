# Tools Hub – Project Roadmap & Documentation

## 🏷️ Project Overview

- **Project Name:** Tools Hub (Utility / Productivity Tools Platform)
- **Goal:** Provide free, fast, privacy-friendly online tools (URL shortener, PDF tools, image converters, text utilities, calculators).
- **Monetization:** Google AdSense (banner, sticky, in-content ads) + premium subscriptions (optional, for shortener or advanced tools).

---

## ⚙️ Technology Stack

- **Frontend Framework:** Next.js (App Router, React 18)
- **UI Library:** ShadCN UI (Blue theme + Green accent)
- **Styling:** TailwindCSS
- **Icons:** Lucide Icons
- **Animations:** Framer Motion
- **Database:**
  - PostgreSQL (via Prisma ORM) → Shortener links, analytics, users
  - MongoDB (optional, for image gallery or flexible storage)
- **Auth:** Clerk (or NextAuth if needed)
- **Storage:** Cloudinary / AWS S3 (for images, PDF processing if server-side)
- **Caching:** Vercel ISR + Redis (Upstash) for rate limiting & caching
- **Deployment:** Docker + Traefik (reverse proxy, SSL with Let’s Encrypt)
- **Monitoring:** Healthcheck + logs (pino/winston)

---

## 📂 File Path & Project Structure

```bash
├── app
│   ├── (marketing)
│   │   ├── privacy
│   │   ├── sponsor
│   │   └── terms
│   ├── [id]
│   ├── api
│   │   ├── link-expand
│   │   ├── og-preview
│   │   └── rates
│   ├── tools
│   │   ├── (tools)
│   │   │   ├── calc
│   │   │   │   ├── bmi
│   │   │   │   ├── currency
│   │   │   │   ├── date-diff
│   │   │   │   ├── discount
│   │   │   │   ├── emi
│   │   │   │   ├── percentage
│   │   │   │   ├── scientific
│   │   │   │   ├── standard
│   │   │   │   ├── tip-split
│   │   │   │   └── unit-converter
│   │   │   │       └── page.tsx
│   │   │   ├── dev
│   │   │   │   ├── api-tester
│   │   │   │   ├── base-converter
│   │   │   │   ├── color-converter
│   │   │   │   ├── csv-json
│   │   │   │   ├── diff-checker
│   │   │   │   ├── hash-generator
│   │   │   │   ├── json-formatter
│   │   │   │   ├── jwt-decode
│   │   │   │   ├── lorem-ipsum
│   │   │   │   ├── markdown-previewer
│   │   │   │   ├── password-generator
│   │   │   │   ├── regex-library
│   │   │   │   ├── regex-tester
│   │   │   │   ├── timestamp-converter
│   │   │   │   ├── uuid-nanoid
│   │   │   │   └── yaml-json
│   │   │   │       └── page.tsx
│   │   │   ├── finance
│   │   │   │   ├── salary-hourly
│   │   │   │   ├── savings-goal
│   │   │   │   └── vat
│   │   │   │       └── page.tsx
│   │   │   ├── image
│   │   │   │   ├── convert
│   │   │   │   └── resize
│   │   │   │       └── page.tsx
│   │   │   ├── office
│   │   │   │   ├── invoice
│   │   │   │   ├── meeting-notes
│   │   │   │   └── todo
│   │   │   │       └── page.tsx
│   │   │   ├── seo
│   │   │   │   ├── meta-generator
│   │   │   │   ├── og-preview
│   │   │   │   ├── robots-generator
│   │   │   │   ├── schema-generator
│   │   │   │   └── sitemap-generator
│   │   │   │       └── page.tsx
│   │   │   ├── text
│   │   │   │   ├── base64
│   │   │   │   ├── case-converter
│   │   │   │   ├── cleaner
│   │   │   │   ├── line-tools
│   │   │   │   ├── password-strength
│   │   │   │   ├── slugify
│   │   │   │   ├── to-list
│   │   │   │   └── word-counter
│   │   │   │       └── page.tsx
│   │   │   ├── time
│   │   │   │   ├── age
│   │   │   │   ├── countdown
│   │   │   │   ├── timezone
│   │   │   │   └── weekno
│   │   │   │       └── page.tsx
│   │   │   ├── travel
│   │   │   │   └── packing
│   │   │   │       └── page.tsx
│   │   │   ├── url
│   │   │   │   ├── expand
│   │   │   │   ├── qr
│   │   │   │   ├── shortener
│   │   │   │   │   ├── analytics
│   │   │   │   │   │   └── [id]
│   │   │   │   │   ├── interstitial
│   │   │   │   │   │   └── [id]
│   │   │   ├── util
│   │   │   │   ├── clipboard-cleaner
│   │   │   │   ├── id-generator
│   │   │   │   ├── pomodoro
│   │   │   │   ├── random-picker
│   │   │   │   └── unit-price
│   │   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components
│   ├── calculators
│   │   ├── calc-button.tsx
│   │   └── display.tsx
│   ├── image
│   │   ├── controls.tsx
│   │   ├── image-dropzone.tsx
│   │   └── image-preview-meta.tsx
│   ├── seo
│   │   └── json-ld.tsx
│   ├── shared
│   │   ├── form-fields
│   │   │   ├── input-field.tsx
│   │   │   ├── select-field.tsx
│   │   │   ├── switch-row.tsx
│   │   │   └── textarea-field.tsx
│   │   ├── action-buttons.tsx
│   │   ├── code-block.tsx
│   │   ├── color-field.tsx
│   │   ├── process-log.tsx
│   │   ├── qr-code.tsx
│   │   ├── stat.tsx
│   │   └── tool-page-header.tsx
│   ├── tools
│   │   ├── finance
│   │   │   ├── salary-hourly-client.tsx
│   │   │   ├── savings-goal-client.tsx
│   │   │   └── vat-calculator-client.tsx
│   │   ├── office
│   │   │   ├── meeting-notes-client.tsx
│   │   │   ├── simple-invoice-client.tsx
│   │   │   └── todo-offline-client.tsx
│   │   ├── text
│   │   │   ├── base64-client.tsx
│   │   │   ├── case-converter-client.tsx
│   │   │   ├── line-tools-client.tsx
│   │   │   ├── password-strength-client.tsx
│   │   │   ├── slugify-client.tsx
│   │   │   ├── text-cleaner-client.tsx
│   │   │   ├── text-to-list-client.tsx
│   │   │   └── word-counter-client.tsx
│   │   ├── time
│   │   │   ├── age-calculator-client.tsx
│   │   │   ├── countdown-timer-client.tsx
│   │   │   ├── timezone-converter-client.tsx
│   │   │   └── week-number-client.tsx
│   │   ├── url
│   │   │   ├── clicks-by-day-chart.tsx
│   │   │   ├── continue-form.tsx
│   │   │   ├── link-expand-client.tsx
│   │   │   ├── qr-client.tsx
│   │   │   ├── shortener-client.tsx
│   │   │   ├── top-table.tsx
│   │   └── util
│   │       ├── clipboard-cleaner-client.tsx
│   │       ├── id-generator-client.tsx
│   │       ├── pomodoro-focus-client.tsx
│   │       ├── random-picker-client.tsx
│   │       └── unit-price-client.tsx
│   └── ui
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── glass-card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── nav-main.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar-provider.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tools-header.tsx
│       ├── tools-sidebar.tsx
│       └── tooltip.tsx
├── data
│   └── tools.ts
├── docs
│   ├── CONTRIBUTING.md
│   └── PROJECT.md
├── hooks
│   ├── use-auto-preview.ts
│   ├── use-copy.ts
│   ├── use-image-input.ts
│   ├── use-mobile.ts
│   └── use-qr-export.ts
├── lib
│   ├── actions
│   │   └── shortener.action.ts
│   ├── utils
│   │   ├── download.ts
│   │   └── time-ago.ts
│   ├── canvas.ts
│   ├── clipboard.ts
│   ├── logger.ts
│   ├── normalize-url.ts
│   ├── prisma.ts
│   ├── safe-eval.ts
│   ├── seo.ts
│   └── utils.ts
├── prisma
│   ├── generated
│   │   └── prisma
│   │       ├── runtime
│   │       │   ├── edge-esm.js
│   │       │   ├── edge.js
│   │       │   ├── index-browser.d.ts
│   │       │   ├── index-browser.js
│   │       │   ├── library.d.ts
│   │       │   ├── library.js
│   │       │   ├── react-native.js
│   │       │   ├── wasm-compiler-edge.js
│   │       │   └── wasm-engine-edge.js
│   │       ├── client.d.ts
│   │       ├── client.js
│   │       ├── default.d.ts
│   │       ├── default.js
│   │       ├── edge.d.ts
│   │       ├── edge.js
│   │       ├── index-browser.js
│   │       ├── index.d.ts
│   │       ├── index.js
│   │       ├── libquery_engine-debian-openssl-3.0.x.so.node
│   │       ├── package.json
│   │       ├── schema.prisma
│   │       ├── wasm.d.ts
│   │       └── wasm.js
│   ├── migrations
│   │   ├── 20250829035703_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   └── logo.png
├── types
│   ├── index.d.ts
│   ├── text.d.ts
│   ├── time.d.ts
│   ├── url.d.ts
│   └── util.d.ts
├── .biomeignore
├── .dockerignore
├── biome.json
├── components.json
├── docker-compose.yaml
├── Dockerfile
├── LICENSE
├── mdx-components.tsx
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## 🛠️ Tools List (Phase 1 – MVP)

1. **URL Shortener** (custom slug, click analytics, interstitial ads)
2. **QR Code Generator**
3. **Password / Random String Generator**
4. **Base64 Encode/Decode**
5. **Word Counter**
6. **Case Converter (Upper/Lower/Title)**
7. **PDF Merge / Split**
8. **PDF Compress**
9. **PDF to Word**
10. **Image Converter (JPG/PNG/WebP)**
11. **Image Resize / Crop**
12. **JSON Formatter**
13. **JWT Decoder**
14. **Unit Converter (Length/Weight/Temp)**
15. **BMI Calculator**

---

## 🚀 Roadmap (Milestones)

**Phase 1 (MVP – 2–3 Weeks):**

- Next.js setup (App Router, ShadCN theme = Blue primary, Green accent)
- Core UI: Navbar, Footer, Ad slots, SEO layout
- Implement 10–15 basic tools (text, PDF, image, calculator)
- Shortener with analytics + Prisma/Postgres
- Sitemap/robots + metadata for each tool
- Deploy with Docker + Traefik (domain + SSL)
- Apply for Google AdSense

**Phase 2 (Scaling – 1–2 Months):**

- Add more developer/SEO tools (regex tester, OG builder, sitemap generator)
- Add image/media tools (EXIF remover, favicon generator, palette extractor)
- Add advanced calculators (date diff, VAT, currency)
- Improve interstitial ads + premium option for shortener
- Start blog (MDX) for SEO content

**Phase 3 (Growth – 3–6 Months):**

- Localization (EN primary, BN secondary)
- Analytics dashboard for users
- API access for shortener (premium tier)
- Build backlinks (listings, blog outreach, dev communities)
- Launch companion site (PixForge – media/creative tools)

---

## 🎨 Branding Guidelines

- **Theme:** ShadCN Blue (primary) + Green (accent)
- **Fonts:**
  - Headings: Space Grotesk
  - Body: Inter
  - Code: JetBrains Mono
- **Logo Idea:** Minimal "T" monogram + tool icons (grid/wrench shape)
- **Design Tokens:**
  - Border radius: `1rem` (rounded-2xl)
  - Shadow: soft-lg
  - BG: `#F8FAFC` (light) / `#0B1220` (dark)
  - Text: `#0F172A` (light) / `#E5E7EB` (dark)

---

## 📊 Database Schema (Prisma – Shortener & Analytics)

```prisma
model User {
  id        String  @id @default(cuid())
  email     String  @unique
  links     Link[]
  createdAt DateTime @default(now())
}

model Link {
  id        String  @id @default(cuid())
  short     String  @unique
  targetUrl String
  userId    String?
  user      User?   @relation(fields: [userId], references: [id])
  clicks    Click[]
  createdAt DateTime @default(now())
}

model Click {
  id        String  @id @default(cuid())
  linkId    String
  link      Link    @relation(fields: [linkId], references: [id])
  ts        DateTime @default(now())
  referrer  String?
  country   String?
  uaHash    String?
  ipHash    String?
}
```

---

## 📌 Next Steps

1. Pick **Project Name & Domain** (`toolery.app` or `quickkit.tools`)
2. Setup Next.js repo + ShadCN theme config
3. Create `docs/PROJECT.md` (this file) to track roadmap
4. Start with **MVP tools** + SEO config
5. Deploy on VPS with Docker + Traefik
6. Apply for AdSense once 15–20 indexed pages are live
