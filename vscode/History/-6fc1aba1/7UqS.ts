/** biome-ignore-all lint/correctness/noUnusedVariables: <> */
/** biome-ignore-all lint/suspicious/noRedeclare: <> */

type CleanOptions = {
  trim: boolean;
  collapseSpaces: boolean;
  stripLineBreaks: boolean;
  stripExtraBlankLines: boolean;
  normalizeQuotes: boolean;
  normalizeDashes: boolean;
  replaceEllipsis: boolean;
  tabsToSpaces: boolean;
  removeZeroWidth: boolean;
  removeUrls: boolean;
  removeEmojis: boolean;

  caseMode: "none" | "lower" | "upper" | "title" | "sentence";
  autoCleanOnPaste: boolean;
};

// Random Picker
type Entry = { id: string; name: string };
type HistoryItem = { id: string; ts: number; winner: string; pool: number };
