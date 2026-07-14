import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { cubeTexture } from "three/src/nodes/accessors/CubeTextureNode.js";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    author: v.string(),
    authorName: v.string(),
    username: v.string(),
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const generatedImageUrl = await ctx.storage.getUrl(args.storageId);

    return await ctx.db.insert("blogs", {
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      author: args.author,
      authorName: args.authorName,
      username: args.username,
      tags: args.tags,
      storageId: args.storageId,
      imageUrl: generatedImageUrl || "",
      totalViews: 0,
      likes: 0,
      dislikes: 0,
      commentCount: 0,
      featured: false,
      createdAt: Date.now(),
    });
  },
});

export const toggleFeatured = mutation({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const currentFeatured = post.featured ?? false; 
    await ctx.db.patch(args.postId, { featured: !currentFeatured });
    return !currentFeatured;
  },
});

export const recordView = mutation({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    await ctx.db.insert("viewLogs", {
      blogId: args.blogId,
      viewedAt: Date.now(),
    });

    const blog = await ctx.db.get(args.blogId);
    if (blog) {
      await ctx.db.patch(args.blogId, {
        totalViews: (blog.totalViews ?? 0) + 1,
      });
    }
  },
});

export const getBlogVoteState = query({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "none";

    const vote = await ctx.db
      .query("blogVotes")
      .withIndex("by_user_and_blog", (q) => 
        q.eq("userId", identity.subject).eq("blogId", args.blogId)
      )
      .unique();

    return vote ? vote.type : "none";
  },
})

export const toggleBlogVote = mutation({
  args: {
    blogId: v.id("blogs"),
    targetVote: v.union(v.literal("liked"), v.literal("disliked")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("You must be logged in to vote.");
    const userId = identity.subject;

    const blog = await ctx.db.get(args.blogId);
    if (!blog) throw new ConvexError("Blog not found.");

    const existingVote = await ctx.db
      .query("blogVotes")
      .withIndex("by_user_and_blog", (q) =>
        q.eq("userId", userId).eq("blogId", args.blogId)
      )
      .unique();

    let newLikes = blog.likes ?? 0;
    let newDislikes = blog.dislikes ?? 0;
    let likesChange = 0;

    if (existingVote) {
      if (existingVote.type === args.targetVote) {
        await ctx.db.delete(existingVote._id);
        if (args.targetVote === "liked") {
          newLikes = Math.max(0, newLikes - 1);
          likesChange = -1;
        }
        if (args.targetVote === "disliked") {
          newDislikes = Math.max(0, newDislikes - 1);
        }
      } else {
        await ctx.db.patch(existingVote._id, { type: args.targetVote });
        if (args.targetVote === "liked") {
          newLikes += 1;
          newDislikes = Math.max(0, newDislikes - 1);
          likesChange = 1;
        } else {
          newDislikes += 1;
          newLikes = Math.max(0, newLikes - 1);
          likesChange = -1;
        }
      }
    } else {
      await ctx.db.insert("blogVotes", {
        userId,
        blogId: args.blogId,
        type: args.targetVote,
      });
      if (args.targetVote === "liked") {
        newLikes += 1;
        likesChange = 1;
      }
      if (args.targetVote === "disliked") {
        newDislikes += 1;
      }
    }

    await ctx.db.patch(args.blogId, {
      likes: newLikes,
      dislikes: newDislikes,
    });

    if (likesChange !== 0) {
      const authorProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", blog.author))
        .unique();

      if (authorProfile) {
        const currentProfileLikes = authorProfile.totalLikes ?? 0;
        await ctx.db.patch(authorProfile._id, {
          totalLikes: Math.max(0, currentProfileLikes + likesChange),
        });
      }
    }
  },
});

export const deletePost = mutation({
  args: {
    id: v.id("blogs"), 
    storageId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (args.storageId) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch (error) {
        console.error("Failed to delete asset:", error);
      }
    }
    await ctx.db.delete(args.id);
    return { success: true };
  },
});



export const updatePost = mutation({
  args: {
    postId: v.id("blogs"),
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    author: v.string(),
    authorName: v.string(),
    username: v.string(),
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const { postId, ...fieldsToUpdate } = args;
    const currentPost = await ctx.db.get(postId);
    if (!currentPost) throw new Error("Post no longer exists.");

    let finalImageUrl = currentPost.imageUrl;

    if (fieldsToUpdate.storageId !== currentPost.storageId) {
      const generatedImageUrl = await ctx.storage.getUrl(fieldsToUpdate.storageId);
      finalImageUrl = generatedImageUrl || "";

      if (currentPost.storageId) {
        try {
          await ctx.storage.delete(currentPost.storageId);
        } catch (e) {
          console.warn("Could not remove old asset:", e);
        }
      }
    }

    await ctx.db.patch(postId, {
      ...fieldsToUpdate,
      imageUrl: finalImageUrl,
    });

    return postId;
  },
});

