import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

export function getServerLanguage(): "en" | "bn" {
  const cookieStore = cookies() as ReadonlyRequestCookies;
  const lang = cookieStore.get("language")?.value;
  return lang === "en" || lang === "bn" ? lang : "bn";
}
