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
      commentCount: 0,
      featured: false,
      createdAt: Date.now(),
    });
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
    
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      return null;
    }

    let hasVoted = false;
    if (identity) {
      const vote = await ctx.db
        .query("blogVotes")
        .withIndex("by_user_and_blog", (q) =>
          q.eq("userId", identity.subject).eq("blogId", args.blogId)
        )
        .unique();
      hasVoted = !!vote;
    }

    return {
      hasVoted,
      likes: blog.likes,
    };
  },
});

export const getBlogFeaturedState = query({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      return null;
    }

    let isFeatured = false;
    if (identity) {
      const vote = await ctx.db
        .query("featuredBlogs")
        .withIndex("by_user_and_blog", (q) =>
          q.eq("userId", identity.subject).eq("blogId", args.blogId)
        )
        .unique();
      isFeatured = !!vote;
    }

    return {
      isFeatured
    };
  },
});

export const toggleFeatured = mutation({
  args: { 
    blogId: v.id("blogs")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const blog = await ctx.db.get(args.blogId);
    if (!blog) return null;

    const existingFeatured = await ctx.db
      .query("featuredBlogs")
      .withIndex("by_user_and_blog", (q) =>
        q.eq("userId", userId).eq("blogId", args.blogId)
      )
      .unique();

    if (existingFeatured) {
      await ctx.db.delete(existingFeatured._id);
    } else {
      await ctx.db.insert("featuredBlogs", {
        userId: userId,
        blogId: blog._id,
      })
    }

    const currentFeatured = blog.featured ?? false; 
    await ctx.db.patch(args.blogId, { featured: !currentFeatured });
    
    return { feature: !currentFeatured };
  },
});

export const toggleBlogVote = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const blog = await ctx.db.get(args.blogId);
    if (!blog) return null;

    const existingVote = await ctx.db
      .query("blogVotes")
      .withIndex("by_user_and_blog", (q) =>
        q.eq("userId", userId).eq("blogId", args.blogId)
      )
      .unique();

    let newLikes = blog.likes ?? 0;
    let likesChange = 0;

    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      newLikes = Math.max(0, newLikes - 1);
      likesChange = -1;
    } else {
      await ctx.db.insert("blogVotes", {
        userId,
        blogId: args.blogId,
      });
      newLikes += 1;
      likesChange = 1;
    }

    await ctx.db.patch(args.blogId, {
      likes: newLikes,
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

export const deleteBlog = mutation({
  args: {
    blogId: v.id("blogs"), 
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    if (!blog) return null;

    const [featuredBlogs, blogVotes, comments, viewLogs] = await Promise.all([
      ctx.db.query("featuredBlogs").withIndex("by_blog", (q) => q.eq("blogId", args.blogId)).collect(),
      ctx.db.query("blogVotes").withIndex("by_blog", (q) => q.eq("blogId", args.blogId)).collect(),
      ctx.db.query("comments").withIndex("by_blog", (q) => q.eq("blogId", args.blogId)).collect(),
      ctx.db.query("viewLogs").withIndex("by_blog", (q) => q.eq("blogId", args.blogId)).collect(),
    ]);

    const commentVotesNested = await Promise.all(
      comments.map((comment) =>
        ctx.db.query("commentVotes").withIndex("by_comment", (q) => q.eq("commentId", comment._id)).collect()
      )
    );
    const commentVotes = commentVotesNested.flat();

    const blogAuthorProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", blog.author))
      .unique();

    if (blogAuthorProfile) {
      await ctx.db.patch(blogAuthorProfile._id, {
        totalLikes: Math.max(0, (blogAuthorProfile.totalLikes || 0) - blogVotes.length),
        articlesPublished: Math.max(0, (blogAuthorProfile.articlesPublished || 1) - 1),
      });
    }

    const commentAuthorMap = new Map(comments.map(c => [c._id, c.authorId]));

    const commentLikesPerUser: Record<string, number> = {};
    for (const vote of commentVotes) {
      const commentAuthorId = commentAuthorMap.get(vote.commentId);
      if (commentAuthorId) {
        commentLikesPerUser[commentAuthorId] = (commentLikesPerUser[commentAuthorId] || 0) + 1;
      }
    }

    for (const [commenterUserId, likesToRemove] of Object.entries(commentLikesPerUser)) {
      const commenterProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", commenterUserId))
        .unique();

      if (commenterProfile) {
        const commentsByThisUser = comments.filter(c => c.authorId === commenterUserId).length;

        await ctx.db.patch(commenterProfile._id, {
          totalLikes: Math.max(0, (commenterProfile.totalLikes || 0) - likesToRemove),
          commentsPublished: Math.max(0, (commenterProfile.commentsPublished || 0) - commentsByThisUser),
        });
      }
    }

    const allDeletes = [
      ctx.db.delete(args.blogId),
      ...featuredBlogs.map((fb) => ctx.db.delete(fb._id)),
      ...blogVotes.map((bv) => ctx.db.delete(bv._id)),
      ...comments.map((c) => ctx.db.delete(c._id)),
      ...viewLogs.map((vl) => ctx.db.delete(vl._id)),
      ...commentVotes.map((cv) => ctx.db.delete(cv._id)),
    ];

    await Promise.all(allDeletes);
    return { success: true };
  },
});


export const updatePost = mutation({
  args: {
    blogId: v.id("blogs"),
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
    const { blogId, ...fieldsToUpdate } = args;
    const currentPost = await ctx.db.get(blogId);
    if (!currentPost) return null;

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

    await ctx.db.patch(blogId, {
      ...fieldsToUpdate,
      imageUrl: finalImageUrl,
    });

    return blogId;
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
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
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

export const getBlogById = query({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    if (!blog) return null;

    const resolvedImageUrl = blog.storageId !== undefined 
      ? await ctx.storage.getUrl(blog.storageId) 
      : null;

    return {
      ...blog,
      imageUrl: resolvedImageUrl ?? "/noImage.png" 
    };
  }
});