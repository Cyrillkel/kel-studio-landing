import SiteCheckRoute, { siteCheckMetadata } from "@/components/routes/SiteCheckRoute";

export const metadata = siteCheckMetadata("en");

export default function Page() {
  return <SiteCheckRoute lang="en" />;
}
