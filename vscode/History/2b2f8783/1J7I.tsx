// app/calc/bmi/page.tsx
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectItem value="kg">kg</SelectItem>
<SelectItem value="lb">lb</SelectItem>
</SelectContent>
</Select>
</div>
</div>
</div>


<Separator className="my-6" />


<div className="grid gap-4 sm:grid-cols-3">
<Stat label="BMI" value={parsed ? pretty(parsed.bmi, 1) : "—"} />
<Stat label="Category" value={parsed ? parsed.category : "—"} />
<Stat
label="Healthy Range"
value={
parsed
? `${pretty(parsed.minKg, 1)}–${pretty(parsed.maxKg, 1)} kg`
: "—"
}
/>
</div>


<div className="mt-6 text-xs text-muted-foreground">
<p>
* Categories based on WHO: Underweight (&lt;18.5), Healthy (18.5–24.9), Overweight (25–29.9), Obese (≥30).
</p>
</div>
</CardContent>
</Card>
</div>
);
}


function Stat({ label, value }: { label: string; value: string }) {
return (
<div className="rounded-xl border bg-card text-card-foreground p-4">
<div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
<div className="mt-1 text-2xl font-semibold">{value}</div>
</div>
);
}