import { internalMutation } from "./_generated/server";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const backfillBlogTitleIds = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allBlogs = await ctx.db.query("blogs").collect();
    
    let updatedCount = 0;
    let skippedCount = 0;

    const usedSlugs = new Set<string>();

    for (const blog of allBlogs) {
      if (blog.blogTitleId) {
        usedSlugs.add(blog.blogTitleId);
      }
    }

    for (const blog of allBlogs) {
      if (blog.blogTitleId) {
        skippedCount++;
        continue;
      }

      const baseSlug = slugify(blog.title || "untitled-post");
      let candidateSlug = baseSlug;

      while (usedSlugs.has(candidateSlug)) {
        const uniqueSuffix = Math.random().toString(36).substring(2, 7);
        candidateSlug = `${baseSlug}-${uniqueSuffix}`;
      }

      usedSlugs.add(candidateSlug);

      await ctx.db.patch(blog._id, {
        blogTitleId: candidateSlug,
      });

      updatedCount++;
    }

    return {
      total: allBlogs.length,
      updated: updatedCount,
      skipped: skippedCount,
    };
  },
});