import PricesRoute, { pricesMetadata } from "@/components/routes/PricesRoute";

export const metadata = pricesMetadata("ru");

export default function Page() {
  return <PricesRoute lang="ru" />;
}
