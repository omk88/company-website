import { internalMutation } from "./_generated/server";

export const recalculatePopularPosts = internalMutation({
    args: {},
    handler: async (ctx) => {
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const sevenDaysAgo = Date.now() - SEVEN_DAYS_MS;

        const recentBlogs = await ctx.db
            .query("blogs")
            .withIndex("by_createdAt", (q) => q.gte("createdAt", sevenDaysAgo))
            .collect();

        const ENGAGEMENT_THRESHOLD = 15;

        for (const blog of recentBlogs) {
            const reactionCount = 
                (blog.heartCount || 0) +
                (blog.insightfulCount || 0) +
                (blog.mindblownCount || 0) +
                (blog.fireCount || 0) +
                (blog.thinkingCount || 0);

            const score =
                (blog.likes || 0) * 3 +
                (blog.commentCount || 0) * 4 +
                reactionCount * 2 +
                (blog.totalViews || 0) * 0.1;

            const shouldBePopular = score >= ENGAGEMENT_THRESHOLD || blog.hotScore > 0.5;

            if (blog.isPopular !== shouldBePopular) {
                await ctx.db.patch(blog._id, { isPopular: shouldBePopular });
            }
        }

        const expiredPopularBlogs = await ctx.db
            .query("blogs")
            .withIndex("by_popular_createdAt", (q) => 
                q.eq("isPopular", true).lt("createdAt", sevenDaysAgo)
            )
            .collect();

        for (const blog of expiredPopularBlogs) {
            await ctx.db.patch(blog._id, { isPopular: false });
        }
    },
});