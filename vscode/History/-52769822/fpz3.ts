// hooks/use-auto-preview.ts
import * as React from "react";

type UseAutoPreviewResult = {
  previewUrl: string | null;
  previewSize: number | null;
  previewBusy: boolean;
  clearPreview: () => void;
};

export function useAutoPreview(
  // Caller should memoize `generate` with useCallback([...your inputs...])
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

  // keep latest clear in a ref for unmount cleanup without deps churn
  const clearRef = React.useRef(clear);
  React.useEffect(() => {
    clearRef.current = clear;
  }, [clear]);

  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setBusy(true);
      try {
        const blob = await generate();
        clear();
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
  }, [generate, debounceMs, clear]);

  // revoke on unmount
  React.useEffect(() => {
    return () => clearRef.current();
  }, []);

  return { previewUrl: url, previewSize: size, previewBusy: busy, clearPreview: clear };
}
