"use client";
import { setReferral } from "@/lib/features/referral/referral-slice";
import { useAppDispatch } from "@/lib/hooks";
import logger from "@/lib/logger";
import { useEffect } from "react";

export function useInitialReferral() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const alreadySet = sessionStorage.getItem("initial_referral");
    if (alreadySet) {
      dispatch(setReferral(alreadySet));
      return;
    }

    const query = window.location.search;
    const referrer = document.referrer;

    let source = "direct";

    if (query.includes("utm_source")) {
      const params = new URLSearchParams(query);
      const utmSource = params.get("utm_source");
      const utmCampaign = params.get("utm_campaign");

      if (utmSource && utmCampaign) {
        source = `${utmSource}:${utmCampaign}`;
      } else if (utmSource) {
        source = utmSource;
      }
    } else if (referrer) {
      try {
        const domain = new URL(referrer).hostname;
        source = domain.replace("www.", "");
      } catch (err) {
        logger.error("Error getting referrer", err);
      }
    }

    sessionStorage.setItem("initial_referral", source);
    dispatch(setReferral(source));
  }, [dispatch]);
}
