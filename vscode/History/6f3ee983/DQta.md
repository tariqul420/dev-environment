# Nurui CLI

Use the Nurui CLI to quickly list and add UI components to your project.

---

## Commands

### **list**

View all available components.

```bash
npx nurui list
```

---

### **add**

Add a component to your project.

```bash
npx nurui add [component]
```

Example:

```bash
npx nurui add gradient-button
```

Run without a component name to see the full list:

```bash
npx nurui add
```

---

## Behind the Scenes

When you run:

```bash
npx nurui add gradient-button
```

The CLI will:

1. **Fetch the component registry** from GitHub.
2. **Find the matching component** by name.
3. **Ask for your preferred language** (TypeScript `.tsx` or JavaScript `.jsx`).
4. **Download all files** (components + styles) into:
   - `components/nurui/`
   - `components/nurui/styles/`

5. **Create `lib/utils`** (if missing) with `cn` utility.
6. **Convert `.tsx` → `.jsx`** if JavaScript selected.
7. **Install required dependencies** using your package manager.

---

### Minimal Code Flow

```js
// Fetch registry
const registry = await fetchRegistry();

// Match component
const match = registry.items.find((item) => item.name === componentName);

// Download files
for (const file of match.files) {
  await downloadFileFromGitHub(file.path);
}

// Create utils
if (!fs.existsSync(cnPath)) {
  await fs.promises.writeFile(cnPath, cnContent[language]);
}

// Install dependencies
if (match.dependencies.length) {
  await execa(pm, ["add", ...match.dependencies]);
}
```
