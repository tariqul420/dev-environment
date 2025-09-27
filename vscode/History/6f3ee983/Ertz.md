# Nurui CLI

Use the Nurui CLI to list and add components to your project.

---

## list

Use the `list` command to view all available components.

```bash
npx nurui list
```

Example output:

```
┌  Welcome to Nurui CLI
│
◇  📦 Available components:

• neobrutalism-faq
• premium-testimonial
• marquee-testimonial
• animated-pricing
• creative-pricing
• project-showcase
• animated-list
• progress-bar
• story
• terminal
• banner
• following-eye
• bars-background
• gradient-background
• jump-background
• virus-background
• magnet-button
• gradient-button
• border-button
• shadow-button
• text-button
• future-button
• playing-card
• info-card
• wave-card
• glowing-card
• dynamic-card
• spotlight-card
• shiny-card
• contact-form
• gaming-form
• singin-form
• flow-form
• video-modal
• gradient-hero
• waves-hero
• digital-hero
• research-hero
• spotlight-hero
• tech-hero
• gradient-text
• draw-cursor
• canvas-cursor
• hacker-cursor
• terminal-cursor
• splash-cursor
• code-cursor
• money-cursor
• electric-cursor
• ghost-cursor
• tech-cursor
• fire-cursor
• matrix-cursor
• retro-cursor
│
└  ✨ End of list.
```

---

## add

Use the `add` command to add a component to your project.
Downloads the component and styles, creates `lib/utils`, and installs required dependencies.

```bash
npx nurui add <component-name>
```

Example:

```bash
npx nurui add gradient-button
```

> Note: The `add` command **requires** a component name.
> If you run `npx nurui add` without a name, the CLI prints usage and exits.

---

## How it works (behind the scenes)

When you run:

```bash
npx nurui add gradient-button
```

1. Fetches the component registry from GitHub (`registry-cli.json`).
2. Finds `gradient-button` in the registry.
3. Prompts you to choose **TypeScript (.tsx)** or **JavaScript (.jsx)**.
4. Downloads files from the repo:
   - component files → `components/nurui/`
   - styles (`.css`) → `components/nurui/styles/`

5. Ensures `lib/utils.ts` or `lib/utils.js` exists (adds `cn` helper using `clsx` + `tailwind-merge`).
6. If JavaScript selected, transpiles `.tsx` → `.jsx` (TypeScript + Prettier).
7. Detects your package manager (`yarn` / `pnpm` / `bun` / `npm`) and installs any required dependencies for that component.
8. Prints a success summary.

---

## Minimal code flow (pseudo‑code)

```ts
// entry: npx nurui add <name>
assert(cmd === "add" && name, "Usage: npx nurui add <component>");

const lang = await promptLanguage(["ts", "js"]);
const registry = await fetchJSON(REGISTRY_URL);
const match = registry.items.find((x) => x.name === name);
assert(match, `Component '${name}' not found`);

ensureUtils(lang); // creates lib/utils.ts or lib/utils.js if missing

for (const f of match.files) {
  const raw = await download(BASE_URL + f.path); // fetch file
  const out = resolveOutPath(f, lang); // components/nurui/... or styles/...
  const code = needsTranspile(f, lang) ? tsxToJsx(raw) : raw;
  await write(out, prettierFormat(code)); // save to disk
}

if (match.dependencies?.length) {
  const pm = detectPM(); // yarn | pnpm | bun | npm
  await install(pm, match.dependencies); // execa(pm, ["add", ...deps]) or npm install
}
```

---

## Notes

- Run commands from your project **root**.
- Component names must exist in the official registry:
  `https://raw.githubusercontent.com/Mdafsarx/Nurui/main/registry-cli.json`
- Files are placed under `components/nurui/` and `components/nurui/styles/`.
- Internet connection required (downloads from GitHub raw URLs).

---

**License:** [MIT](../../LICENSE)
