# Nurui CLI

The **Nurui CLI** is a command-line tool for the [Nurui UI component library](https://nurui.vercel.app),  
used to **list**, **add**, and **scaffold components** into your project quickly.

---

## Installation

```bash
# npm
npm install -D nurui-cli

# pnpm
pnpm add -D nurui-cli

# bun
bun add -D nurui-cli

# yarn
yarn add -D nurui-cli
```

Run without install:

```bash
npx nurui <command>
```

---

## Commands

### `list`

Show all available components.

```bash
npx nurui list
```

### `add <name>`

Add a component from the catalog.

```bash
npx nurui add gradient-button
# → components/nurui/GradientButton.tsx
```

### `g component <Name>`

Generate a blank component scaffold.

```bash
npx nurui g component Alert
```

---

## Options

| Flag           | Description                       |
| -------------- | --------------------------------- |
| `--dir <path>` | Custom output directory           |
| `--js`         | Generate JavaScript instead of TS |
| `--overwrite`  | Replace existing files            |
| `--dry-run`    | Preview without writing files     |

---

## Examples

```bash
npx nurui list
npx nurui add gradient-button
npx nurui g component Banner --dir src/ui --js
```

---

## Tips

- Commit before using `--overwrite`
- Use `--dry-run` to preview changes
- Keep component names in **PascalCase**

---

## License

Part of the [Nurui UI](https://nurui.vercel.app) project. Licensed under [MIT](../../LICENSE).
