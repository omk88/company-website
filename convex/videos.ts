import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStorageUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createVideoPost = mutation({
    args: {
        title: v.string(),
        subtitle: v.string(),

        author: v.string(), 
        displayName: v.optional(v.string()),
        username: v.string(),
        authorAvatarUrl: v.optional(v.string()),

        postType: v.union(v.literal("community"), v.literal("team")),
        tags: v.array(v.string()),

        videoStorageId: v.string(),
        thumbnailStorageId: v.string(),
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
            author: args.author,
            username: args.username,
            displayName: args.displayName,
            authorAvatarUrl: args.authorAvatarUrl,
            title: args.title,
            subtitle: args.subtitle,
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

            isVideo: true,
            videoStorageId: args.videoStorageId,
        });
    },
});