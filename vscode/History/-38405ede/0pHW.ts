export function getShortReferral(full: string): string {
  if (!full || full.toLowerCase() === "direct") return "Direct";

  const source = full.split(":")[0]?.trim().toLowerCase();

  switch (source) {
    case "facebook":
      return "Facebook";
    case "tiktok":
      return "Tiktok";
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "referral":
      return "Referral";
    case "utm":
      return "UTM";
    default:
      return capitalizeFirst(source || "Other");
  }
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
