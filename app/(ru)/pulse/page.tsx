import PulseRoute, { pulseMetadata } from "@/components/routes/PulseRoute";

export const metadata = pulseMetadata("ru");

export default function Page() {
  return <PulseRoute lang="ru" />;
}