export const updateAuthorNameForAllPosts = mutation({
  args: {
    author: v.string(), 
    newAuthorName: v.string(),
  },
  handler: async (ctx, args) => {
    const { author, newAuthorName } = args;

    const postsToUpdate = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("author"), author))
      .collect();

    const updatePromises = postsToUpdate.map((post) =>
      ctx.db.patch(post._id, {
        authorName: newAuthorName,
      })
    );

    await Promise.all(updatePromises);

    return { updatedCount: postsToUpdate.length };
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogs")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    return posts.map(({ content, ...previewFields }) => previewFields);
  },
});

export const getPaginatedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.optional(v.string()),
    activeTags: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.string()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const search = args.searchTerm?.trim();
    const tags = args.activeTags || [];
    const sort = args.sortOrder || "new";
    const authorFilter = args.author;

    let paginatedResults;

    if (search) {
      paginatedResults = await ctx.db
        .query("blogs")
        .withSearchIndex("search_title_subtitle", (q) => q.search("title", search))
        .paginate(args.paginationOpts);
    } else {
      let baseQuery;
      
      if (sort === "hot") {
        baseQuery = ctx.db.query("blogs").withIndex("by_likes");
      } else if (sort === "top") {
        baseQuery = ctx.db.query("blogs").withIndex("by_totalViews");
      } else {
        baseQuery = ctx.db.query("blogs").withIndex("by_createdAt");
      }
      
      paginatedResults = await baseQuery.order("desc").paginate(args.paginationOpts);
    }

    let filteredPage = paginatedResults.page;

    if (authorFilter) {
      filteredPage = filteredPage.filter(post => post.author === authorFilter);
    }

    if (tags.length > 0) {
      const lowerTags = tags.map(t => t.toLowerCase());
      filteredPage = filteredPage.filter(post => 
        lowerTags.every(tag => post.tags?.some((t: string) => t.toLowerCase() === tag))
      );
    }

    const pagePreviews = filteredPage.map(({ content, ...previewFields }) => ({
      ...previewFields,
      commentCount: previewFields.commentCount || 0, 
    }));

    return {
      ...paginatedResults,
      page: pagePreviews,
    };
  },
});

export const getFeaturedPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogs")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .collect();

    return posts.map(({ content, ...previewFields }) => previewFields);
  },
});

export const getFeaturedState = query({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.postId);
    if (!blog) return null;
    return { isFeatured: blog.featured ?? false };
  },
});

export const getPostsByAuthor = query({
  args: { author: v.string() },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_createdAt") 
      .order("desc")
      .collect();

    const matched = blogs.filter(b => b.author.toLowerCase() === args.author.toLowerCase()).slice(0, 9);

    return matched.map(({ content, ...previewFields }) => previewFields);
  },
});

export const getTrendingPosts = query({
  args: {},
  handler: async (ctx) => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentViews = await ctx.db
      .query("viewLogs")
      .withIndex("by_viewedAt", (q) => q.gte("viewedAt", sevenDaysAgo))
      .collect();

    const viewCounts: Record<string, number> = {};
    recentViews.forEach((log) => {
      viewCounts[log.blogId] = (viewCounts[log.blogId] || 0) + 1;
    });

    const sortedBlogIds = Object.keys(viewCounts).sort(
      (a, b) => viewCounts[b] - viewCounts[a]
    );
    const topTrendingIds = sortedBlogIds.slice(0, 5);

    const trendingBlogsRaw = await Promise.all(
      topTrendingIds.map(async (id) => {
        const blogId = id as Id<"blogs">;
        const blog = await ctx.db.get(blogId);
        if (!blog) return null; 

        return {
          ...blog,
          recentViews: viewCounts[id],
        };
      })
    );

    return trendingBlogsRaw.filter((blog): blog is NonNullable<typeof blog> => blog !== null);
  },
});

export const getPostById = query({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    const resolvedImageUrl = post.storageId !== undefined ? await ctx.storage.getUrl(post.storageId) : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl
    };
  }
});