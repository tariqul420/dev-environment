<h1 align="center">
  <img src="nurui-logo.png" alt="Nurui Logo" width="200" />
</h1>

<p align="center"><b>Nurui</b> — A production‑ready React & Next.js UI component library for building fast, beautiful interfaces with zero fuss.</p>

<p align="center">
  <a href="https://nurui.vercel.app/docs/installation"><b>📖 Documentation</b></a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-installation">⚙️ Install</a> •
  <a href="#-usage">🧩 Usage</a> •
  <a href="#-theming">🎨 Theming</a> •
  <a href="#-contributing">🤝 Contribute</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/afsar-dev/Nurui?label=License&style=flat-square">
  <img alt="Last Commit" src="https://img.shields.io/github/last-commit/afsar-dev/Nurui?style=flat-square">
  <img alt="Issues" src="https://img.shields.io/github/issues/afsar-dev/Nurui?style=flat-square">
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-1abc9c.svg?style=flat-square">
</p>

<img src="og-image.png" alt="Nurui UI component library" width="100%" />

---

## 🎯 Why Nurui?

Nurui ships a carefully curated React/Next.js component set with:

- **First‑class Next.js support** (App Router, RSC‑friendly where applicable)
- **CLI scaffolding** to spin up components fast
- **TypeScript → JavaScript automatic conversion** (keep types if you want, drop them if you don’t)
- **Live component previews** for rapid iteration
- **Tree‑shakeable, accessible, themeable** components that work in real apps, today

---

## ✨ Features

- ⚡ **Production‑ready**: battle‑tested patterns, sensible defaults, strict typings
- 🧱 **Composable**: headless primitives + styled components
- 🧪 **Preview-Driven**: live playground for iteration & docs parity
- 🧭 **A11y by default**: ARIA attributes & keyboard interactions
- 📦 **Tree‑shaking**: ship less, load faster
- 🎨 **Design‑system friendly**: tokens, CSS variables, dark mode ready
- 🧰 **CLI tooling**: `nurui add <component>`; `nurui g component Button`
- 🧩 **TS/JS Flexibility**: import as TS or consume compiled JS

---

## ✅ Requirements

- **Node**: 18+
- **React**: 18.2+
- **Next.js**: 14+ (App Router recommended, Pages Router supported)

---

## ⚙️ Installation

Choose your package manager:

```bash
# npm
npm install nurui

# yarn
yarn add nurui

# pnpm
pnpm add nurui

# bun
bun add nurui
```

If you want the CLI too:

```bash
# npm
npm install -D nurui-cli

# yarn
yarn add -D nurui-cli

# pnpm
pnpm add -D nurui-cli

# bun
bun add -D nurui-cli
```

---

## 🚀 Quick Start

**1) Provider setup (optional but recommended)**

```tsx
// app/providers.tsx (Next.js App Router)
"use client";

import { NuruiProvider } from "nurui/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <NuruiProvider>{children}</NuruiProvider>;
}
```

```tsx
// app/layout.tsx
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**2) Use a component**

```tsx
// app/page.tsx
import { Button } from "nurui/button";

export default function Home() {
  return (
    <main className="container">
      <h1>Nurui + Next.js</h1>
      <Button onClick={() => alert("Hello Nurui!")} variant="primary" size="lg">
        Get Started
      </Button>
    </main>
  );
}
```

> Full docs: **[Installation & Setup](https://nurui.vercel.app/docs/installation)**

---

## 🧰 CLI (Scaffold Components Fast)

```bash
# generate a new component with stories/tests
npx nurui g component Button

# add a prebuilt component from the library catalog
npx nurui add card
```

- Generates **TS or JS** based on your project
- Adds **stories**, **tests**, and **styles** (configurable)

---

## 🧩 Usage Examples

**Buttons**

```tsx
import { Button } from "nurui/button";

<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost" size="sm" iconLeft="sparkles">Tiny Ghost</Button>
```

**Modal**

```tsx
import { Modal, ModalBody, ModalFooter } from "nurui/modal";

<Modal open={open} onOpenChange={setOpen} title="Confirm">
  <ModalBody>Are you sure?</ModalBody>
  <ModalFooter
    actions={[
      { label: "Cancel", variant: "ghost", onClick: () => setOpen(false) },
      { label: "Confirm", variant: "primary", onClick: handleConfirm },
    ]}
  />
</Modal>;
```

**Form + Input**

```tsx
import { Input } from "nurui/input";
import { Label } from "nurui/label";

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@company.com" required />
```

More in docs → **Components**.

---

## 🎨 Theming

Nurui exposes **CSS variables** and **design tokens** so you can integrate with your branding.

```css
/* globals.css */
:root {
  --nurui-radius: 0.75rem;
  --nurui-primary: #9e7aff;
  --nurui-primary-fg: #ffffff;
  --nurui-bg: #ffffff;
  --nurui-fg: #0f1222;
}

.dark {
  --nurui-bg: #0b0b11;
  --nurui-fg: #e7e8f1;
  --nurui-primary: #fe8bbb;
}
```

Most components accept `className`, `style`, and `asChild` (for polymorphism) so you can fully control rendering.

---

## ♿ Accessibility

- Keyboard navigable controls (Tab/Shift+Tab, Arrow keys)
- Proper ARIA labels/roles by default
- Focus management for dialogs, menus, and overlays
- Reduced motion friendly where animations exist

---

## 🧠 SSR & RSC Notes

- Works with **Next.js App Router** (server components where possible)
- **Hydration‑safe** patterns (no `Date.now()` surprises)
- Guards around browser‑only APIs; mark client components where required

---

## 📦 Import Paths

```tsx
// granular imports (recommended for tree‑shaking)
import { Button } from "nurui/button";
import { Card } from "nurui/card";

// or library root (simple, but larger bundle)
import { Button, Card } from "nurui";
```

---

## 🧪 Testing

Nurui uses **Vitest/Jest + React Testing Library**.
Scaffolded components include example tests:

```bash
pnpm test
# or
yarn test
```

---

## 🔧 Project Setup (Local Dev)

```bash
# 1) Clone
git clone https://github.com/afsar-dev/Nurui.git
cd Nurui

# 2) Env
echo "NODE_ENV=development" > .env

# 3) Install
yarn install

# 4) Dev server
yarn dev
# http://localhost:3000
```

---

## 🔒 Security

Found a vulnerability? Please open a **private advisory** or email the maintainer.
We follow responsible disclosure. Security fixes are prioritized.

---

## 🗺️ Roadmap

- [ ] More headless primitives (Listbox, Combobox, Command)
- [ ] DataGrid (virtualized)
- [ ] Theme generator & tokens inspector
- [ ] Design kit exports (Figma)
- [ ] i18n props & docs

Have ideas? Open a discussion!

---

## 🤝 Contributing

We love contributions!

1. Fork the repo
2. Create a feature branch: `feat/awesome-thing`
3. Commit with conventional messages
4. Open a PR with a clear, reproducible demo

See **[CONTRIBUTING.md](https://github.com/afsar-dev/Nurui/blob/main/CONTRIBUTING.md)**.

---

## 📄 License

Licensed under the **MIT License**.
See **[LICENSE](https://github.com/afsar-dev/Nurui/blob/main/LICENSE)**.

---

## 👤 Author

**Md Afsar Mahmud** — Full Stack Developer
[LinkedIn](https://www.linkedin.com/in/md-afsar-mahmud) •
[HackerRank](https://www.hackerrank.com/profile/mdafsar)
