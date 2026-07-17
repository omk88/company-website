import { mutation, MutationCtx, query } from "./_generated/server";
import { v } from "convex/values";

export const initialiseProfile = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePic: v.optional(v.id("_storage")),
    defaultProfilePic: v.id("_storage"),
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
      defaultProfilePic: args.defaultProfilePic,
      totalLikes: 0,
      articlesPublished: 0,
      commentsPublished: 0,
    });

    return newProfileId;
  },
});

export const removeProfilePic = mutation({
  args: { 
    userId: v.id("profiles") 
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.userId);
    
    if (!profile) {
      throw new Error("Profile not found");
    }

    if (profile.profilePic) {
      await ctx.storage.delete(profile.profilePic);
    }

    await ctx.db.patch(args.userId, {
      profilePic: undefined,
    });
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
        profilePicture: null,
        defaultProfilePicture: null,  
        profile: null 
      };
    }

    const picStorageId = profile.profilePic;
    const defaultPicStorageId = profile.defaultProfilePic;

    const picStorageUrl = picStorageId ? await ctx.storage.getUrl(picStorageId) : null;
    const defaultPicStorageUrl = defaultPicStorageId ? await ctx.storage.getUrl(defaultPicStorageId) : null;

    const profilePicture = picStorageUrl;
    const defaultProfilePicture = defaultPicStorageUrl;

    const sanitizedProfile = {
      ...profile,
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      location: profile.location ?? "",
      locationCountryCode: profile.locationCountryCode ?? "",
      bio: profile.bio ?? "",
      
      education: profile.education ?? [],
      skills: profile.skills ?? [],
      socials: profile.socials ?? [],
    };

    return { profilePicture, defaultProfilePicture, profile: sanitizedProfile };
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

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
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
    defaultProfilePic: v.id("_storage"),
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
    defaultProfilePic: v.optional(v.id("_storage")),
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

    if (!("profilePic" in args)) {
      fieldsToUpdate.profilePic = undefined;
    }

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

    if (!args.profilePic && existingUser.defaultProfilePic) {
      const defaultUrl = await ctx.storage.getUrl(existingUser.defaultProfilePic);
      return { publicImageUrl: defaultUrl };
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