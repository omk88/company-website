import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const initialiseProfile = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
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
      displayName: args.displayName,
      profilePic: args.profilePic,
      defaultProfilePic: args.defaultProfilePic,
      totalLikes: 0,
      followerCount: 0,
      followingCount: 0,
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
        profile: null,
        bookmarkCount: 0,
        articleCount: 0,
        commentCount: 0,
        viewerStatus: { isFollowing: false, isBell: false, isSelf: false },
      };
    }

    const identity = await ctx.auth.getUserIdentity();

    const [currentProfile, bookmarks, blogs, comments, picStorageUrl, defaultPicStorageUrl] =
      await Promise.all([
        identity
          ? ctx.db
              .query("profiles")
              .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
              .unique()
          : null,
        ctx.db
          .query("bookmarks")
          .withIndex("by_user", (q) => q.eq("userId", profile.userId))
          .collect(),
        ctx.db
          .query("blogs")
          .withIndex("by_author", (q) => q.eq("author", profile.userId))
          .collect(),
        ctx.db
          .query("comments")
          .withIndex("by_authorId", (q) => q.eq("authorId", profile.userId))
          .collect(),
        // Get profilePic URL if storage ID exists, otherwise return null
        profile.profilePic ? ctx.storage.getUrl(profile.profilePic) : null,
        // defaultProfilePic is guaranteed to exist as a storage ID
        ctx.storage.getUrl(profile.defaultProfilePic),
      ]);

    const isSelf = currentProfile?._id === profile._id;

    const followRecord =
      currentProfile && !isSelf
        ? await ctx.db
            .query("follows")
            .withIndex("by_follower_and_following", (q) =>
              q.eq("followerId", currentProfile._id).eq("followingId", profile._id)
            )
            .unique()
        : null;

    return {
      profilePicture: picStorageUrl,
      defaultProfilePicture: defaultPicStorageUrl,
      profile: {
        ...profile,
        displayName: profile.displayName,
        location: profile.location,
        locationCountryCode: profile.locationCountryCode,
        bio: profile.bio,
        education: profile.education,
        skills: profile.skills,
        socials: profile.socials,
      },
      bookmarkCount: bookmarks.length,
      articleCount: blogs.length,
      commentCount: comments.length,
      viewerStatus: {
        isFollowing: Boolean(followRecord),
        isBell: followRecord?.isBell ?? false,
        isSelf,
      },
    };
  },
});

export const getProfileFollowers = query({
  args: {
    profileId: v.id("profiles"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.profileId))
      .paginate(args.paginationOpts);

    const followers = await Promise.all(
      page.page.map(async (follow) => {
        const followerProfile = await ctx.db.get(follow.followerId);
        if (!followerProfile) return null;

        const picUrl = followerProfile.profilePic ? await ctx.storage.getUrl(followerProfile.profilePic) : null;
        const defaultPicUrl = followerProfile.defaultProfilePic ? await ctx.storage.getUrl(followerProfile.defaultProfilePic) : null;

        return {
          _id: followerProfile._id,
          username: followerProfile.username,
          displayName: followerProfile.displayName,
          profilePicUrl: picUrl,
          defaultProfilePic: defaultPicUrl,
        };
      })
    );

    return {
      ...page,
      page: followers.filter(Boolean),
    };
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
    followerCount: v.number(),
    followingCount: v.number(),
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
    displayName: v.optional(v.string()),
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

    if (args.profilePic) {
      const profilePicId = args.profilePic;

      const ledgerRecord = await ctx.db
        .query("uploadedAvatar")
        .withIndex("by_storageId", (q) => q.eq("storageId", profilePicId))
        .first();

      if (ledgerRecord) {
        await ctx.db.delete(ledgerRecord._id);
      }
    }

    const { id, ...fieldsToUpdate } = args;

    if (!("profilePic" in args)) {
      fieldsToUpdate.profilePic = undefined;
    }

    await ctx.db.patch(existingUser._id, fieldsToUpdate);

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

export const toggleFollow = mutation({
  args: { targetProfileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated.");

    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!currentProfile) {
      throw new Error("Profile not found.")
    }

    const currentProfileId = currentProfile._id;

    if (currentProfileId === args.targetProfileId) {
      throw new Error("You cannot follow yourself.")
    }

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q
          .eq("followerId", currentProfileId)
          .eq("followingId", args.targetProfileId)
      )
      .unique();

    const targetProfile = await ctx.db.get(args.targetProfileId);
    if (!targetProfile) throw new Error("Target profile not found.");

    const currentFollowing = currentProfile.followingCount || 0;
    const targetFollowers = targetProfile.followerCount || 0;

    if (existingFollow) {
      await ctx.db.delete(existingFollow._id);

      await ctx.db.patch(currentProfileId, {
        followingCount: Math.max(0, currentFollowing - 1),
      });

      await ctx.db.patch(args.targetProfileId, {
        followerCount: Math.max(0, targetFollowers - 1),
      });

      return { isFollowing: false };
    } else {
      await ctx.db.insert("follows", {
        followerId: currentProfileId,
        followingId: args.targetProfileId,
        isBell: false,
      });

      await ctx.db.patch(currentProfileId, {
        followingCount: currentFollowing + 1,
      });

      await ctx.db.patch(args.targetProfileId, {
        followerCount: targetFollowers + 1,
      });

      return { isFollowing: true };
    }
  }, 
});

