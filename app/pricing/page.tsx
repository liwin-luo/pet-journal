import { Landing } from "@/components/landing.tsx";
import { requireUserId } from "@/lib/session.ts";

export default async function PricingPage() {
  const session = await requireUserId();
  return <Landing inApp={session.ok} />;
}
