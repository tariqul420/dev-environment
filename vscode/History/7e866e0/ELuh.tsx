// hooks/useInitialReferral.ts
import { useEffect } from "react";

export function useInitialReferral() {
  useEffect(() => {
    const hasStored = localStorage.getItem("initial_referral");
    if (hasStored) return; // আগেই আছে, পুনরায় স্টোর করার দরকার নেই

    const queryString = window.location.search.replace("?", "");
    const referrer = document.referrer;

    let referral = "direct";
    if (queryString) {
      referral = queryString;
    } else if (referrer) {
      referral = referrer;
    }

    localStorage.setItem("initial_referral", referral);
  }, []);
}
