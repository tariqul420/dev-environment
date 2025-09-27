"use client";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


function SectionHeader({ title, desc }: { title: string; desc?: string }) {
return (
<div className="mb-6">
<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
{desc ? (
<p className="text-sm text-muted-foreground mt-1 max-w-2xl">{desc}</p>
) : null}
</div>
);
}


export default function BMIPage() {
const [heightValue, setHeightValue] = useState<string>("");
const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
const [weightValue, setWeightValue] = useState<string>("");
const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");


const parsed = useMemo(() => {
const h = parseFloat(heightValue);
const w = parseFloat(weightValue);
if (!h || !w || h <= 0 || w <= 0) return null;


const meters = heightUnit === "cm" ? h / 100 : h * 0.0254;
const kg = weightUnit === "kg" ? w : w * 0.45359237;
const bmi = kg / (meters * meters);


let category = "";
if (bmi < 18.5) category = "Underweight";
else if (bmi < 25) category = "Healthy";
else if (bmi < 30) category = "Overweight";
else category = "Obese";


const minKg = 18.5 * meters * meters;
const maxKg = 24.9 * meters * meters;


return { bmi, category, minKg, maxKg, meters };
}, [heightValue, heightUnit, weightValue, weightUnit]);


const pretty = (n: number, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : "-");


return (
<div className="container mx-auto max-w-3xl px-4 py-10">
<SectionHeader
title="BMI Calculator"
}