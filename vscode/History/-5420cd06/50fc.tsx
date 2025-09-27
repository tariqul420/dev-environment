export const revalidate = 86400;
export const fetchCache = "force-cache";

import PrivacyPolicyClient from "@/components/root/privacy-policy/privacy-policy-client";

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />;
}
