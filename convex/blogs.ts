import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

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
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const generatedImageUrl = await ctx.storage.getUrl(args.storageId);

    const newBlogId = await ctx.db.insert("blogs", {
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      author: args.author,
      tags: args.tags,
      storageId: args.storageId,
      imageUrl: generatedImageUrl || "",
      totalViews: 0,
      likes: 0,
      dislikes: 0,
      featured: false,
      createdAt: Date.now(),
    });

    return newBlogId;
  },
});

export const toggleFeatured = mutation({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const currentFeatured = post.featured ?? false; 

    await ctx.db.patch(args.postId, {
      featured: !currentFeatured,
    });

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

export const handleVote = mutation({
  args: {
    postId: v.id("blogs"),
    currentVote: v.union(v.literal("none"), v.literal("liked"), v.literal("disliked")),
    previousVote: v.union(v.literal("none"), v.literal("liked"), v.literal("disliked")),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    let likesChange = 0;
    let dislikesChange = 0;

    if (args.previousVote === "liked") likesChange -= 1;
    if (args.previousVote === "disliked") dislikesChange -= 1;

    if (args.currentVote === "liked") likesChange += 1;
    if (args.currentVote === "disliked") dislikesChange += 1;

    const currentLikes = post.likes ?? 0;
    const currentDislikes = post.dislikes ?? 0;

    await ctx.db.patch(args.postId, {
      likes: Math.max(0, currentLikes + likesChange),
      dislikes: Math.max(0, currentDislikes + dislikesChange)
    });

    return { success: true };

  }
})

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
        console.error("Failed to delete associated image from storage:", error);
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
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const { postId, ...fieldsToUpdate } = args;

    const currentPost = await ctx.db.get(postId);
    if (!currentPost) {
      throw new Error("Update targeted a blog post that no longer exists.");
    }

    let finalImageUrl = currentPost.imageUrl;

    if (fieldsToUpdate.storageId !== currentPost.storageId) {
      const generatedImageUrl = await ctx.storage.getUrl(fieldsToUpdate.storageId);
      finalImageUrl = generatedImageUrl || "";

      if (currentPost.storageId) {
        try {
          await ctx.storage.delete(currentPost.storageId);
        } catch (e) {
          console.warn("Could not remove orphaned storage asset:", e);
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

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogs")
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
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("blogs")
      .order("desc")
      .paginate(args.paginationOpts);

    let filteredPage = result.page;

    if (args.activeTags && args.activeTags.length > 0) {
      const lowerTags = args.activeTags.map(t => t.toLowerCase());
      filteredPage = filteredPage.filter(post => 
        lowerTags.every(tag => post.tags?.some((t: string) => t.toLowerCase() === tag))
      );
    }

    if (args.searchTerm) {
      const search = args.searchTerm.toLowerCase().trim();
      filteredPage = filteredPage.filter(post => 
        post.title.toLowerCase().includes(search) || 
        (post.subtitle && post.subtitle.toLowerCase().includes(search))
      );
    }

    const pageWithPreviews = await Promise.all(
      filteredPage.map(async ({ content, ...previewFields }) => {
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", previewFields._id))
          .collect();

        return {
          ...previewFields,
          commentCount: comments.length,
        };
      })
    );

    return {
      ...result,
      page: pageWithPreviews,
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

    return await Promise.all(
      posts.map(async ({ content, ...previewFields }) => {
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", previewFields._id))
          .collect();

        return {
          ...previewFields,
          commentCount: comments.length,
        };
      })
    );
  },
});

export const getFeaturedState = query({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.postId);
    if (!blog) return null;
    
    return {
      isFeatured: blog.featured ?? false, 
    };
  },
});

export const getPostsByAuthor = query({
  args: { authorName: v.string() },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("author"), args.authorName))
      .take(9);

    return await Promise.all(
      blogs.map(async (blog) => {
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", blog._id))
          .take(9);

        return {
          ...blog,
          commentCount: comments.length,
        };
      })
    );
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
        
        const [blog, comments] = await Promise.all([
          ctx.db.get(blogId),
          ctx.db
            .query("comments")
            .withIndex("by_postId", (q) => q.eq("postId", blogId))
            .collect() 
        ]);

        if (!blog) return null; 

        return {
          ...blog,
          recentViews: viewCounts[id],
          commentCount: comments.length, 
        };
      })
    );

    return trendingBlogsRaw.filter((blog): blog is NonNullable<typeof blog> => blog !== null);
  },
});

export const getPostById = query({
    args: {
        postId: v.id("blogs")
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);

        if(!post) {
            return null;
        }

        const resolvedImageUrl = post?.storageId !== undefined ? await ctx.storage.getUrl(post.storageId) : null;

        return {
            ...post,
            imageUrl: resolvedImageUrl
        };
    }
});