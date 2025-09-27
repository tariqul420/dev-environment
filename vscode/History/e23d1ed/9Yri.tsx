export const revalidate = 86400;
export const fetchCache = "force-cache";

import ReturnsPolicyClient from "@/components/root/returns-policy/returns-policy-client";

export default function ReturnsPolicy() {
  return <ReturnsPolicyClient />;
}
