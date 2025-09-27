(byCat[it.cat] ||= []).push(it);
    }
    const orderedCatNames = [...new Set([...CATS, ...Object.keys(byCat)])];
    return orderedCatNames
      .filter((c) => byCat[c]?.length)
      .map((c) => ({
        cat: c,
        items: byCat[c].sort((a, b) => (a.must === b.must ? 0 : a.must ? -1 : 1)),
      }));
  }, [items, filter, query]);

  // stats
  const stats = React.useMemo(() => {
    const total = items.length;
    const packed = items.filter((x) => x.checked).length;
    const mustTotal = items.filter((x) => x.must).length;
    const mustRemaining = items.filter((x) => x.must && !x.checked).length;
    const pct = total ? Math.round((packed / total) * 100) : 0;
    return { total, packed, remaining: total - packed, mustTotal, mustRemaining, pct };
  }, [items]);

  // export/share
  const csvRows = React.useMemo(() => toCSVRows(items), [items]);

  const downloadJSON = React.useCallback(() => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "packing-list.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [items]);

  const importJSON = React.useCallback(async () => {
    const raw = window.prompt("Paste JSON exported from this tool:");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Item[];
      if (!Array.isArray(parsed)) throw new Error("Invalid JSON");
      const normalized = parsed.map((i) => ({
        id: i.id || uid(),
        cat: i.cat || "Misc",
        label: i.label || "Item",
        qty: i.qty ?? undefined,
        checked: !!i.checked,
        note: i.note ?? "",
        must: !!i.must,
      }));
      setItems(normalized);
    } catch {
      alert("Invalid JSON");
    }
  }, []);

  const shareUrl = React.useMemo(() => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(items)));
      const base = window.location.origin + window.location.pathname;
      return `${base}?list=${encoded}`;
    } catch {
      return window.location.href;
    }
  }, [items]);

  const tryLoadFromQueryOnce = React.useRef(false);
  React.useEffect(() => {
    if (tryLoadFromQueryOnce.current) return;
    tryLoadFromQueryOnce.current = true;
    const params = new URLSearchParams(window.location.search);
    const listParam = params.get("list");
    if (!listParam) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(atob(listParam))) as Item[];
      if (Array.isArray(parsed)) setItems(parsed.map((i) => ({ ...i, id: i.id || uid() })));
    } catch {
      // ignore invalid share link
    }
  }, []);

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <>
      <ToolPageHeader
        icon={Luggage}
        title="Packing Checklist"
        description="Template → tune → check off. Everything saves in your browser."
        actions={
          <>
            <ResetButton onClick={resetAll} />
            <ActionButton
              variant="default"
              icon={ClipboardList}
              label="Smart Fill"
              onClick={smartFill}
            />
          </>
        }
      />

      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Trip Settings</CardTitle>
          <CardDescription>
            Choose a template, trip length, and climate. Then hit Smart Fill.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SelectField
            label="Template"
            value={template}
            onValueChange={(v) => setTemplate(v as Template)}
            options={[
              { selectIcon: Backpack, value: "basic", label: "Basic" },
              { selectIcon: Briefcase, value: "business", label: "Business" },
              { selectIcon: Sun, value: "beach", label: "Beach" },
              { selectIcon: Mountain, value: "hiking", label: "Hiking" },
            ]}
          />

          <InputField
            label="Nights"
            type="number"
            min={0}
            value={nights}
            onChange={(e) => setNights(Math.max(0, Number(e.target.value) || 0))}
          />

          <SelectField
            label="Climate"
            value={climate}
            onValueChange={(v) => setClimate(v as Climate)}
            options={[
              { selectIcon: ThermometerSun, value: "mild", label: "Mild" },
              { selectIcon: Sun, value: "warm", label: "Warm" },
              { selectIcon: ThermometerSnowflake, value: "cold", label: "Cold" },
              { selectIcon: Umbrella, value: "rainy", label: "Rainy" },
            ]}
          />

          <div className="space-y-2">
            <Label>Quick add</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <SelectField
                value={quickCat}
                onValueChange={(v) => setQuickCat(String(v))}
                options={[...CATS, "Misc"].map((c) => ({ value: c, label: c }))}
              />
              <div className="sm:col-span-2">
                <InputField
                  placeholder="Item name"
                  value={quickLabel}
                  onChange={(e) => setQuickLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem(quickCat, quickLabel);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton
                size="sm"
                label="Add"
                icon={Plus}
                onClick={() => addItem(quickCat, quickLabel)}
              />
              <div className="flex-1" />
              <ActionButton
                size="sm"
                label="Docs +"
                onClick={() => addItem("Documents", "Custom doc")}
              />
              <ActionButton
                size="sm"
                label="Clothes +"
                onClick={() => addItem("Clothing", "Custom clothing")}
              />
              <ActionButton
                size="sm"
                label="Tech +"
                onClick={() => addItem("Tech", "Custom tech")}
              />
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator />

      <GlassCard className="sticky top-2 z-20 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <SelectField
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | "todo" | "must")}
            options={[
              { value: "all", label: "Show: All" },
              { value: "todo", label: "Show: To Do" },
              { value: "must", label: "Show: Essentials ★" },
            ]}
          />
          <InputField
            placeholder="Search items or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Total: {stats.total}</Badge>
          <Badge variant="outline">Packed: {stats.packed}</Badge>
          <Badge variant="outline">Left: {stats.remaining}</Badge>
          <Badge variant="outline">
            Essentials left: {stats.mustRemaining}/{stats.mustTotal}
          </Badge>
          <div
            className="relative h-2 w-28 overflow-hidden rounded-full bg-muted"
            aria-label={`Progress ${stats.pct}%`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
          <button
            type="button"
            className={cn(
              "text-xs rounded border px-2 py-1",
              dense ? "bg-primary/10 border-primary/40" : "hover:bg-accent",
            )}
            onClick={() => setDense((d) => !d)}
            aria-pressed={dense}
            title="Toggle compact rows"
          >
            {dense ? "Comfort" : "Compact"}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <ActionButton icon={Printer} label="Print" onClick={() => window.print()} />
          <ExportCSVButton
            filename="packing-list.csv"
            getRows={() => toCSVRows(items).map((r) => r.map(csvCell))}
            variant="outline"
          />
          <ActionButton icon={Download} label="Export JSON" onClick={downloadJSON} />
          <ActionButton icon={Upload} label="Import JSON" onClick={importJSON} />
          <CopyButton label="Copy Share Link" icon={Share2} getText={shareUrl} />
          <ActionButton
            icon={Trash2}
            variant="destructive"
            label="Clear completed"
            onClick={clearCompleted}
          />
        </div>
      </GlassCard>

      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Your List</CardTitle>
          <CardDescription>
            Check items as you pack. Quantities and notes save automatically.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No items. Try Smart Fill or add items with Quick add.
            </p>
          )}

          {filtered.map((group) => (
            <div key={group.cat}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium tracking-tight">{group.cat}</h3>
                <div className="flex gap-1">
                  <ActionButton
                    icon={CheckCheck}
                    variant="ghost"
                    size="sm"
                    label="Pack all"
                    onClick={() => packAllInCat(group.cat)}
                  />
                  <ActionButton
                    icon={Undo2}
                    variant="ghost"
                    size="sm"
                    label="Unpack all"
                    onClick={() => unpackAllInCat(group.cat)}
                  />
                  <ActionButton
                    icon={Plus}
                    variant="ghost"
                    size="sm"
                    label="Add"
                    onClick={() => addItem(group.cat, "Custom item")}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                {group.items.map((it) => (
                  <div
                    key={it.id}
                    className={cn(
                      "grid rounded-xl border p-3",
                      "gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]",
                      dense ? "py-2" : "py-3",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Checkbox
                        checked={!!it.checked}
                        onCheckedChange={(v) => toggleCheck(it.id, !!v)}
                        aria-label={`check ${it.label}`}
                      />
                      <span
                        className={cn(
                          "text-sm truncate",
                          it.checked && "line-through text-muted-foreground",
                        )}
                        title={it.label}
                      >
                        {it.label}
                      </span>
                      {it.must && (
                        <Badge variant="outline" className="ml-1 shrink-0">
                          ★
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
                      <InputField
                        label="Qty"
                        type="number"
                        min={0}
                        value={it.qty ?? ""}
                        onChange={(e) => updateQty(it.id, Number(e.target.value))}
                      />
                      <InputField
                        placeholder="Note (optional)"
                        value={it.note ?? ""}
                        onChange={(e) => updateNote(it.id, e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-end">
                      <ActionButton icon={Trash2} size="icon" onClick={() => removeItem(it.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </GlassCard>
    </>
  );
}
