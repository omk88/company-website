import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { calculateScores } from "./scoreAlgorithm";

const WORDS_PER_MINUTE = 225;

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

    const words = args.content.trim().split(/\s+/);
    const wordCount = words.filter(word => word.length > 0).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
    const now = Date.now();

    const blogId = await ctx.db.insert("blogs", {
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
      hotScore: 0,
      controversialScore: 0,
      featured: false,
      createdAt: now,
      readTime: readTimeMinutes,
    });

    const tagPromises = args.tags.map((tag) =>
      ctx.db.insert("blogTags", {
        blogId,
        tag,
        username: args.username,
        createdAt: now,
        likes: 0,
        hotScore: 0,
        controversialScore: 0,
      })
    );

    const profilePromise = ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.author))
      .unique();

    const [_, profile] = await Promise.all([
      Promise.all(tagPromises),
      profilePromise,
    ]);

    if (profile) {
      await ctx.db.patch(profile._id, {
        articlesPublished: (profile.articlesPublished || 0) + 1,
      });
    }

    return blogId;
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
          q.eq("userId", identity.subject as Id<"profiles">).eq("blogId", args.blogId)
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
          q.eq("userId", identity.subject as Id<"profiles">).eq("blogId", args.blogId)
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
    const userId = identity.subject as Id<"profiles">;

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
    const userId = identity.subject as Id<"profiles">;

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

    const { hotScore, controversialScore } = calculateScores(
      blog._creationTime,
      newLikes,
      blog.commentCount ?? 0
    );

    await ctx.db.patch(args.blogId, {
      likes: newLikes,
      hotScore,
      controversialScore,
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

export const deleteBlogs = mutation({
  args: {
    blogIds: v.array(v.id("blogs")),
  },
  handler: async (ctx, args) => {
    for (const blogId of args.blogIds) {
      const blog = await ctx.db.get(blogId);
      if (!blog) continue;

      const [featuredBlogs, blogVotes, comments, viewLogs, blogAuthorProfile, blogTags] = await Promise.all([
        ctx.db.query("featuredBlogs").withIndex("by_blog", (q) => q.eq("blogId", blogId)).collect(),
        ctx.db.query("blogVotes").withIndex("by_blog", (q) => q.eq("blogId", blogId)).collect(),
        ctx.db.query("comments").withIndex("by_blog", (q) => q.eq("blogId", blogId)).collect(),
        ctx.db.query("viewLogs").withIndex("by_blog", (q) => q.eq("blogId", blogId)).collect(),
        ctx.db.query("profiles").withIndex("by_userId", (q) => q.eq("userId", blog.author)).unique(),
        ctx.db.query("blogTags").withIndex("by_blog", (q) => q.eq("blogId", blogId)).collect(),
      ]);

      const commentVotesNested = await Promise.all(
        comments.map((comment) =>
          ctx.db.query("commentVotes").withIndex("by_comment", (q) => q.eq("commentId", comment._id)).collect()
        )
      );
      const commentVotes = commentVotesNested.flat();

      const commentAuthorMap = new Map(comments.map((c) => [c._id, c.authorId]));
      const uniqueCommenterIds = Array.from(new Set(comments.map((c) => c.authorId)));

      const commenterProfiles = await Promise.all(
        uniqueCommenterIds.map((userId) =>
          ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique()
        )
      );

      const commenterProfileMap = new Map(
        commenterProfiles.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => [p.userId, p])
      );

      const databaseWrites: Promise<any>[] = [];

      if (blogAuthorProfile) {
        databaseWrites.push(
          ctx.db.patch(blogAuthorProfile._id, {
            totalLikes: Math.max(0, (blogAuthorProfile.totalLikes || 0) - blogVotes.length),
            articlesPublished: Math.max(0, (blogAuthorProfile.articlesPublished || 1) - 1),
          })
        );
      }

      const commentLikesPerUser: Record<string, number> = {};
      for (const vote of commentVotes) {
        const commentAuthorId = commentAuthorMap.get(vote.commentId);
        if (commentAuthorId) {
          commentLikesPerUser[commentAuthorId] = (commentLikesPerUser[commentAuthorId] || 0) + 1;
        }
      }

      for (const commenterUserId of uniqueCommenterIds) {
        const commenterProfile = commenterProfileMap.get(commenterUserId);

        if (commenterProfile) {
          const likesToRemove = commentLikesPerUser[commenterUserId] || 0;
          const commentsByThisUser = comments.filter((c) => c.authorId === commenterUserId).length;

          databaseWrites.push(
            ctx.db.patch(commenterProfile._id, {
              totalLikes: Math.max(0, (commenterProfile.totalLikes || 0) - likesToRemove),
              commentsPublished: Math.max(0, (commenterProfile.commentsPublished || 0) - commentsByThisUser),
            })
          );
        }
      }

      databaseWrites.push(
        ctx.db.delete(blogId),
        ...featuredBlogs.map((fb) => ctx.db.delete(fb._id)),
        ...blogVotes.map((bv) => ctx.db.delete(bv._id)),
        ...comments.map((c) => ctx.db.delete(c._id)),
        ...viewLogs.map((vl) => ctx.db.delete(vl._id)),
        ...commentVotes.map((cv) => ctx.db.delete(cv._id)),
        ...blogTags.map((bt) => ctx.db.delete(bt._id))
      );

      await Promise.all(databaseWrites);
    }

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

    const oldTags = currentPost.tags;
    const newTags = fieldsToUpdate.tags;

    if (JSON.stringify(oldTags) !== JSON.stringify(newTags)) {
      const existingBlogTags = await ctx.db
        .query("blogTags")
        .withIndex("by_blog", (q) => q.eq("blogId", blogId))
        .collect();

      const tagsToRemove = existingBlogTags.filter(
        (bt) => !newTags.includes(bt.tag)
      );

      const existingTagNames = existingBlogTags.map((bt) => bt.tag);
      const tagsToAdd = newTags.filter((tag) => !existingTagNames.includes(tag));

      const tagOperations = [
        ...tagsToRemove.map((bt) => ctx.db.delete(bt._id)),
        ...tagsToAdd.map((tag) => 
          ctx.db.insert("blogTags", {
            blogId,
            tag,
            username: fieldsToUpdate.username,
            createdAt: currentPost.createdAt,
            likes: currentPost.likes,
            hotScore: currentPost.hotScore,
            controversialScore: currentPost.controversialScore,
          })
        ),
      ];

      await Promise.all(tagOperations)
    }

    await ctx.db.patch(blogId, {
      ...fieldsToUpdate,
      imageUrl: finalImageUrl,
    });

    return blogId;
  },
});

export const getPaginatedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.optional(v.string()),
    activeTags: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.string()),
    author: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    const search = args.searchTerm?.trim();
    const tags = args.activeTags || [];
    const sort = args.sortOrder || "new";
    const authorFilter = args.author;

    let paginatedResults;

    if (search) {
      const queryInit = ctx.db.query("blogs");
      const finalQuery = queryInit.withSearchIndex("search_title", (q) => 
        q.search("title", search)
      );

      paginatedResults = await finalQuery.paginate(args.paginationOpts);
    } else {
      const queryInit = ctx.db.query("blogs");
      let finalQuery;

      if (authorFilter) {
        finalQuery = queryInit.filter((q) => q.eq(q.field("author"), authorFilter));
      } else {
        if (sort === "hot") {
          finalQuery = queryInit.withIndex("by_likes");
        } else if (sort === "top") {
          finalQuery = queryInit.withIndex("by_totalViews");
        } else {
          finalQuery = queryInit.withIndex("by_createdAt");
        }
      }
      
      paginatedResults = await finalQuery.order("desc").paginate(args.paginationOpts);
    }

    let filteredPage = paginatedResults.page;

    if (search && authorFilter) {
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

export const getPaginatedPostsByUsername = query({
  args: {
    activeTags: v.optional(v.array(v.string())),
    searchTerm: v.optional(v.string()),
    sortOrder: v.optional(v.string()),
    username: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const cleanSearchTerm = args.searchTerm?.trim();
    const sortOrder = args.sortOrder || "new";
    const tags = args.activeTags || [];

    if (cleanSearchTerm) {
      const searchResults = await ctx.db
        .query("blogs")
        .withSearchIndex("search_title", (q) =>
          q.search("title", cleanSearchTerm).eq("username", args.username)
        )
        .paginate(args.paginationOpts);

      if (tags.length > 0) {
        return {
          ...searchResults,
          page: searchResults.page.filter((blog) =>
            tags.some((tag) => blog.tags?.includes(tag))
          ),
        };
      }

      return searchResults;
    }


    if (tags.length > 0) {
      const primaryTag = tags[0];
      let tagQuery;

      if (sortOrder === "hot") {
        tagQuery = ctx.db
          .query("blogTags")
          .withIndex("by_tag_username_hot", (q) => q.eq("tag", primaryTag).eq("username", args.username))
          .order("desc");
      } else if (sortOrder === "controversial") {
        tagQuery = ctx.db
          .query("blogTags")
          .withIndex("by_tag_username_controversial", (q) => q.eq("tag", primaryTag).eq("username", args.username))
          .order("desc");
      } else if (sortOrder === "top") {
        tagQuery = ctx.db
          .query("blogTags")
          .withIndex("by_tag_username_likes", (q) => q.eq("tag", primaryTag).eq("username", args.username))
          .order("desc");
      } else {
        tagQuery = ctx.db
          .query("blogTags")
          .withIndex("by_tag_username_createdAt", (q) => q.eq("tag", primaryTag).eq("username", args.username))
          .order("desc");
      }

      const paginatedTagEntries = await tagQuery.paginate(args.paginationOpts);

      const blogPromises = paginatedTagEntries.page.map((item) => ctx.db.get(item.blogId));
      const blogs = await Promise.all(blogPromises);

      return {
        ...paginatedTagEntries,
        page: blogs.filter((b): b is NonNullable<typeof b> => b !== null)
      };
    }


    if (sortOrder === "hot") {
      return await ctx.db
        .query("blogs")
        .withIndex("by_username_hot", (q) => q.eq("username", args.username))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    if (sortOrder === "controversial") {
      return await ctx.db
        .query("blogs")
        .withIndex("by_username_controversial", (q) => q.eq("username", args.username))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    if (sortOrder === "top") {
      return await ctx.db
        .query("blogs")
        .withIndex("by_username_likes", (q) => q.eq("username", args.username))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("blogs")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .order("desc")
      .paginate(args.paginationOpts);
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