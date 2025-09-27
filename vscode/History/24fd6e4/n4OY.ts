import { cookies } from "next/headers";

export async function getServerLanguage(): "en" | "bn" {
  const cookieStore = await cookies();

  if (typeof cookieStore.get !== "function") return "bn";

  const lang = cookieStore.get("language")?.value;
  return lang === "en" || lang === "bn" ? lang : "bn";
}
