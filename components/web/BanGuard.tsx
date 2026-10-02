"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BanGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userStatus = useQuery(api.manageUsers.getProxyUserStatus);

  useEffect(() => {
    if (userStatus?.isBanned) {
      router.replace("/banned");
    }
  }, [userStatus, router]);

  if (userStatus?.isBanned) {
    return null;
  }

  return <>{children}</>;
}