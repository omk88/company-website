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

export const migrateBlogImageUrls = internalMutation({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();
    let updatedCount = 0;

    const convexUrlRegex = /https:\/\/[^\s\)\"]+\/api\/storage\/([a-zA-JS0-9_\-]+)/g;

    for (const blog of blogs) {
      if (!blog.content) continue;

      if (convexUrlRegex.test(blog.content)) {
        const updatedContent = blog.content.replace(
          convexUrlRegex,
          "/api/storage/$1"
        );

        await ctx.db.patch(blog._id, {
          content: updatedContent,
        });

        updatedCount++;
      }
    }

    return {
      success: true,
      message: `Successfully migrated ${updatedCount} blog(s).`,
    };
  },
});

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