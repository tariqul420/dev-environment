import { useEffect } from "react";

export function useInitialReferral() {
  useEffect(() => {
    const hasStored = sessionStorage.getItem("initial_referral");
    if (hasStored) return;

    const queryString = window.location.search.replace("?", "");
    const referrer = document.referrer;

    let referral = "direct";
    if (queryString) {
      referral = queryString;
    } else if (referrer) {
      referral = referrer;
    }

    sessionStorage.setItem("initial_referral", referral);
  }, []);
}
