export const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "the",
  "for",
  "to",
  "in",
  "on",
  "at",
  "of",
  "is",
  "are",
  "am",
  "be",
  "was",
  "were",
  "it",
  "its",
  "that",
  "this",
  "with",
  "as",
  "by",
  "from",
  "or",
  "if",
  "then",
  "than",
  "so",
  "but",
  "not",
  "no",
  "we",
  "you",
  "i",
  "your",
  "our",
  "they",
  "he",
  "she",
  "them",
  "his",
  "her",
  "their",
  "my",
  "me",
  "us",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "can",
  "could",
  "should",
  "would",
  "will",
  "just",
  "about",
  "into",
  "over",
  "under",
  "out",
  "up",
  "down",
  "again",
  "more",
  "most",
  "some",
  "such",
  "only",
  "own",
  "same",
  "other",
  "any",
  "each",
  "few",
]);

export function normalizeLF(s: string) {
  return s.replace(/\r\n?/g, "\n");
}

export function trimAll(s: string) {
  return s.trim();
}

export function collapseSpaces(s: string) {
  return s
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

export function removePunctuation(s: string) {
  return s.replace(/[^\p{L}\p{N}\s]/gu, "");
}

export function normalizeQuotes(s: string) {
  return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/—|–/g, "-");
}

export function removeDiacritics(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function wordsFrom(s: string) {
  return s.match(/[\p{L}\p{N}]+/gu) || [];
}

export function toCamel(words: string[]) {
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join("");
}

export function toPascal(words: string[]) {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

export function toSnake(words: string[]) {
  return words.map((w) => w.toLowerCase()).join("_");
}

export function toKebab(words: string[]) {
  return words.map((w) => w.toLowerCase()).join("-");
}

export function toConstant(words: string[]) {
  return words.map((w) => w.toUpperCase()).join("_");
}

export function toCapitalized(s: string) {
  return s.replace(
    /\b(\p{L})(\p{L}*)/gu,
    (_, a: string, b: string) => a.toUpperCase() + b.toLowerCase(),
  );
}

export function toAlternating(s: string) {
  let i = 0;
  return s.replace(/./g, (ch) => {
    if (!/\S/.test(ch)) return ch;
    const out = i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase();
    i++;
    return out;
  });
}

export function toInvert(s: string) {
  return s.replace(/\p{L}/gu, (ch) =>
    ch === ch.toLowerCase() ? ch.toUpperCase() : ch.toLowerCase(),
  );
}

export function toSentenceCase(s: string) {
  const text = s.toLowerCase();
  return text.replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gmu, (m) => m.toUpperCase());
}

export function toTitleCase(s: string) {
  return s.toLowerCase().replace(/\b(\p{L}[\p{L}\p{N}'’]*)\b/gu, (word, _grp, offset, full) => {
    const isFirst = offset === 0;
    const isLast = offset + word.length === full.length;
    const prev = full.slice(Math.max(0, offset - 2), offset);
    const afterPunct = /[-–—:;.!?]\s?$/.test(prev);
    const lw = word.toLowerCase();
    if (!isFirst && !isLast && !afterPunct && SMALL_WORDS.has(lw)) return lw;
    return lw.charAt(0).toUpperCase() + lw.slice(1);
  });
}

export function applyCase(mode: CaseMode, s: string) {
  switch (mode) {
    case "upper":
      return s.toUpperCase();
    case "lower":
      return s.toLowerCase();
    case "title":
      return toTitleCase(s);
    case "sentence":
      return toSentenceCase(s);
    case "camel":
      return toCamel(wordsFrom(s));
    case "pascal":
      return toPascal(wordsFrom(s));
    case "snake":
      return toSnake(wordsFrom(s));
    case "kebab":
      return toKebab(wordsFrom(s));
    case "constant":
      return toConstant(wordsFrom(s));
    case "capitalized":
      return toCapitalized(s);
    case "alternating":
      return toAlternating(s);
    case "invert":
      return toInvert(s);
  }
}

export function runPipeline(s: string, toggles: Record<PipelineToggle, boolean>) {
  let out = normalizeLF(s);
  if (toggles.trim) out = trimAll(out);
  if (toggles.collapseSpaces) out = collapseSpaces(out);
  if (toggles.normalizeQuotes) out = normalizeQuotes(out);
  if (toggles.removeDiacritics) out = removeDiacritics(out);
  if (toggles.removePunctuation) out = removePunctuation(out);
  return out;
}
