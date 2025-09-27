export function getShortReferral(full: string): string {
  if (!full || full === "direct") return "Direct";

  const source = full.split(":")[0]?.toLowerCase();

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
      return "Other";
  }
}
