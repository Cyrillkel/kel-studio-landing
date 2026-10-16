import ServicesRoute, { servicesMetadata } from "@/components/routes/ServicesRoute";

export const metadata = servicesMetadata("ru");

export default function Page() {
  return <ServicesRoute lang="ru" />;
}
