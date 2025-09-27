// app/tools/(tools)/dev/yaml-json/page.tsx
"use client";

import { Braces, Code2, Download, Info, RefreshCw, Settings2 } from "lucide-react";
import React from "react";
import {
  ActionButton,
  CopyButton,
  ExportTextButton,
  ResetButton,
} from "@/components/shared/action-buttons";
import InputField from "@/components/shared/form-fields/input-field";
import SelectField from "@/components/shared/form-fields/select-field";
import SwitchRow from "@/components/shared/form-fields/switch-row";
import TextareaField from "@/components/shared/form-fields/textarea-field";
import ToolPageHeader from "@/components/shared/tool-page-header";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */
type Direction = "auto" | "yaml-to-json" | "json-to-yaml";

type YamlLib = {
  load: (src: string) => unknown;
  dump: (obj: unknown, opts?: Record<string, unknown>) => string;
  loadAll?: (src: string, iterator?: (doc: unknown) => void) => unknown;
};

/* -------------------------------------------------------------------------- */
/*                                Small helpers                               */
/* -------------------------------------------------------------------------- */

// Debounced effect that uses an ARRAY LITERAL dependency list at call sites.
function useDebounced(fn: () => void, delay: number, deps: React.DependencyList): void {
  React.useEffect(() => {
    const t = window.setTimeout(fn, delay);
    return () => window.clearTimeout(t);
    // deps is included by spreading at call sites, so exhaustive-deps is satisfied there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);
}

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = React.useState<T>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [key, state]);
  return [state, setState] as const;
}

/* -------------------------------------------------------------------------- */
/*                                Page Component                              */
/* -------------------------------------------------------------------------- */

export default function Page() {
  return <YamlJsonClient />;
}

