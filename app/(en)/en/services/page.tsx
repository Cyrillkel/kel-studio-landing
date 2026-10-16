import ServicesRoute, { servicesMetadata } from "@/components/routes/ServicesRoute";

export const metadata = servicesMetadata("en");

export default function Page() {
  return <ServicesRoute lang="en" />;
}
