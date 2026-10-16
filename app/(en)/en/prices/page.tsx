import PricesRoute, { pricesMetadata } from "@/components/routes/PricesRoute";

export const metadata = pricesMetadata("en");

export default function Page() {
  return <PricesRoute lang="en" />;
}
