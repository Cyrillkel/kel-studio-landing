import PrivacyRoute, { privacyMetadata } from "@/components/routes/PrivacyRoute";

export const metadata = privacyMetadata("en");

export default function PrivacyPage() {
  return <PrivacyRoute lang="en" />;
}
