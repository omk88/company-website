"use server";

import { updateTag } from "next/cache";

export async function revalidateFeaturedBlogs() {
  updateTag("featured-blogs");
}