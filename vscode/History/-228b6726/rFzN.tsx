"use client";

import {
  AlarmClock,
  Check,
  Download,
  ListTodo,
  Pause,
  Play,
  Plus,
  SquarePen,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ActionButton,
  CopyButton,
  ExportTextButton,
  ResetButton,
} from "@/components/shared/action-buttons";
import InputField from "@/components/shared/form-fields/input-field";
import TextareaField from "@/components/shared/form-fields/textarea-field";
import ToolPageHeader from "@/components/shared/tool-page-header";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card"; 
import { Label } from "@/components/ui/label";

// Types

type ActionItem = { id: string; task: string; owner?: string; due?: string; done?: boolean };

type Note = { id: string; ts: number; text: string };

type Meeting = {
  title: string;
  date: string;
  location?: string;
  attendees: string;
  agenda: string;
  notes: Note[];
  decisions: string;
  actions: ActionItem[];
};

// Helpers

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function fmtClock(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600)
    .toString()
    .padStart(2, "0");
  const mm = Math.floor((s % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function fmtStamp(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const DEFAULT: Meeting = {
  title: "Weekly Sync",
  date: new Date().toISOString().slice(0, 10),
  location: "",
  attendees: "",
  agenda: "",
  notes: [],
  decisions: "",
  actions: [],
};

export default function MeetingNotesClient() {
  const [data, setData] = useState<Meeting>(DEFAULT);
  const [running, setRunning] = useState(false);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [noteDraft, setNoteDraft] = useState("");

  // timer
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1000), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tools:meeting-notes");
      if (saved) setData(JSON.parse(saved));
      const savedClock = localStorage.getItem("tools:meeting-notes:clock");
      if (savedClock) {
        const obj = JSON.parse(savedClock) as { running: boolean; start: number; elapsed: number };
        setRunning(obj.running);
        setStartTs(obj.start);
        setElapsed(obj.elapsed || 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tools:meeting-notes", JSON.stringify(data));
    } catch {}
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "tools:meeting-notes:clock",
        JSON.stringify({ running, start: startTs, elapsed }),
      );
    } catch {}
  }, [running, startTs, elapsed]);

  const start = () => {
    setRunning(true);
    if (!startTs) setStartTs(Date.now());
  };
  const pause = () => setRunning(false);
  const resetClock = () => {
    setRunning(false);
    setStartTs(null);
    setElapsed(0);
  };

  const addNote = () => {
    if (!noteDraft.trim()) return;
    setData((d) => ({
      ...d,
      notes: [{ id: uid("note"), ts: Date.now(), text: noteDraft.trim() }, ...d.notes],
    }));
    setNoteDraft("");
  };

  const removeNote = (id: string) =>
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));

  const addAction = () =>
    setData((d) => ({
      ...d,
      actions: [{ id: uid("act"), task: "", owner: "", due: "", done: false }, ...d.actions],
    }));
  const updateAction = (id: string, patch: Partial<ActionItem>) =>
    setData((d) => ({
      ...d,
      actions: d.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  const removeAction = (id: string) =>
    setData((d) => ({ ...d, actions: d.actions.filter((a) => a.id !== id) }));

  const resetAll = () => {
    setData(DEFAULT);
    resetClock();
  };

   const md = `# ${data.title}\n\n- **Date:** ${data.date}\n- **Location:** ${data.location || "-"}\n- **Attendees:** ${data.attendees || "-"}\n\n## Agenda\n${
    data.agenda || "_(none)_"
  }\n\n## Notes\n${
    data.notes
      .slice()
      .reverse()
      .map((n) => `- [${fmtStamp(n.ts)}] ${n.text}`)
      .join("\n") || "_No notes_"
  }\n\n## Decisions\n${data.decisions || "_(none)_"}\n\n## Action Items\n${
    data.actions
      .slice()
      .reverse()
      .map(
        (a) =>
          `- [${a.done ? "x" : " "}] ${a.task} ${a.owner ? `(owner: ${a.owner})` : ""} ${a.due ? `(due: ${a.due})` : ""}`,
      )
      .join("\n") || "_None_"
  }\n`;

  // derived counts
  const openCount = useMemo(() => data.actions.filter((a) => !a.done).length, [data.actions]);

  return (
    <>
      <ToolPageHeader
        icon={SquarePen}
        title="Meeting Notes"
        description="Timestamped meeting notes with agenda, decisions & action items."
        actions={
          <>
            <ResetButton onClick={resetAll} />

            <ExportTextButton getText={() => md} />
          </>
        }
      />

      {/* Meeting meta */}
      <GlassCard className="shadow-sm print:shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
          <CardDescription>Title, date, location & attendees</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3">
            <InputField
              label="Title"
              id="title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Sprint Planning"
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Date"
                id="date"
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
              <InputField
                label="Location"
                id="location"
                value={data.location || ""}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                placeholder="Room 2A / Zoom"
              />
            </div>
            <InputField
              icon={Users}
              label="Attendees"
              id="attendees"
              value={data.attendees}
              onChange={(e) => setData({ ...data, attendees: e.target.value })}
              placeholder="Name1, Name2, ..."
            />
            <Badge variant="secondary" className="w-fit">
              {openCount} open actions
            </Badge>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <TextareaField
              label="Agenda"
              id="agenda"
              value={data.agenda}
              onChange={(e) => setData({ ...data, agenda: e.target.value })}
              placeholder="\u2022 Item 1\n\u2022 Item 2"
              textareaClassName="min-h-[200px]"
            />
          </div>
        </CardContent>
      </GlassCard>

      {/* Timer & quick note */}
      <GlassCard className="shadow-sm print:hidden">
        <CardHeader>
          <CardTitle className="text-base">Live Notes</CardTitle>
          <CardDescription>Use the timer and insert timestamp into your notes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <AlarmClock className="h-4 w-4" />
                <span className="font-mono">{fmtClock(elapsed)}</span>
              </div>
              {!running ? (
                <ActionButton variant="default" icon={Play} label="Play" onClick={start} />
              ) : (
                <ActionButton variant="default" icon={Pause} label="Pause" onClick={pause} />
              )}
              <ResetButton onClick={resetClock} />
            </div>
            <div className="text-xs text-muted-foreground">
              Tip: Press <kbd className="rounded border px-1">Ctrl</kbd>+
              <kbd className="rounded border px-1">M</kbd> to insert current time.
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-6">
            <div className="sm:col-span-5">
              <InputField
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Type a note and press Add"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addNote();
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
                    e.preventDefault();
                    const stamp = `[${fmtStamp(Date.now())}] `;
                    setNoteDraft((v) => stamp + v);
                  }
                }}
              />
            </div>
            <div className="sm:col-span-1 flex">
              <ActionButton
                variant="default"
                icon={Plus}
                label="Add"
                className="w-full"
                onClick={addNote}
              />
            </div>
          </div>
        </CardContent>
      </GlassCard>

      {/* Notes list */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
          <CardDescription>Newest first</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.notes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No notes yet. Use the box above to add one.
            </p>
          )}
          {data.notes.map((n) => (
            <div key={n.id} className="flex flex-col gap-2 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{fmtStamp(n.ts)}</span>
                <ActionButton
                  icon={Trash2}
                  size="icon"
                  onClick={() => removeNote(n.id)}
                  aria-label="Remove note"
                />
              </div>
              <div className="text-sm whitespace-pre-wrap">{n.text}</div>
            </div>
          ))}
        </CardContent>
      </GlassCard>

      {/* Decisions & Actions */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Decisions & Action Items</CardTitle>
          <CardDescription>Track outcomes and owners</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-2">
            <TextareaField
              label="Decisions"
              id="decisions"
              value={data.decisions}
              onChange={(e) => setData({ ...data, decisions: e.target.value })}
              placeholder="\u2022 Approve Q4 roadmap\n\u2022 Switch provider"
              textareaClassName="min-h-[140px]"
            />
          </div>
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Action Items</Label>
              <ActionButton icon={ListTodo} label="Add Action" onClick={addAction} />
            </div>
            {data.actions.length === 0 && (
              <p className="text-sm text-muted-foreground">No action items yet.</p>
            )}
            <div className="space-y-3">
              {data.actions.map((a) => (
                <div key={a.id} className="grid gap-2 border rounded-lg p-3 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <InputField
                      label="Task"
                      value={a.task}
                      onChange={(e) => updateAction(a.id, { task: e.target.value })}
                      placeholder="Task description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField
                      label="Owner"
                      value={a.owner || ""}
                      onChange={(e) => updateAction(a.id, { owner: e.target.value })}
                      placeholder="Owner"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <InputField
                      label="Due"
                      type="date"
                      value={a.due || ""}
                      onChange={(e) => updateAction(a.id, { due: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-start justify-end gap-2">
                    <ActionButton
                      icon={Check}
                      label={a.done ? "Done" : "Mark Done"}
                      variant={a.done ? "default" : "outline"}
                      onClick={() => updateAction(a.id, { done: !a.done })}
                    />
                    <ActionButton
                      icon={Trash2}
                      size="icon"
                      onClick={() => removeAction(a.id)}
                      aria-label="Remove action"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </GlassCard>

      {/* Preview */}
      <GlassCard className="shadow-sm print:shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>Print-friendly summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background/50 rounded-xl border p-6 print:bg-transparent print:border-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{data.title || "Meeting Notes"}</h2>
                <div className="text-sm text-muted-foreground">{data.location}</div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Date:</span> {data.date}
              </div>
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">Attendees</div>
                <div className="text-sm whitespace-pre-wrap">{data.attendees || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Agenda</div>
                <div className="text-sm whitespace-pre-wrap">{data.agenda || "-"}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-muted-foreground mb-1">Notes</div>
              {data.notes.length === 0 ? (
                <div className="text-sm text-muted-foreground">No notes.</div>
              ) : (
                <ul className="text-sm space-y-1">
                  {data.notes
                    .slice()
                    .reverse()
                    .map((n) => (
                      <li key={n.id}>
                        [{fmtStamp(n.ts)}] {n.text}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Decisions</div>
                <div className="text-sm whitespace-pre-wrap">{data.decisions || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Action Items</div>
                {data.actions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">None.</div>
                ) : (
                  <ul className="text-sm space-y-1">
                    {data.actions.map((a) => (
                      <li key={a.id}>
                        [{a.done ? "x" : " "}] {a.task} {a.owner ? `(owner: ${a.owner})` : ""}{" "}
                        {a.due ? `(due: ${a.due})` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              Generated with Tools Hub — Meeting Notes
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton label="Copy Header" getText={`# ${data.title}\nDate: ${data.date}\n\n`} />
            <ExportTextButton
              variant="default"
              label="Export Markdown"
              getText={() =>
                `# ${data.title}\n\n- **Date:** ${data.date}\n- **Location:** ${data.location || "-"}\n- **Attendees:** ${data.attendees || "-"}\n\n## Agenda\n${
                  data.agenda || "_(none)_"
                }\n\n## Notes\n${
                  data.notes
                    .slice()
                    .reverse()
                    .map((n) => `- [${fmtStamp(n.ts)}] ${n.text}`)
                    .join("\n") || "_No notes_"
                }\n\n## Decisions\n${data.decisions || "_(none)_"}\n\n## Action Items\n${
                  data.actions
                    .slice()
                    .reverse()
                    .map(
                      (a) =>
                        `- [${a.done ? "x" : " "}] ${a.task} ${a.owner ? `(owner: ${a.owner})` : ""} ${a.due ? `(due: ${a.due})` : ""}`,
                    )
                    .join("\n") || "_None_"
                }\n`
              }
            />
          </div>
        </CardContent>
      </GlassCard>
    </>
  );
}
