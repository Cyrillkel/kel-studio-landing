import HomeRoute, { homeMetadata } from "@/components/routes/HomeRoute";

export const metadata = homeMetadata("ru");

export default function Home() {
  return <HomeRoute lang="ru" />;
}
