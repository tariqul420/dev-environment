const UNITS: { label: string; value: Unit; factor: number }[] = [
  { label: "Seconds (10 digits)", value: "seconds", factor: 1_000 },
  { label: "Milliseconds (13 digits)", value: "milliseconds", factor: 1 },
  { label: "Microseconds (16 digits)", value: "microseconds", factor: 1 / 1_000 },
  { label: "Nanoseconds (19 digits)", value: "nanoseconds", factor: 1 / 1_000_000 },
];

const TZ_PRESETS = [
  "local",
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dhaka",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

type PresetTz = (typeof TZ_PRESETS)[number];

function isPresetTz(x: string): x is PresetTz {
  return (TZ_PRESETS as readonly string[]).includes(x);
}

function clampIntString(s: string, maxLen = 32) {
  return s.replace(/[^\d-]/g, "").slice(0, maxLen);
}

function detectUnit(raw: string): Unit | null {
  const len = raw.replace(/^-/, "").length;
  if (len === 10) return "seconds";
  if (len === 13) return "milliseconds";
  if (len === 16) return "microseconds";
  if (len === 19) return "nanoseconds";
  return null;
}

function toMsFromEpoch(raw: string, unit: Unit): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;

  const match = UNITS.find((u) => u.value === unit);
  if (!match) return null;

  return Math.trunc(n * match.factor);
}

function safeDate(d: number | Date | null): Date | null {
  if (d == null) return null;
  const dt = d instanceof Date ? d : new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function fmtInTz(d: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timeZone === "local" ? undefined : timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  } catch {
    return d.toString();
  }
}

function shareUrl(params: Record<string, string>) {
  const sp = new URLSearchParams(params);
  return `${location.origin}${location.pathname}?${sp.toString()}`;
}
