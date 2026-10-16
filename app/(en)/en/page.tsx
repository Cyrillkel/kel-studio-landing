import HomeRoute, { homeMetadata } from "@/components/routes/HomeRoute";

export const metadata = homeMetadata("en");

export default function Home() {
  return <HomeRoute lang="en" />;
}
