import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Ban } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Banned() {

  const userStatus = await fetchAuthQuery(api.manageUsers.getProxyUserStatus, {});

  if (!userStatus?.isBanned) {
    redirect("/");
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-2xl w-fit p-6">
        <div className="items-center flex flex-col gap-4">
          <span className="text-3xl font-semibold ">You are banned.</span>
          <Ban className="w-12 h-12 text-red-500" />
        </div>
        <div className="mt-4">
          <span className="text-muted-foreground">Rules violated</span>
          <span className="text-muted-foreground">{userStatus.banReason}</span>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
}