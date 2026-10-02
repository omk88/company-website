import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userStatus = await fetchAuthQuery(
    api.manageUsers.getProxyUserStatus,
    {}
  );

  if (userStatus?.isBanned) {
    redirect("/banned");
  }

  return <>{children}</>;
}