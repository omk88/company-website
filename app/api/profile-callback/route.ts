import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";
import { authClient } from "@/lib/auth-client";

export async function GET(request: Request) {
  try {
    const session = await authClient.getSession({
      fetchOptions: { headers: request.headers },
    });

    if (!session || !session.data?.user) {
      console.error("Profile callback failed: No active auth session found.");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userData = session.data.user as any;
    const id = userData.id;
    const email = userData.email;
    const authName = userData.name;
    const authUsername = userData.username;

    let firstName = "";
    let lastName = "";

    if (authName && authName.includes(" ")) {
      const nameParts = authName.trim().split(/\s+/);
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    const processedUsername = authUsername || authName || email.split("@")[0];

    console.log("Initializing Convex Profile for:", {
      userId: id,
      username: processedUsername,
    });

    await fetchAuthMutation(api.profiles.initialiseProfile, {
      userId: id,
      username: processedUsername,
      firstName: firstName || "", 
      lastName: lastName || "",
      profilePic: userData.image || "",
    });

    return NextResponse.redirect(new URL("/", request.url));

  } catch (error) {
    console.error("CRITICAL: Onboarding checkpoint profile insertion error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}