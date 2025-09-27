export function normalizeEOL(s: string) {
  return s.replace(/\r\n?/g, "\n");
}

export function stripHtmlTags(s: string) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "");
}

export function decodeHtmlEntities(html: string) {
  if (!html) return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export function smartQuotesToStraight(s: string) {
  return s
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2026]/g, "...")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022]/g, "-");
}

export function removeEmojis(s: string) {
  return s.replace(/\p{Extended_Pictographic}|\p{Variation_Selector}/gu, "");
}

export function removeUrls(s: string) {
  return s.replace(/\b(?:https?:\/\/|www\.)\S+/gi, "");
}

export function removeEmails(s: string) {
  return s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "");
}

export function removePunctuation(s: string) {
  return s.replace(/[^\p{L}\p{N}\s]/gu, "");
}

export function removeDiacritics(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function keepAsciiOnly(s: string) {
  return s.replace(/[^\u0020-\u007E]+/g, "");
}

export function collapseSpaces(s: string) {
  return s.replace(/[ \t]+/g, " ");
}

export function collapseNewlines(s: string) {
  return s.replace(/\n{2,}/g, "\n");
}

export function trimEachLine(s: string) {
  return normalizeEOL(s)
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}

export function removeEmptyLines(s: string) {
  return normalizeEOL(s)
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .join("\n");
}

export function toSentenceCase(s: string) {
  const lower = s.toLowerCase();
  const parts = lower.split(/([.!?]+\s+)/);
  for (let i = 0; i < parts.length; i += 2) {
    const seg = parts[i];
    if (seg?.trim()) {
      parts[i] = seg.replace(/^[\s]*([a-zA-Z\p{L}])/u, (m) => m.toUpperCase());
    }
  }
  return parts.join("");
}

const LITTLE_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "vs",
  "via",
]);

export function toTitleCase(s: string) {
  const words = s.toLowerCase().split(/(\s+)/);
  return words
    .map((w, i) => {
      if (/^\s+$/.test(w)) return w;
      if (i === 0 || i === words.length - 1) return w.charAt(0).toUpperCase() + w.slice(1);
      return LITTLE_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join("");
}