export const toggleBell = mutation({
  args: { targetProfileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated.");

    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!currentProfile) {
      throw new Error("Profile not found.");
    }

    const currentProfileId = currentProfile._id;

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q
          .eq("followerId", currentProfileId)
          .eq("followingId", args.targetProfileId)
      )
      .unique();

    if (!existingFollow) {
      throw new Error("You must follow this user before enabling notifications.");
    }

    const newBellState = !existingFollow.isBell;

    await ctx.db.patch(existingFollow._id, {
      isBell: newBellState,
    });

    return { isBell: newBellState };
  },
});

export const getAllUsernames = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();

    return profiles
      .map((profile) => profile.username)
      .filter((username): username is string => Boolean(username));
  },
});

export const isUsernameTaken = query({
  args: {
    username: v.string(),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanUsername = args.username.trim().toLowerCase();
    
    if (cleanUsername.length < 2) return false;

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", cleanUsername))
      .first();

    if (!existingProfile) return false;

    return existingProfile.userId !== args.currentUserId;
  },
});

export const getPaginatedFollowersByProfile = query({
  args: {
    profileId: v.id("profiles"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let viewerProfile = null;
    if (identity) {
      viewerProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .unique();
    }

    const paginated = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.profileId))
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      paginated.page.map(async (followDoc) => {
        const profile = await ctx.db.get(followDoc.followerId);
        if (!profile) return null;

        let isFollowing = false;
        let isBell = false;

        if (viewerProfile) {
          const viewerFollowDoc = await ctx.db
            .query("follows")
            .withIndex("by_follower_and_following", (q) =>
              q
                .eq("followerId", viewerProfile._id)
                .eq("followingId", profile._id)
            )
            .unique();

          if (viewerFollowDoc) {
            isFollowing = true;
            isBell = viewerFollowDoc.isBell ?? false;
          }
        }

        const profilePicture = profile.profilePic
          ? await ctx.storage.getUrl(profile.profilePic)
          : null;
        const defaultProfilePicture = await ctx.storage.getUrl(
          profile.defaultProfilePic
        );

        return {
          profile,
          profilePicture,
          defaultProfilePicture,
          isFollowing,
          isBell,
        };
      })
    );

    return {
      ...paginated,
      page: page.filter(Boolean),
    };
  },
});

export const getPaginatedFollowingByProfile = query({
  args: {
    profileId: v.id("profiles"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let viewerProfile = null;
    if (identity) {
      viewerProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .unique();
    }

    const paginated = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.profileId))
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      paginated.page.map(async (followDoc) => {
        const profile = await ctx.db.get(followDoc.followingId);
        if (!profile) return null;

        let isFollowing = false;
        let isBell = false;

        if (viewerProfile) {
          const viewerFollowDoc = await ctx.db
            .query("follows")
            .withIndex("by_follower_and_following", (q) =>
              q
                .eq("followerId", viewerProfile._id)
                .eq("followingId", profile._id)
            )
            .unique();

          if (viewerFollowDoc) {
            isFollowing = true;
            isBell = viewerFollowDoc.isBell ?? false;
          }
        }

        const profilePicture = profile.profilePic
          ? await ctx.storage.getUrl(profile.profilePic)
          : null;
        const defaultProfilePicture = await ctx.storage.getUrl(
          profile.defaultProfilePic
        );

        return {
          profile,
          profilePicture,
          defaultProfilePicture,
          isFollowing,
          isBell,
        };
      })
    );

    return {
      ...paginated,
      page: page.filter(Boolean),
    };
  },
});