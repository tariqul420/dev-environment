// hooks/use-auto-preview.ts
import * as React from "react";

type UseAutoPreviewResult = {
  previewUrl: string | null;
  previewSize: number | null;
  previewBusy: boolean;
  clearPreview: () => void;
};

// Overloads
export function useAutoPreview(
  generate: () => Promise<Blob | null>,
  debounceMs?: number,
): UseAutoPreviewResult;
export function useAutoPreview(
  deps: React.DependencyList,
  generate: () => Promise<Blob | null>,
  debounceMs?: number,
): UseAutoPreviewResult;

// Impl
export function useAutoPreview(
  arg1: React.DependencyList | (() => Promise<Blob | null>),
  arg2?: number | (() => Promise<Blob | null>),
  arg3?: number,
): UseAutoPreviewResult {
  const [url, setUrl] = React.useState<string | null>(null);
  const [size, setSize] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normalize args (support both signatures)
  let generateFn: () => Promise<Blob | null>;
  let debounceMs = 350;

  if (typeof arg1 === "function") {
    // New signature: (generate, debounceMs?)
    generateFn = arg1;
    if (typeof arg2 === "number") debounceMs = arg2;
  } else {
    // Legacy: (deps, generate, debounceMs?)
    const deps = Array.isArray(arg1) ? arg1 : [];
    const gen = arg2 as (() => Promise<Blob | null>) | undefined;
    if (typeof gen !== "function") {
      throw new Error("useAutoPreview: expected a generate() function as the second argument.");
    }
    generateFn = React.useCallback(gen, deps);
    if (typeof arg3 === "number") debounceMs = arg3;
  }

  const clear = React.useCallback(() => {
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setSize(null);
  }, [url]);

  // Keep latest clear for unmount cleanup without deps churn
  const clearRef = React.useRef(clear);
  React.useEffect(() => {
    clearRef.current = clear;
  }, [clear]);

  // Debounced run
  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setBusy(true);
      try {
        const blob = await generateFn();
        clear();
        if (blob) {
          // revoke previous URL before setting new one
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
  }, [generateFn, debounceMs, clear]);

  // Revoke on unmount
  React.useEffect(() => {
    return () => clearRef.current();
  }, []);

  return { previewUrl: url, previewSize: size, previewBusy: busy, clearPreview: clear };
}
