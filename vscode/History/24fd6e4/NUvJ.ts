export function getServerLanguage(): "en" | "bn" {
  const cookieStore = cookies();

  if (typeof cookieStore.get !== "function") return "bn"; // fallback

  const lang = cookieStore.get("language")?.value;
  return lang === "en" || lang === "bn" ? lang : "bn";
}
