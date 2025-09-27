type ToolItem = { title: string; url: string; description?: string; popular?: boolean };
type ToolCategory = {
  title: string;
  url: string;
  isActive?: boolean;
  items: ToolItem[];
};

const BASE_KEYWORDS = [
  "online tools",
  "free tools",
  "privacy friendly",
  "fast tools",
  "productivity tools",
  "all-in-one toolkit",
  "Bangladesh",
  "Tools Hub",
];

const GENERIC_INTENTS = [
  "convert",
  "compress",
  "optimize",
  "generate",
  "validate",
  "preview",
  "analyze",
  "calculate",
  "build",
  "format",
  "shorten",
  "expand",
  "compare",
];

function normalize(word: string) {
  return word.toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildDynamicKeywords(tools: ToolCategory[]) {
  const bag = new Set<string>();

  // Base & intents
  BASE_KEYWORDS.forEach((k) => bag.add(normalize(k)));
  GENERIC_INTENTS.forEach((k) => bag.add(normalize(k)));

  for (const cat of tools) {
    if (!cat?.items?.length) continue;
    bag.add(normalize(cat.title));
    bag.add(normalize(`${cat.title} tools`));
    for (const item of cat.items) {
      bag.add(normalize(item.title));
      bag.add(normalize(`${item.title} online`));
      bag.add(normalize(`${item.title} free`));
      // split common delimiters to catch variants (e.g., "UUID / NanoID Generator")
      item.title
        .split(/[\/,&\-]+/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((piece) => bag.add(normalize(piece)));
      // enrich with description tokens
      if (item.description) {
        item.description
          .split(/[^\w%+]+/g)
          .map((s) => s.trim())
          .filter((s) => s.length > 2)
          .forEach((tok) => bag.add(normalize(tok)));
      }
    }
  }

  // Return a tidy, deduped keyword array (keep first 200 to prevent bloat)
  return Array.from(bag).slice(0, 200);
}

/** Optionally merge with your existing static keywords */
export function mergeKeywords(staticKeywords: string[], dynamicKeywords: string[]) {
  const bag = new Set<string>();
  staticKeywords.forEach((k) => bag.add(normalize(k)));
  dynamicKeywords.forEach((k) => bag.add(normalize(k)));
  return Array.from(bag);
}

/** Helper to build a stronger site description without overstuffing */
export function siteDescriptionFallback(tools: ToolCategory[]) {
  const total = tools.reduce((n, c) => n + (c.items?.length || 0), 0);
  const cats = tools
    .map((c) => c.title)
    .slice(0, 6)
    .join(", ");
  return `Fast, free, privacy-friendly online tools across ${cats}${tools.length > 6 ? ", and more" : ""}. Explore ${total}+ handy utilities in one place.`;
}
