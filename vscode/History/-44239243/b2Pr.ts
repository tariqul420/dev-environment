import { setLanguage } from "@/lib/features/global/global-slice";
import { useAppDispatch } from "@/lib/hooks";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export function useLanguageHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookieLang = getCookie("language") as "en" | "bn" | undefined;
    if (cookieLang) {
      dispatch(setLanguage(cookieLang));
    }
  }, [dispatch]);
}
