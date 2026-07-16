import { mutation, MutationCtx, query } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_AVATAR = "/default.svg";

export const initialiseProfile = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profilePic: v.id("_storage"),
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
      location: "",
      locationCountryCode: "",
      bio: "",
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

    if (!profile) {
      return { 
        profilePicture: DEFAULT_AVATAR, 
        profile: null 
      };
    }

    const storageUrl = profile.profilePic 
      ? await ctx.storage.getUrl(profile.profilePic) 
      : null;

    const profilePicture = storageUrl ?? DEFAULT_AVATAR;

    return { profilePicture, profile };
  },
});

export const getProfileById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    return profile;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createProfile = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profilePic: v.id("_storage"),
    location: v.string(),
    locationCountryCode: v.string(),
    bio: v.string(),
    education: v.array(
      v.object({
        degree: v.string(),
        subject: v.string(),
        institution: v.string(),
      })
    ),
    skills: v.array(v.string()),
    socials: v.array(
      v.object({
        platform: v.string(),
        url: v.string()
      })
    ),
    totalLikes: v.number(),
    articlesPublished: v.number(),
    commentsPublished: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingUser) {
      throw new Error("Profile already exists for this user");
    }

    const profileId = await ctx.db.insert("profiles", args);
    
    return profileId;
  },
});

export const updateProfile = mutation({
  args: {
    id: v.id("profiles"), 
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePic: v.optional(v.id("_storage")),
    location: v.optional(v.string()),
    locationCountryCode: v.optional(v.string()),
    bio: v.optional(v.string()),
    education: v.optional(
      v.array(
        v.object({
          degree: v.string(),
          subject: v.string(),
          institution: v.string(),
        })
      )
    ),
    skills: v.optional(v.array(v.string())),
    socials: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          url: v.string()
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.get(args.id);
    if (!existingUser) {
      throw new Error("Profile not found");
    }

    const { id, ...fieldsToUpdate } = args;

    await ctx.db.patch(existingUser._id, fieldsToUpdate);

    const oldName = (existingUser.firstName && existingUser.lastName) 
      ? `${existingUser.firstName} ${existingUser.lastName}` 
      : existingUser.username;

    const newName = (args.firstName && args.lastName) 
      ? `${args.firstName} ${args.lastName}` 
      : (args.username ?? oldName);

    if (oldName !== newName) {
      await updateAuthorNameForAllPostsHelper(ctx, existingUser.userId, newName);
    }

    if (args.profilePic) {
      const publicUrl = await ctx.storage.getUrl(args.profilePic);
      return { publicImageUrl: publicUrl };
    }

    return { existingUser: existingUser._id, publicImageUrl: null };
  },
});

async function updateAuthorNameForAllPostsHelper(
  ctx: MutationCtx, 
  authorId: string, 
  newAuthorName: string
) {
  const postsToUpdate = await ctx.db
    .query("blogs")
    .withIndex("by_author", (q) => q.eq("author", authorId))
    .collect();

  const updatePromises = postsToUpdate.map((post) =>
    ctx.db.patch(post._id, {
      authorName: newAuthorName,
    })
  );

  await Promise.all(updatePromises);
}