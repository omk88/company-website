import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const initialiseProfile = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profilePic: v.string(),
  },
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingProfile) return existingProfile;

    const emailPrefix = args.email.split("@")[0];
    
    let baseUsername = emailPrefix.replace(/[^a-zA-Z0-9_.]/g, "");
    if (!baseUsername) baseUsername = "user"; 

    let finalUsername = baseUsername;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      const existingUser = await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", finalUsername))
        .unique();

      if (!existingUser) {
        isUnique = true;
      } else {
        finalUsername = `${baseUsername}${counter}`;
        counter++;
      }
    }

    const newProfileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      username: finalUsername,
      firstName: args.firstName,
      lastName: args.lastName,
      profilePic: args.profilePic,
      education: [],
      skills: [],
      socials: [], 
      totalLikes: 0,
      articlesPublished: 0,
      commentsPublished: 0,
    });

    return newProfileId;
  },
});

export const getProfileByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    return profile;
  },
});