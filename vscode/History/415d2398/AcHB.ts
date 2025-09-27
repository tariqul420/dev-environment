/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

import type { TZ_PRESETS } from "@/lib/utils/dev/timestamp-converter";

// JSON Formatter
type IndentOpt = "2" | "4" | "tab";

// JWT Decoder & Verifier
type CopyWhich = "header" | "payload" | "token";

type JwtHeader = {
  alg?: string;
  kid?: string;
  typ?: string;
  [k: string]: unknown;
};

type JwtPayloadStd = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [k: string]: unknown;
};

type Status =
  | { state: "none" }
  | { state: "valid" | "expired" | "nbf"; exp?: number; iat?: number; nbf?: number };

// Regex Tester
type Flag = "g" | "i" | "m" | "s" | "u" | "y";
type MatchItem = {
  text: string;
  index: number;
  length: number;
  groups: Record<string, string | undefined>;
};

// Hash Generator
type AlgoKey = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
type ResultRow = { name: AlgoKey; value: string };

// Lorem Ipsum Generator
type GenOptions = {
  wordsPerParagraph: number;
  startWithClassic: boolean;
  punctuation: boolean;
  rng: () => number;
};

// Password Generator
type GenFlags = {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  requireEachSet: boolean;
};

// UUID & NanoID Generator
type Mode = "uuid" | "nanoid";
type UuidVersion = "v1" | "v4" | "v5" | "v7";

// Timestamp Converter
type Unit = "seconds" | "milliseconds" | "microseconds" | "nanoseconds";
type Direction = "toDate" | "toEpoch";
type PresetTz = (typeof TZ_PRESETS)[number];