function YamlJsonClient() {
  /* ------------------------------- js-yaml lib ------------------------------ */
  const [yamlLib, setYamlLib] = React.useState<YamlLib | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import("js-yaml");
      if (mounted) {
        setYamlLib({
          load: mod.load as YamlLib["load"],
          dump: mod.dump as YamlLib["dump"],
          loadAll: mod.loadAll as YamlLib["loadAll"],
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------------- IO ----------------------------------- */
  const [input, setInput] = usePersistentState<string>("yamljson.input", "");
  const [output, setOutput] = React.useState<string>("");

  /* -------------------------------- Options -------------------------------- */
  const [direction, setDirection] = usePersistentState<Direction>("yamljson.direction", "auto");
  const [autoRun, setAutoRun] = usePersistentState<boolean>("yamljson.auto", true);

  // JSON formatting
  const [jsonSpaces, setJsonSpaces] = usePersistentState<number>("yamljson.jsonSpaces", 2);
  const [jsonSortKeys, setJsonSortKeys] = usePersistentState<boolean>("yamljson.jsonSort", false);

  // YAML formatting
  const [yamlFlow, setYamlFlow] = usePersistentState<boolean>("yamljson.yamlFlow", false);
  const [yamlLineWidth, setYamlLineWidth] = usePersistentState<number>("yamljson.yamlWidth", 80);
  const [yamlSortKeys, setYamlSortKeys] = usePersistentState<boolean>("yamljson.yamlSort", false);
  const [yamlMultiDocs, setYamlMultiDocs] = usePersistentState<boolean>(
    "yamljson.yamlMulti",
    false,
  );

  const [error, setError] = React.useState<string | null>(null);

  /* -------------------------- Direction + formatting ------------------------ */
  const detectDirection = React.useCallback((s: string): Direction => {
    const t = s.trim();
    if (!t) return "auto";
    if (/^[\s\n]*[{[]/.test(t)) return "json-to-yaml";
    if (/^---\s|:\s|-\s/.test(t)) return "yaml-to-json";
    try {
      JSON.parse(t);
      return "json-to-yaml";
    } catch {
      return "yaml-to-json";
    }
  }, []);

  const normalizeKeys = React.useCallback(
    (val: unknown): unknown => {
      if (!jsonSortKeys && !yamlSortKeys) return val;
      const sort = (x: unknown): unknown => {
        if (Array.isArray(x)) return x.map(sort);
        if (x && typeof x === "object") {
          const obj = x as Record<string, unknown>;
          return Object.fromEntries(
            Object.keys(obj)
              .sort((a, b) => a.localeCompare(b))
              .map((k) => [k, sort(obj[k])]),
          );
        }
        return x;
      };
      return sort(val);
    },
    [jsonSortKeys, yamlSortKeys],
  );

  const toYaml = React.useCallback(
    (obj: unknown): string => {
      if (!yamlLib) return "";
      return yamlLib.dump(normalizeKeys(obj), {
        noRefs: true,
        lineWidth: yamlLineWidth || 80,
        flowLevel: yamlFlow ? 0 : -1,
        sortKeys: yamlSortKeys,
      } as any);
    },
    [yamlLib, normalizeKeys, yamlLineWidth, yamlFlow, yamlSortKeys],
  );

  const toJson = React.useCallback(
    (obj: unknown): string => JSON.stringify(normalizeKeys(obj), null, Math.max(0, jsonSpaces)),
    [normalizeKeys, jsonSpaces],
  );

  /* -------------------------------- Convert -------------------------------- */
  const doConvert = React.useCallback(() => {
    const txt = input.trim();
    if (!txt) {
      setError(null);
      setOutput("");
      return;
    }
    setError(null);

    try {
      const dir: Direction = direction === "auto" ? detectDirection(txt) : direction;

      if (dir === "yaml-to-json") {
        if (!yamlLib) return;
        if (yamlMultiDocs && yamlLib.loadAll) {
          const docs: unknown[] = [];
          yamlLib.loadAll(txt, (doc: unknown) => docs.push(doc));
          setOutput(toJson(docs));
        } else {
          const obj = yamlLib.load(txt);
          setOutput(toJson(obj));
        }
      } else {
        const obj = JSON.parse(txt);
        setOutput(toYaml(obj));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setOutput("");
    }
  }, [input, direction, detectDirection, yamlLib, yamlMultiDocs, toJson, toYaml]);

  // Debounced auto-run (deps provided as ARRAY LITERAL)
  useDebounced(
    () => {
      if (autoRun && yamlLib) doConvert();
    },
    250,
    [
      autoRun,
      yamlLib,
      input,
      direction,
      jsonSpaces,
      jsonSortKeys,
      yamlFlow,
      yamlLineWidth,
      yamlSortKeys,
      yamlMultiDocs,
      doConvert,
    ],
  );

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "enter") {
        e.preventDefault();
        doConvert();
      }
      if ((e.metaKey || e.ctrlKey) && key === "b") {
        e.preventDefault();
        setJsonSpaces((n) => (n ? 0 : 2));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doConvert]);

  /* --------------------------------- Samples -------------------------------- */
  const sampleYaml = `---
app: ToolsHub
version: 1.0
active: true
tags:
  - dev
  - utils
  - converter
config:
  theme: dark
  options:
    autoSave: true
    lineWidth: 120
users:
  - id: 1
    name: Alice
    roles: [admin, editor]
  - id: 2
    name: Bob
    roles:
      - viewer
      - tester
---
# Another YAML document
service: API
endpoints:
  - path: /login
    method: POST
  - path: /logout
    method: GET
`;

  const sampleJSON = `[
  {
    "id": 1,
    "name": "Alice",
    "active": true,
    "roles": ["admin", "editor"],
    "profile": { "email": "alice@example.com", "age": 30 }
  },
  {
    "id": 2,
    "name": "Bob",
    "active": false,
    "roles": ["viewer", "tester"],
    "profile": { "email": "bob@example.com", "age": 25 }
  }
]`;

  /* --------------------------------- Export -------------------------------- */
  const exportPayload = React.useMemo(
    () => ({
      input,
      direction,
      options: {
        jsonSpaces,
        jsonSortKeys,
        yamlFlow,
        yamlLineWidth,
        yamlSortKeys,
        yamlMultiDocs,
      },
      output,
      generatedAt: new Date().toISOString(),
    }),
    [
      input,
      direction,
      jsonSpaces,
      jsonSortKeys,
      yamlFlow,
      yamlLineWidth,
      yamlSortKeys,
      yamlMultiDocs,
      output,
    ],
  );

  /* --------------------------------- Reset --------------------------------- */
  const resetAll = () => {
    setInput("");
    setOutput("");
    setDirection("auto");
    setAutoRun(true);
    setJsonSpaces(2);
    setJsonSortKeys(false);
    setYamlFlow(false);
    setYamlLineWidth(80);
    setYamlSortKeys(false);
    setYamlMultiDocs(false);
    setError(null);
  };

  /* ---------------------------------- UI ----------------------------------- */
  return (
    <>
      <ToolPageHeader
        title="YAML ⇄ JSON"
        description="Convert YAML to JSON and back. Supports multi-doc YAML, pretty/minified JSON, sorting, and YAML flow style."
        icon={Code2}
        actions={
          <>
            <ResetButton onClick={resetAll} />
            <ExportTextButton
              variant="default"
              icon={Download}
              label="Export Session"
              filename="yaml-json-session.json"
              getText={() => JSON.stringify(exportPayload, null, 2)}
            />
          </>
        }
      />

      <GlassCard>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {/* Left column: editors */}
          <div className="lg:col-span-2 space-y-3">
            <TextareaField
              id="input"
              placeholder="Paste YAML or JSON here…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              textareaClassName="min-h-[320px]"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <ActionButton
                icon={RefreshCw}
                label="Trim Input"
                onClick={() => setInput((s) => s.trim())}
              />
              <InputField
                type="file"
                fileButtonLabel="Import JSON"
                accept="application/json"
                onFilesChange={async (files) => {
                  const f = files?.[0];
                  if (!f) return;
                  const txt = await f.text();
                  setDirection("json-to-yaml");
                  setInput(txt);
                }}
              />
              <InputField
                type="file"
                fileButtonLabel="Import YAML"
                accept=".yaml,.yml,text/yaml,text/plain"
                onFilesChange={async (files) => {
                  const f = files?.[0];
                  if (!f) return;
                  const txt = await f.text();
                  setDirection("yaml-to-json");
                  setInput(txt);
                }}
              />
              <ActionButton
                label="Sample YAML"
                icon={Braces}
                onClick={() => {
                  setInput(sampleYaml);
                  setDirection("yaml-to-json");
                }}
              />
              <ActionButton
                label="Sample JSON"
                icon={Braces}
                onClick={() => {
                  setInput(sampleJSON);
                  setDirection("json-to-yaml");
                }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 items-end">
              <SelectField
                id="direction"
                label="Direction"
                value={direction}
                onValueChange={(v) => setDirection(v as Direction)}
                options={[
                  { value: "auto", label: "Auto-detect" },
                  { value: "yaml-to-json", label: "YAML → JSON" },
                  { value: "json-to-yaml", label: "JSON → YAML" },
                ]}
              />
              <SwitchRow
                className="h-fit"
                label="Auto-run"
                checked={autoRun}
                onCheckedChange={setAutoRun}
              />
            </div>

            {error && (
              <div className="mt-2 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-destructive">
                <Info className="mt-0.5 h-4 w-4" />
                <div className="text-sm">{error}</div>
              </div>
            )}
          </div>

          {/* Right column: options */}
          <div className="rounded-lg border p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <div className="text-sm font-medium">Options</div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-medium opacity-80">JSON Output</div>
              <InputField
                id="jsonSpaces"
                type="number"
                label="Spaces"
                min={0}
                max={8}
                value={String(jsonSpaces)}
                onChange={(e) => setJsonSpaces(Math.max(0, Number(e.target.value) || 0))}
              />
              <SwitchRow
                label="Sort keys (JSON)"
                checked={jsonSortKeys}
                onCheckedChange={setJsonSortKeys}
              />
            </div>

            <Separator className="my-2" />

            <div className="grid gap-2">
              <div className="text-xs font-medium opacity-80">YAML Output</div>
              <SwitchRow label="Flow style" checked={yamlFlow} onCheckedChange={setYamlFlow} />
              <InputField
                id="yamlWidth"
                type="number"
                label="Line width"
                min={40}
                max={200}
                value={String(yamlLineWidth)}
                onChange={(e) =>
                  setYamlLineWidth(Math.min(200, Math.max(40, Number(e.target.value) || 80)))
                }
              />
              <SwitchRow
                label="Sort keys (YAML)"
                checked={yamlSortKeys}
                onCheckedChange={setYamlSortKeys}
              />
              <SwitchRow
                label="Allow multi-doc YAML (---)"
                checked={yamlMultiDocs}
                onCheckedChange={setYamlMultiDocs}
              />
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator className="my-4" />

      {/* Output */}
      <GlassCard>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Output</CardTitle>
          <div className="flex gap-2">
            {/* Assuming CopyButton accepts a string or a getter; adjust if your prop is different */}
            <CopyButton getText={output} />
            <ExportTextButton
              variant="default"
              icon={Download}
              label="Download"
              filename="converted.txt"
              getText={() => output}
              disabled={!output}
            />
          </div>
        </CardHeader>
        <CardContent>
          <TextareaField
            id="output"
            value={output}
            readOnly
            autoResize
            textareaClassName="min-h-[220px]"
          />
        </CardContent>
      </GlassCard>
    </>
  );
}
