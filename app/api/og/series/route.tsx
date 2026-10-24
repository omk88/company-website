import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return new Response("Missing image URL", { status: 400 });
    }

    const res = await fetch(imageUrl);
    const svgText = await res.text();

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
            src={`data:image/svg+xml;base64,${Buffer.from(svgText).toString("base64")}`}
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
    return new Response("Failed to generate OG image", { status: 500 });
  }
}