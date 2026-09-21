import { Suspense } from "react";
import { LoginCard } from "@/components/login-card.tsx";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginCard />
    </Suspense>
  );
}
