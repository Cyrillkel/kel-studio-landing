import SiteCheckRoute, { siteCheckMetadata } from "@/components/routes/SiteCheckRoute";

export const metadata = siteCheckMetadata("ru");

export default function Page() {
  return <SiteCheckRoute lang="ru" />;
}
