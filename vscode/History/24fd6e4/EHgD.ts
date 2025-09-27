import { cookies } from "next/headers";

export function getServerLanguage(): "en" | "bn" {
  const cookieStore = cookies();
  const lang = cookieStore.get("language")?.value;

  return lang === "en" || lang === "bn" ? lang : "bn";
}
