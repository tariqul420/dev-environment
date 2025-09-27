import { privacyPolicyContent } from "@/constant/data";
import { useAppSelector } from "../hooks";

export default function getPrivacyPolicyContent() {
  const language = useAppSelector((state) => state.globals.language);
  const content = privacyPolicyContent[language];

  return content;
}
