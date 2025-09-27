// Base64 Encoder / Decoder
export type Mode = "encode" | "decode";
export type TabKey = "text" | "file";

export type FileInfo = {
  name: string;
  size: number;
  type: string;
};

// Case Converter
export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "capitalized"
  | "alternating"
  | "invert";

export type PipelineToggle =
  | "trim"
  | "collapseSpaces"
  | "removePunctuation"
  | "normalizeQuotes"
  | "removeDiacritics";

// slugify
export type DelimiterChar = "-" | "_" | "";
export type DelimiterKey = "dash" | "underscore" | "none";
export type Mode = "single" | "batch";

export type Options = {
  delimiter: DelimiterChar;
  lowercase: boolean;
  trim: boolean;
  transliterate: boolean;
  collapse: boolean;
  preserveUnderscore: boolean;
  keepNumbers: boolean;
  maxLen: number;
  stopwords: string[];
  customMap: Record<string, string>;
};

// word counter
export type DensityRow = { word: string; count: number; percent: number };

// Text Clear
export type CaseMode = "none" | "lower" | "upper" | "sentence" | "title";
