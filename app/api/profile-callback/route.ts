import { NextResponse } from "next/server";
import { connection } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery, fetchAuthMutation } from "@/lib/auth-server";
import { Id } from "@/convex/_generated/dataModel";

const GRADIENT_PALETTES = [
  { color1: "#FF512F", color2: "#DD2476" },
  { color1: "#1FA2FF", color2: "#A6FFCB" },
  { color1: "#00c6ff", color2: "#0072ff" },
  { color1: "#f9d423", color2: "#ff4e50" },
  { color1: "#11998e", color2: "#119499" },
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
  await connection();

  try {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

    if (!user || !user.userId || !user.email) {
      console.error("Profile callback failed: No active auth session or email found.");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { userId, email } = user;

    if (user.profile) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    let profilePicField: Id<"_storage">;
    let publicProfilePicUrl = "";

    try {
      const svgString = generateRandomGradientSVG();

      const uploadUrl = await fetchAuthMutation(api.profiles.generateUploadUrl);
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/svg+xml" },
        body: svgString,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const { storageId } = await uploadResponse.json();
      profilePicField = storageId as Id<"_storage">;

      const urlResult = await fetchAuthQuery(api.profiles.getImageUrl, {
        storageId: profilePicField,
      });

      if (urlResult) {
        publicProfilePicUrl = urlResult;
      }
    } catch (uploadError) {
      console.error("Failed to upload default gradient to Convex storage:", uploadError);
      throw new Error("Onboarding failed: Could not generate required profile picture.");
    }

    const displayName = email.split("@")[0];

    await fetchAuthMutation(api.profiles.initialiseProfile, {
      userId: userId,
      email: email,
      displayName: displayName,
      defaultProfilePic: profilePicField,
    });

    return NextResponse.redirect(new URL("/", request.url));

  } catch (error) {
    console.error("CRITICAL: Onboarding checkpoint profile insertion error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}