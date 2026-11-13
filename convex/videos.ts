import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createVideoPost = mutation({
    args: {
        title: v.string(),
        subtitle: v.string(),
        content: v.string(),
        postType: v.union(v.literal("community"), v.literal("team")),
        tags: v.array(v.string()),
        videoStorageId: v.string(),
        thumbnailStorageId: v.string(),
        readTime: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized: You must be logged in to upload a video.");
        }

        const imageUrl = await ctx.storage.getUrl(args.thumbnailStorageId);
        if (!imageUrl) {
            throw new Error("Failed to generate thumbnail image URL.");
        }

        const now = Date.now();
        const blogTitleId = `${args.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")}-${now}`;

        return await ctx.db.insert("blogs", {
            blogTitleId,
            storageId: args.thumbnailStorageId,
            imageUrl,
            author: identity.subject,
            username: identity.nickname || identity.name || "user",
            displayName: identity.name,
            authorAvatarUrl: identity.pictureUrl,
            title: args.title,
            subtitle: args.subtitle,
            content: args.content,
            tags: args.tags,
            postType: args.postType,
            createdAt: now,
            
            totalViews: 0,
            likes: 0,
            featured: false,
            commentCount: 0,
            isPopular: false,
            isTrending: false,
            heartCount: 0,
            insightfulCount: 0,
            mindblownCount: 0,
            fireCount: 0,
            thinkingCount: 0,
            hotScore: 0,
            controversialScore: 0,
            readTime: args.readTime,

            isVideo: true,
            videoStorageId: args.videoStorageId,
        });
    },
});