import PrivacyRoute, { privacyMetadata } from "@/components/routes/PrivacyRoute";

export const metadata = privacyMetadata("ru");

export default function PrivacyPage() {
  return <PrivacyRoute lang="ru" />;
}
