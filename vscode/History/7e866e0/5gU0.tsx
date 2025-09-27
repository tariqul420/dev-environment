"use client";
import { setReferral } from "@/store/slices/referralSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useInitialReferral() {
  const dispatch = useDispatch();

  useEffect(() => {
    const alreadySet = sessionStorage.getItem("initial_referral");
    if (alreadySet) {
      dispatch(setReferral(alreadySet)); // ✅ Redux এ সেট করুন
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
        console.error(err);
      }
    }

    sessionStorage.setItem("initial_referral", source);
    dispatch(setReferral(source)); // ✅ Redux এ সেট করুন
  }, [dispatch]);
}
