"use client";

import { useAuthProfile } from "@/hooks/useAuthProfile";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthProfile(); // <- initialize listener

  return <>{children}</>;
}
