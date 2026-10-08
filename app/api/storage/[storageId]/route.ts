import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storageId: string }> }
) {
  const { storageId } = await params;

  const imageUrl = await fetchQuery(api.files.getImageUrl, {
    storageId: storageId as Id<"_storage">,
  });

  if (!imageUrl) {
    return new NextResponse("Image not found", { status: 404 });
  }

  return NextResponse.redirect(imageUrl);
}