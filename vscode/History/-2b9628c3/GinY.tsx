export const revalidate = 86400;
export const fetchCache = "force-cache";

import TermsConditionsClient from "@/components/root/terms-conditions/terms-conditions-client";

export default function TermsAndConditions() {
  return <TermsConditionsClient />;
}
