// hooks/use-auto-preview.ts
import * as React from "react";

type UseAutoPreviewResult = {
  previewUrl: string | null;
  previewSize: number | null;
  previewBusy: boolean;
  clearPreview: () => void;
};

/** Stable serializer that turns arbitrary deps into a single string key. */
function depKey(val: unknown): string {
  const t = typeof val;
  if (val === null) return "null";
  if (t === "undefined") return "u:undefined";
  if (t === "function") return `f:${(val as Function).name || "anon"}:${String(val)}`;
  if (t === "object") {
    try {
      // stable JSON (sorted keys) for plain objects/arrays
      return `o:${JSON.stringify(val, Object.keys(val as Record<string, unknown>).sort())}`;
    } catch {
      return `o:[unserializable:${Object.prototype.toString.call(val)}]`;
    }
  }
  return `${t}:${String(val)}`;
}

/**
 * Debounced preview generator.
 * - `inputs`: anything that should trigger regeneration (values, objects, functions).
 *   We hash them into a single stable signature so the effect deps length stays constant.
 * - `generate`: returns a Blob (or null) to preview.
 */
export function useAutoPreview(
  inputs: React.DependencyList,
  generate: () => Promise<Blob | null>,
  debounceMs = 350,
): UseAutoPreviewResult {
  const [url, setUrl] = React.useState<string | null>(null);
  const [size, setSize] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = React.useCallback(() => {
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setSize(null);
  }, [url]);

  // Keep the latest clear in a ref; use this in the unmount cleanup so deps can be [].
  const clearRef = React.useRef(clear);
  React.useEffect(() => {
    clearRef.current = clear;
  }, [clear]);

  // Build a single, constant-length dependency: the signature string.
  const signature = React.useMemo(() => inputs.map(depKey).join("|"), [inputs]);

  // Debounced (re)generation whenever signature / generate / debounceMs changes.
  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setBusy(true);
      try {
        const blob = await generate();
        clear(); // revoke previous URL before setting a new one
        if (blob) {
          const nextUrl = URL.createObjectURL(blob);
          setUrl(nextUrl);
          setSize(blob.size);
        }
      } finally {
        setBusy(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generate, debounceMs, signature, clear]);

  // Revoke on unmount without changing the deps length.
  React.useEffect(() => {
    return () => {
      clearRef.current();
    };
  }, []);

  return { previewUrl: url, previewSize: size, previewBusy: busy, clearPreview: clear };
}
