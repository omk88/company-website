import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return new Response("Missing image URL", { status: 400 });
    }

    const res = await fetch(imageUrl);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("image/png") || contentType.includes("image/jpeg")) {
      const buffer = await res.arrayBuffer();
      return new Response(buffer, {
        headers: { "Content-Type": contentType },
      });
    }

    const svgText = await res.text();
    const base64Svg = btoa(unescape(encodeURIComponent(svgText)));

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <img
            src={`data:image/svg+xml;base64,${base64Svg}`}
            width="1200"
            height="630"
            style={{ objectFit: "contain" }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Error generating OG image:", e);
    return new Response("Failed to process image", { status: 500 });
  }
}