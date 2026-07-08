import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const initialiseProfile = mutation({
    args: {
        userId: v.string(), 
        username: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        profilePic: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (existing) return existing;

        const profileId = await ctx.db.insert("profiles", {
            userId: args.userId,
            username: args.username,
            firstName: args.firstName ?? "",
            lastName: args.lastName ?? "",
            profilePic: args.profilePic ?? "",
            education: [],
            skills: [],
            socials: [],
            totalLikes: 0,
            articlesPublished: 0,
            commentsPublished: 0,
        });

        return profileId;
    }
});