# Tariqul’s Portfolio

Modern, blazing‑fast portfolio built on **Next.js 15** with a polished UI, smooth animations, and a unique terminal‑style intro. Includes an authenticated **Dashboard** to manage projects and blogs.

[![Live](https://img.shields.io/badge/Live-tariqul.dev-000?logo=vercel)](https://tariqul.dev)
![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-Components-111)
![License](https://img.shields.io/badge/License-MIT-green)

> **Live Demo:** [https://tariqul.dev](https://tariqul.dev)

![Banner](public/assets/banner.png)

---

## ✨ Features

- Responsive, accessible, and SEO‑ready design
- Light/Dark theme with smooth transitions
- **Framer Motion** animations & interactive micro‑UI (magic buttons, cards, etc.)
- Terminal‑style profile section
- Projects with detail pages + skills cloud
- Contact form via **Nodemailer**
- Authenticated **Dashboard** (blogs/projects CRUD)
- **NextAuth** authentication
- **Cloudinary** image upload
- Structured logging with **Pino**
- Google Analytics (GA4) support
- Production‑grade configs (ESLint, TS, Tailwind)

---

## 🧰 Tech Stack

**Next.js 15**, **TypeScript**, **Tailwind CSS**, **Shadcn/Radix UI**,
**NextAuth**, **MongoDB (Mongoose)**, **Framer Motion**, **Nodemailer**, **Pino**, **Cloudinary**.

---

## 📦 Project Structure

```
tariqul/
├─ app/                     # App Router
│  ├─ (root)/              # Public routes
│  ├─ (auth)/              # Auth routes
│  ├─ (dashboard)/         # Protected dashboard
│  └─ api/                 # Route handlers
├─ components/
│  ├─ ui/                  # Shadcn UI wrappers
│  └─ shared/              # Reusable components
├─ lib/
│  ├─ actions/             # Server actions
│  ├─ auth/                # NextAuth config
│  └─ logger.ts            # Pino
├─ models/                  # Mongoose schemas
├─ public/                  # Static assets
└─ ...
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# BASE_URL
NEXT_PUBLIC_BASE_URL=

# EMAILJS / SMTP (used by Nodemailer)
SMTP_HOST=
SMTP_PORT=
EMAIL_USER=
EMAIL_PASS=

# DATABASE (MongoDB)
DATABASE_URL=
DATABASE_PASSWORD=

# NEXT_AUTH
NEXTAUTH_SECRET=

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_PRESET=

# GOOGLE ANALYTICS
NEXT_PUBLIC_GA_ID=
```

> **Notes**
>
> - `DATABASE_URL` should be a valid MongoDB connection string.
> - `NEXTAUTH_SECRET` can be generated with `openssl rand -base64 32`.
> - If deploying on Vercel, add all the above in **Project Settings → Environment Variables**.

---

## 🛠️ Getting Started

```bash
# 1) Clone
git clone https://github.com/tariqul420/tariqul-portfolio-next.git
cd tariqul-portfolio-next

# 2) Install
npm install
# or
yarn install
# or
pnpm install

# 3) Run dev server
npm run dev
# open http://localhost:3000
```

### Useful Scripts

```bash
npm run dev         # start development server
npm run build       # production build
npm run start       # start production server
npm run lint        # lint codebase
```

---

## 🚀 Deployment

**Vercel (recommended)**

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add all environment variables from `.env.local`.
4. Set the Production branch to `main`.
5. Every merge to `main` auto‑deploys.

> You can also deploy on a VPS with `npm run build && npm run start` behind PM2/NGINX.

---

## 🔒 Security & Privacy

- Secrets are loaded from environment variables only.
- Never commit `.env*` files.
- Validate all inputs (Zod + React Hook Form).

---

## 🗺️ Roadmap

- [ ] RSS & Sitemap enhancements
- [ ] Search across posts/projects
- [ ] Image optimization presets for galleries
- [ ] i18n (EN/BD)
- [ ] Unit tests & CI

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Check the [issues](https://github.com/tariqul420/tariqul-portfolio-next/issues) and open a PR.

**Commit/PR style**

- Conventional commits preferred (`feat:`, `fix:`, `docs:` …)
- Keep PRs focused and small

---

## 📝 License

Released under the **MIT License**. See `LICENSE` for details.

---

## 📬 Contact

- **Email:** [contact@tariqul.dev](mailto:contact@tariqul.dev)
- **LinkedIn:** [https://www.linkedin.com/in/tariqul-dev/](https://www.linkedin.com/in/tariqul-dev/)
- **Twitter/X:** [https://x.com/tariqul_420](https://x.com/tariqul_420)
- **Facebook:** [https://www.facebook.com/tariquldev](https://www.facebook.com/tariquldev)

---

### Suggested PR for this README

- **Title:** `docs: refresh README with modern layout and env guide`
- **Description:**
  Updates README with badges, features, tech stack, environment variable guide, scripts, deployment steps, and contribution standards. Improves onboarding and developer experience.
- **Labels:** `documentation`, `enhancement`, `good first issue`

---

_Made with ❤️ by Tariqul_
