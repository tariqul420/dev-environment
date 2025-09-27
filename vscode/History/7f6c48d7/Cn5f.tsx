export default function getPrivacyPolicyContent() {
  const language = useAppSelector((state) => state.globals.language);
  const content = privacyPolicyContent[language];
}
