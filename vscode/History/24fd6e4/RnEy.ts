import { cookies } from "next/headers";

export async function getServerLanguage(): Promise<"en" | "bn"> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value;
  return lang === "en" || lang === "bn" ? lang : "bn";
}
