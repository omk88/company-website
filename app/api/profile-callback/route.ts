import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";
import { authClient } from "@/lib/auth-client";

const GRADIENT_PALETTES = [
  { color1: "#FF512F", color2: "#DD2476" },
  { color1: "#8A2387", color2: "#E94057" },
  { color1: "#1FA2FF", color2: "#A6FFCB" },
  { color1: "#f4c4f3", color2: "#fc67fa" },
  { color1: "#00c6ff", color2: "#0072ff" }, 
  { color1: "#f9d423", color2: "#ff4e50" }, 
  { color1: "#11998e", color2: "#38ef7d" }, 
];

function generateRandomGradientSVG() {
  const palette = GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)];
  const angle = Math.floor(Math.random() * 360);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
        <stop offset="0%" style="stop-color:${palette.color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${palette.color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#grad)" />
  </svg>`;
}

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

    let firstName = "";
    let lastName = "";

    if (authName && authName.includes(" ")) {
      const nameParts = authName.trim().split(/\s+/);
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    let profilePicField = ""; 

    try {
      const svgString = generateRandomGradientSVG();
      
      const uploadUrl = await fetchAuthMutation(api.profiles.generateUploadUrl);
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/svg+xml" },
        body: svgString,
      });

      if (uploadResponse.ok) {
        const { storageId } = await uploadResponse.json();
        profilePicField = storageId; 
      }
    } catch (uploadError) {
      console.error("Failed to upload default gradient to Convex storage:", uploadError);
      profilePicField = "";
    }

    await fetchAuthMutation(api.profiles.initialiseProfile, {
      userId: id,
      email: email || "",
      firstName: firstName || "", 
      lastName: lastName || "",
      profilePic: profilePicField, 
    });

    return NextResponse.redirect(new URL("/", request.url));

  } catch (error) {
    console.error("CRITICAL: Onboarding checkpoint profile insertion error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}