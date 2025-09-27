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

• gradient-button
• border-button
• shiny-card
• spotlight-card
• contact-form
• video-modal
• gradient-hero
• spotlight-hero
• animated-pricing
• project-showcase
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
