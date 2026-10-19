import PulseRoute, { pulseMetadata } from "@/components/routes/PulseRoute";

export const metadata = pulseMetadata("en");

export default function Page() {
  return <PulseRoute lang="en" />;
}
