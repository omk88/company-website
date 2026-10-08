import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { storageId: string } }
) {
  const storageId = params.storageId as Id<"_storage">;

  const imageUrl = await fetchQuery(api.files.getImageUrl, { storageId });

  if (!imageUrl) {
    return new NextResponse("Image not found", { status: 404 });
  }

  return NextResponse.redirect(imageUrl);
}