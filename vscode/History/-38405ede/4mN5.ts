export function getShortReferral(full: string): string {
  if (!full || full.toLowerCase() === "direct") return "Direct";

  const source = full.split(":")[0]?.trim().toLowerCase();

  if (source.includes("facebook")) return "Facebook";
  if (source.includes("tiktok")) return "Tiktok";
  if (source.includes("instagram")) return "Instagram";
  if (source.includes("youtube")) return "YouTube";
  if (source.includes("google")) return "Google";
  if (source.includes("referral")) return "Referral";
  if (source.includes("utm")) return "UTM";

  return capitalizeFirst(source || "Other");
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
